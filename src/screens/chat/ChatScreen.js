import {
  Pressable,
  StyleSheet,
  View,
  Platform,
  Image,
  Text,
  FlatList,
  StatusBar,
  ImageBackground,
} from 'react-native';
import React, {useEffect, useLayoutEffect, useState, useRef} from 'react';
import uuid from 'react-native-uuid';
import {useAuth} from '../../Contexts/Auth_Context';
import Contacts from 'react-native-contacts';
import {getandCreateChat} from '../../Requists';
import {socketIo, useSocket} from '../../Contexts/Socket_context';
import {ActivityIndicator} from 'react-native';
import Input from '../../components/Input';
import {useLocalDataBase} from '../../Contexts/LocalDataBase';
import {Icon, Avatar, Header, Button} from '@rneui/themed';
import {useCalling} from '../../Contexts/Call_Context';
import notifee, {AndroidImportance} from '@notifee/react-native';
import LinearGradient from 'react-native-linear-gradient';
import {formatDate, GetDateLastMessages} from '../../components/getTimeAr';
import { colors } from '../../assets/colors';

const ChatScreen = ({route, navigation}) => {
  const {item, newfriendData, checkChat} = route?.params;
  const {OnlineUsers} = useSocket();
  const flatlistRef = useRef(null);
  const {MyPeer} = useCalling();
  const {
    AllMessages,
    setAllMessages,
    saveMessage,
    getLastChats,
    saveLastChat,
    checkIsRead,
    getMessagesNotRead,
  } = useLocalDataBase();
  const {userData, Token} = useAuth();
  const [ChatLoading, setChatLoading] = useState(false);
  const [chatId, setchatId] = useState(null);
  const [friendId, setfriendId] = useState(null);
  const [messages, setmessages] = useState([]);
  const MessagesRef = useRef([]).current;
  const [mesgContent, setmesgContent] = useState('');
  const [freindData, setfreindData] = useState(null);
  const [OnceSaveCHat, setOnceSaveCHat] = useState(0);

  const checkChatsAndAdd = () => {
    const data = {
      myId: userData._id,
      friendId: newfriendData?._id,
    };
    getandCreateChat(data, Token)
      .then(data => {
        setChatLoading(false);
        const chat = JSON.parse(data.data.res);
        // console.log(chat,"[ <==== chat  ] ");
        const friend = chat.users.find(ite => ite !== userData?._id);
        setfriendId(friend);
        setchatId(chat._id);
      })
      .catch(err => console.log(err))
      .finally(()=>{
        setChatLoading(false);
      })
  };

  useEffect(() => {
    if (chatId) {
      socketIo.emit('joinToChat', chatId);
      checkIsRead(chatId);
      getMessagesNotRead();
      const mesg = AllMessages.filter(item => item.chat == chatId);
      setmessages(mesg);
      return () => {
        socketIo.emit('leaveFromChat', chatId);
      };
    }
  }, [chatId]);

  useEffect(() => {
    const clear = setTimeout(() => {
      if (checkChat) {
        setChatLoading(true);
        checkChatsAndAdd();
        setfreindData(newfriendData);
      } else {
        setchatId(item.chat);
        setfreindData(item.friendData);
        setfriendId(item.friendData.id);
      }
    }, 100);
    return () => {
      clearTimeout(clear);
      setmessages([]);
    };
  }, []);

  const sendMessage = () => {
    const messageId = uuid.v4();

    const SENDER = {
      username: userData?.username,
      image: userData?.image || "",
      id: userData?._id,
      phoneNumber: userData?.phoneNumber,
    };


    if (mesgContent !== '') {
      setmessages(o => [
        ...o,
        {
          id: messageId,
          content: mesgContent,
          sender: JSON.stringify(SENDER),
          chat: chatId,
          timestamp: Date.now(),
          isRead: '0',
        },
      ]);
      saveMessage({
        id: messageId,
        content: mesgContent,
        sender: JSON.stringify(SENDER),
        chat: chatId,
        timestamp: Date.now(),
        isRead: '1',
      })
        .then(suc => {
          if (checkChat && OnceSaveCHat == 0) {
            getLastChats()
              .then(last => {
                const findOne = last.find(item => item.chat == chatId);
                if (findOne) {
                  console.log('LAST CHAT FOUND :)');
                } else {
                  saveLastChat({
                    friendData: {
                      username: freindData?.username,
                      image: freindData?.image || "",
                      id: freindData?._id,
                      phoneNumber: freindData?.phoneNumber,
                    },
                    chat: chatId,
                  })
                    .then(o => {
                      setOnceSaveCHat(1);
                    })
                    .cach(err => console.log(err));
                }
              })
              .catch(err => console.log(err.message));
          }

        })
        .catch(err => {
          console.log(err.message);
        });

      

      socketIo.emit('sendNotifyNewMessage', [
        friendId,
        {
          id: messageId,
          content: mesgContent,
          sender: JSON.stringify(SENDER),
          chat: chatId,
          timestamp: Date.now(),
          isRead: '0',
        },
      ]);
      socketIo.emit('sendNewMessage', [
        friendId,
        {
          id: messageId,
          content: mesgContent,
          sender: JSON.stringify(SENDER),
          chat: chatId,
          timestamp: Date.now(),
          isRead: '0',
        },
      ]);
      setmesgContent('');
      
    }
  };

  const fourground = async () => {
    try {
      const channelId = await notifee.createChannel({
        id: 'screen_capture',
        name: 'Screen Capture',
        lights: true,
        vibration: false,
        importance: AndroidImportance.DEFAULT,
      });

      await notifee.displayNotification({
        title: 'دردشه',
        body: '',
        android: {
          channelId,
          asForegroundService: true,
        },
      });
    } catch (err) {
      throw new Error(err);
    }
  };

  const videoCallFun = async (chatId, friendId) => {
    console.log(MyPeer, '<<<< this is my peer id');
    if (MyPeer != null) {
      fourground()
        .then(() => {
          const SENDER = {
            username: userData?.username,
            image: userData?.image || "",
            id: userData?._id,
            phoneNumber: userData?.phoneNumber,
          };
          socketIo.emit('reqPeerId', {friendId, SENDER});
          navigation.navigate('VideoCall', {friendId, myData: SENDER});
        })
        .catch(err => {
          console.error(err);
        });
    }
  };

  const STATUSBAR_HEIGHT = StatusBar.currentHeight;

  // useEffect(() => {
  //   if (chatId) {
  //     const mesg = AllMessages.filter(item => item.chat == chatId);
  //     setmessages(mesg);
  //   }
  //   return () => {
  //     setmessages([]);
  //   };
  // }, [chatId]);

  useEffect(() => {
    socketIo.on('reciveNewMessage', data => {
      setmessages(o => [...o, data]);
    });
    return () => {
      setmessages([]);
    };
  }, []);

  useEffect(() => {
    const unsub = setTimeout(() => {
      checkIsRead(chatId);
    }, 100);
    return () => clearTimeout(unsub);
  }, [AllMessages]);

  return (
    <>
      <ImageBackground
        source={require('./../../assets/images/wallpaper.png')}
        imageStyle={{
          opacity: 0.5,
          width: '100%',
          height: '100%',
          tintColor: '#0B1A90',
        }}
        style={{flex: 1, backgroundColor: '#fff'}}>
        <LinearGradient
          colors={[colors.primary, colors.primary]}
          start={{x: 0, y: 2}}
          end={{x: 0, y: 0}}
          style={{
            borderRadius: 10,
            flexDirection: 'row',
            alignItems: 'center',
            borderTopRightRadius: 0,
            borderTopLeftRadius: 0,
            paddingVertical: 5,
            paddingTop: STATUSBAR_HEIGHT,
          }}>
          <StatusBar translucent={true} backgroundColor={'transparent'} />

          <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
            <View>
              <Icon
                name="arrow-right"
                type="feather"
                size={20}
                color={'#fff'}
                onPress={() => navigation.goBack()}
                style={{paddingLeft: 8, paddingRight: 5, paddingVertical: 10}}
              />
            </View>
            <Avatar
              size={50}
              rounded
              icon={{name: 'user', type: 'ant-design'}}
              // containerStyle={{borderColor: '#fff', backgroundColor: '#974ECF'}}
              source={
                !freindData?.image || (freindData?.image == 'image-user.png' || freindData?.image == "")
                  ? require('../../assets/images/user-image.png')
                  : {uri: freindData?.image}
              } 
            />
            <View style={{width: '70%', marginHorizontal: 5}}>
              <Text
                numberOfLines={1}
                style={{
                  color: '#fff',
                  fontSize: 15,
                  paddingHorizontal: 5,
                  fontWeight: 'bold',
                  width: '70%',
                  textAlign: 'left',
                }}>
                {freindData?.username}
              </Text>
              {OnlineUsers?.includes(freindData?.id) && (
                <Text
                  numberOfLines={1}
                  style={{
                    color: '#fff',
                    fontSize: 10,
                    paddingHorizontal: 5,
                    fontWeight: 'bold',
                    width: '70%',
                    textAlign: 'left',
                  }}>
                  متصل الآن
                </Text>
              )}
            </View>
          </View>

          <View style={{flexDirection: 'row', marginHorizontal: 5}}>
            {/* <Icon size={20} name='video-camera' type="font-awesome"  color={"#fff"} onPress={()=>{}} style={{padding:8,}} />
          <Icon size={20} name='phone' type="entypo" color={"#fff"} onPress={()=>{}} style={{padding:8,}} /> */}
            <Icon
              size={20}
              name="dots-vertical"
              type="material-community"
              color={'#fff'}
              onPress={() => {
                console.log(freindData);
              }}
              style={{padding: 8}}
            />
          </View>
        </LinearGradient>

        <FlatList
          data={[...messages]}
          ref={flatlistRef}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            flatlistRef.current.scrollToEnd({animated: true})
          }
          onLayout={() => flatlistRef.current.scrollToEnd({animated: true})}
          keyExtractor={(_, x) => x.toString()}
          renderItem={({item, index}) => {
            const compar = JSON.parse(item.sender).id == userData?._id;
            return (
              <>
                {
                  <GetDateLastMessages
                    messages={[...messages]}
                    date={JSON.parse(item.timestamp)}
                    item={item}
                    index={index}
                  />
                }
                {/* <Button title={"meesaeg"} onPress={()=>{
              console.log(messages[0]);
            }} /> */}
                <LinearGradient
                  colors={compar ? [colors.primary, colors.primary] : [colors.light, colors.light]}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={{
                    alignSelf:
                      JSON.parse(item.sender).id == userData?._id
                        ? 'flex-start'
                        : 'flex-end',
                    paddingTop: 5,
                    paddingHorizontal: 10,
                    marginVertical: 5,
                    borderTopRightRadius: compar ? 0 : 15,
                    borderBottomRightRadius: compar ? 15 : 15,
                    borderTopLeftRadius: compar ? 15 : 0,
                    borderBottomLeftRadius: compar ? 15 : 15,
                    margin: 5,
                    marginLeft: compar ? 5 : 50,
                    marginRight: compar ? 50 : 5,
                    elevation: 10,
                  }}>
                  <Text
                    style={{
                      color: compar ? '#fff' : '#0B1A80',
                      fontSize: 15,
                      // height:25
                      // backgroundColor:"#fff",
                    }}>
                    {item.content}
                  </Text>
                  <Text
                    style={{
                      color: compar ? '#fff' : '#0B1A80',
                      fontSize: 10,
                      textAlign: 'left',
                      padding: 1,
                      // position: 'absolute',
                      // bottom: 3,
                      // right: 5,
                    }}>
                    {' '}
                    {formatDate(JSON.parse(item.timestamp))}{' '}
                  </Text>
                </LinearGradient>
              </>
            );
          }}
        />

        <View>
          <View style={styles.inpt}>
            <View style={{flex: 1}}>
              <Input
                placeholder="اكتب ..."
                bg={"#fff"}
                bw={2}
                bc={colors.secondry}
                e={0}
                shc="#08d"
                br={10}
                ph={20}
                mult
                icn2="send"
                ict2="font-awesome"
                icc2="#08d"
                value={mesgContent}
                onChangeText={t => setmesgContent(t)}
              />
            </View>

            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#fff',
                padding: 5,
                elevation: 10,
                shadowColor: '#08d',
                transform: [{rotate: '180deg'}],
                overflow: 'hidden',
              }}>
              <Icon
                name="send-sharp"
                type="ionicon"
                containerStyle={{borderRadius:500}}
                style={{
                  width: 40,
                  height: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                color={colors.secondry}
                size={30}
                onPress={() => {
                  // sendMessage();
                }}
              />
            </View>
          </View>
        </View>

        {ChatLoading && (
          <View
            style={{
              backgroundColor: '#3335',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              width: '100%',
              height: '100%',
            }}>
            <View
              style={{
                backgroundColor: '#fff',
                padding: 50,
                paddingHorizontal: 20,
                borderRadius: 20,
                flexDirection: 'row',
                elevation: 10,
                shadowColor: '#fff',
              }}>
              <Text> جاري التحقق من {'\n'} جهة الاتصال ...</Text>
              <ActivityIndicator size={40} color="#08d" />
            </View>
          </View>
        )}
      </ImageBackground>
    </>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  inpt: {
    overflow: 'hidden',
    marginTop: 0,
    // elevation: 5,
    // borderTopWidth: 1,
    // backgroundColor: '#fff',
    // height: 50,
    // borderColor: '#08d5',
    flexDirection: 'row',
    alignItems: 'center',
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    padding: 5,
    backgroundColor:"#fff"
  },
});
