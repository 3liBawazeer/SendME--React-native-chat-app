import {
  Pressable,
  StyleSheet,
  View,
  Platform,
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
import {Icon, Avatar, Header, Button} from '@rneui/base';
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

  const cleanChannels = async () => { 
//     await notifee.deleteChannelGroup({id: (chatId + "group") || "group"},);

//  await notifee.deleteChannel({id:chatId || "channelID",})
   }
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
      cleanChannels()
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
      FCMtoken:userData?.FCMtoken || ""
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
                      FCMtoken:freindData?.FCMtoken
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
        userData?.FCMtoken
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
        {
          senderToken:userData?.FCMtoken,
          reciverToken:freindData?.FCMtoken,
        }
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
      <View
        // source={require('./../../assets/images/wallpaper.png')}
        // imageStyle={{
        //   opacity: 0.5,
        //   width: '100%',
        //   height: '100%',
        //   tintColor: '#0B1A90',
        // }}
        style={{flex: 1, backgroundColor: colors.light}}>
        <LinearGradient
          colors={[colors.primary, colors.primary]}
          start={{x: 0, y: 2}}
          end={{x: 0, y: 0}}
          style={{
            borderRadius: 15,
            flexDirection: 'row',
            alignItems: 'center',
            borderTopRightRadius: 0,
            borderTopLeftRadius: 0,
            paddingVertical: 5,
            paddingTop: STATUSBAR_HEIGHT,
            elevation:10,
            shadowColor:colors.primary,
            paddingVertical:15
          }}>
          <StatusBar translucent={true} backgroundColor={'transparent'} />

          <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
            <View style={{borderRadius:10,overflow:"hidden"}} >
              <Icon
                name="arrow-right"
                type="feather"
                size={20}
                color={'#fff'}
                containerStyle={{borderRadius:10,overflow:"hidden"}}
                onPress={() => navigation.goBack()}
                style={{paddingLeft: 8, paddingRight: 8, paddingVertical: 10,}}
              />
            </View>
            <Avatar
              size={45}
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
                    color: colors.light,
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
            const compar = JSON.parse(item.sender).id !== userData?._id;
            return (
              <View style={{}} >
                {
                  <GetDateLastMessages
                    messages={[...messages]}
                    date={JSON.parse(item.timestamp)}
                    item={item}
                    index={index}
                  />
                } 
                <View style={{flexDirection:compar ?"row":"row-reverse",alignItems:"center",}} >
                <LinearGradient
                  colors={compar ? [colors.primary, colors.primary] : [colors.secondry, colors.secondry]}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={{
                    alignSelf:
                      compar
                        ? 'flex-start'
                        : 'flex-end',
                    // paddingTop: 5,
                    marginVertical: 5,
                    borderTopRightRadius: compar ? 0 : 15,
                    borderBottomRightRadius: compar ? 15 : 15,
                    borderTopLeftRadius: compar ? 15 : 0,
                    borderBottomLeftRadius: compar ? 15 : 15,
                    margin: 5,
                    // marginLeft: compar ? 5 : 50,
                    // marginRight: compar ? 50 : 5,
                    // elevation: 10,
                    padding:10,
                    paddingHorizontal:15,
                    alignItems:"center",
                    justifyContent:"center",
                    maxWidth:"85%"
                  }}>
                  <Text
                    style={{
                      color: compar ? colors.light : colors.light,
                      fontSize: 15,
                      fontWeight:"600",
                      textAlignVertical:"center"
                    }}>
                    {item.content}
                  </Text>
                  
                </LinearGradient>
                <View style={{alignItems:"center",justifyContent:'center',}} >
                  {/* <Icon name="check" color={colors.green} size={15} /> */}
                <Text
                    style={{
                      color: compar ? colors.primary : colors.secondry,
                      fontSize: 12,
                      textAlign: 'left',
                      padding: 1,
                      marginHorizontal:10,
                      fontWeight:"bold"
                    }}>
                    {formatDate(JSON.parse(item.timestamp))}{' '}
                </Text>
                </View>
                </View>
              </View>
            );
          }}
        />

        <View>
          <View style={styles.inpt}>
            <View style={{flex: 1}}>
              <Input
                placeholder="اكتب ..."
                bg={"#fff"}
                bw={0}
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
                overflow: 'hidden',
                backgroundColor:mesgContent != "" ? colors.primary : colors.secondry,
                borderRadius:50,
                
              }}>
              <Icon
                name="send"
                type="font-awesome"
                containerStyle={{borderRadius:500}}
                style={{
                  paddingHorizontal:15,
                  padding:15,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                disabled={mesgContent != ""}
                color={colors.light}
                size={20}
                onPress={() => {
                  sendMessage();
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
      </View>
    </>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  inpt: {
    overflow: 'hidden',
    marginTop: 0,
    flexDirection: 'row-reverse',
    // alignItems: 'center',
    // borderTopEndRadius: 10,
    // borderTopStartRadius: 10,
    padding: 5,
    backgroundColor:"#fff",
    margin:10,
    borderRadius:50,
    // borderWidth:2,
    borderColor:colors.secondry
  },
});
