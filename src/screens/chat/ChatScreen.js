import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Keyboard,
  Animated,
  Easing,
} from 'react-native';
import React, {useEffect, useState, useRef, useLayoutEffect} from 'react';
import uuid from 'react-native-uuid';
import {useAuth} from '../../Contexts/Auth_Context';
import {getandCreateChat} from '../../Requists';
import {socketIo, useSocket} from '../../Contexts/Socket_context';
import {ActivityIndicator} from 'react-native';
import Input from '../../components/Input';
import {useLocalDataBase} from '../../Contexts/LocalDataBase';
import {Icon, Avatar} from '@rneui/base';
import {useCalling} from '../../Contexts/Call_Context';
import notifee, {AndroidImportance} from '@notifee/react-native';
import LinearGradient from 'react-native-linear-gradient';
import {formatDate, GetDateLastMessages} from '../../components/getTimeAr';
import {colors} from '../../assets/colors';
import EmojiPicker, {EmojiKeyboard} from 'rn-emoji-keyboard';
import {FlashList} from '@shopify/flash-list';
import { chatBackHandler } from './chatBackHandler';
import AlertDialog from '../../components/AlertDialog';
import {useMessagesStatusChecker} from "../../hooks/useMessagesStatusChecker"
import {removeMessagesRemoved,setMessagesRemoved} from "../../hooks/useMessagesRemovedOfflineChecker"
const STATUSBAR_HEIGHT = StatusBar.currentHeight;

const ChatScreen = ({route, navigation}) => {


  // const [animatedKeyEmojis] = useState(new Animated.Value(-300));
  // const [showEmoji, setshowEmoji] = useState(false);
  // const inputRef = useRef(null)
  // const animatEmoji= event => {
  //   if (event) {
  //     Keyboard.dismiss()
  //     setshowEmoji(true);
  //     Animated.spring(animatedKeyEmojis, {
  //       toValue: 0,
  //       duration: 1000,
  //       useNativeDriver: false,
  //       easing: Easing.elastic(1),
  //     }).start();
  //   } else {
  //     setshowEmoji(false);
  //     Animated.spring(animatedKeyEmojis, {
  //       toValue: -300,
  //       duration: 1,
  //       speed:100,
  //       useNativeDriver: false,
  //       easing: Easing.elastic(1),

  //     }).start();
  //   }
  // };

  // const keyboardHeight = useKeyboardHeight()


  

  const {item, newfriendData, checkChat} = route?.params;
  const {OnlineUsers} = useSocket();
  const flatlistRef = useRef(null);
  const {MyPeer} = useCalling();
  const {
    AllMessages,
    saveMessage,
    getLastChats,
    saveLastChat,
    changeMessageStatus,
    deleteMessagesByIds
  } = useLocalDataBase();
  const {userData, Token} = useAuth();

  const [ChatLoading, setChatLoading] = useState(false);
  const [chatId, setchatId] = useState(null);
  const [friendId, setfriendId] = useState(null);
  const [messages, setmessages] = useState([]);
  const [mesgContent, setmesgContent] = useState('');
  const [freindData, setfreindData] = useState(null);
  const [OnceSaveCHat, setOnceSaveCHat] = useState(0);
  const [showMDLDelMessages, setshowMDLDelMessages] = useState(false)
  const [selecetedMessages, setselecetedMessages] = useState([])
  const [isReciverSelctedMessage, setisReciverSelctedMessage] = useState(false)

  const MessagesRef = useRef([]).current;
  const [showEmojiModel, setshowEmojiModel] = useState(false);
  const [emojis, setemojis] = useState('');

  const cleanChannels = async () => {
    //     await notifee.deleteChannelGroup({id: (chatId + "group") || "group"},);
    //  await notifee.deleteChannel({id:chatId || "channelID",})
  };
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
      .finally(() => {
        setChatLoading(false);
      });
  };

  useLayoutEffect(()=>{
    if (chatId && friendId)   {
    const mesg = AllMessages.filter(item => item.chat == chatId);
     setmessages(mesg);
   }
  },[chatId,friendId])

  useMessagesStatusChecker({friendId,chatId,AllMessages,userData,setmessages})

  // useLayoutEffect(() => {
  //   if (chatId && friendId) {
  //     const mesg = AllMessages.filter(item => item.chat == chatId);
  //     const messageNotRead = mesg.filter(ele => {
  //       const sender =
  //         ele?.isRead != '2' && JSON?.parse(ele?.sender)?.id != userData?._id;
  //       return sender;
  //     }).map(ele => ele?.id);
  //     socketIo?.emit('sendChangeMessageStatus', {
  //       messagesIds: messageNotRead,
  //       status: '2',
  //       toId: friendId,
  //     },(res)=>{
  //       if (res.isSent && messageNotRead.length != 0) {
  //         changeMessageStatus(messageNotRead,"2").then(()=>{
  //         setmessages((o)=>o.map((ele)=>{
  //         const find = messageNotRead.find(e=> e == ele?.id)
  //         if (find) {
  //           return {...ele,isRead:"2"}
  //         }else{
  //           return ele
  //         }
  //       }))
  //         })
  //       }
  //     });
      
  //   }
  //   return ()=>{
  //     // socketIo?.off('sendChangeMessageStatus')
  //   }
  // }, [chatId,friendId,AllMessages]);

  useEffect(() => {
    if (chatId) {
      socketIo.emit('joinToChat', chatId);
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
    }, 50);
    return () => {
      clearTimeout(clear);
      setmessages([]);
    };
  }, []);


  const sendMessage = async () => {
    const messageId = uuid.v4();

    const SENDER = {
      username: userData?.username,
      image: userData?.image || '',
      id: userData?._id,
      phoneNumber: userData?.phoneNumber,
      FCMtoken: userData?.FCMtoken || '',
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
        userData?.FCMtoken,
      ],()=>{
        changeMessageStatus([messageId],"1")
        setmessages(o=>o.map((ele)=>{
          if (ele.id == messageId) {
            return {...ele,isRead:"1"}
          }else{
            return ele
          }
        }))
      });
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

      
      saveMessage({
        id: messageId,
        content: mesgContent,
        sender: JSON.stringify(SENDER),
        chat: chatId,
        timestamp: Date.now(),
        isRead: '0',
      })
        .then(suc => {
          if (checkChat && OnceSaveCHat == 0) {
            getLastChats()
              .then(last => {
                const findOne = last.find(item => item.chat == chatId);
                if (findOne) {
                  // console.log('LAST CHAT FOUND :)');
                } else {
                  saveLastChat({
                    friendData: {
                      username: freindData?.username,
                      image: freindData?.image || '',
                      id: freindData?._id,
                      phoneNumber: freindData?.phoneNumber,
                      FCMtoken: freindData?.FCMtoken,
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

      // socketIo.emit('sendNotifyNewMessage', [
      //   friendId,
      //   {
      //     id: messageId,
      //     content: mesgContent,
      //     sender: JSON.stringify(SENDER),
      //     chat: chatId,
      //     timestamp: Date.now(),
      //     isRead: '0',
      //   },
      //   userData?.FCMtoken,
      // ],()=>{
      //   // changeMessageStatus([messageId],"1")
      //   setmessages(o=>o.map((ele)=>{
      //     if (ele.id == messageId) {
      //       return {...ele,isRead:"1"}
      //     }else{
      //       return ele
      //     }
      //   }))
      // });
      // socketIo.emit('sendNewMessage', [
      //   friendId,
      //   {
      //     id: messageId,
      //     content: mesgContent,
      //     sender: JSON.stringify(SENDER),
      //     chat: chatId,
      //     timestamp: Date.now(),
      //     isRead: '0',
      //   },
      //   {
      //     senderToken: userData?.FCMtoken,
      //     reciverToken: freindData?.FCMtoken,
      //   },
      // ]);
      setmesgContent('');
    }
  };

  const delMessages = (all) => { 
    const arr = messages.filter((e)=> !selecetedMessages.find((im)=>im.id == item.id) )
    setmessages((o)=> arr )
    const messagesRemoved = selecetedMessages.map((ele)=>ele.id);
     if (all) {
       deleteMessagesByIds(messagesRemoved).then(()=>{
        setMessagesRemoved(friendId,{messagesIds:messagesRemoved,toId:friendId})
        socketIo?.emit("delMessages",{messagesIds:messagesRemoved,toId:friendId},() => {
          removeMessagesRemoved(friendId)
        });
      })
     }else{
      deleteMessagesByIds(messagesRemoved)
     }
  }
 
  

  useEffect(() => {
    notifee.cancelDisplayedNotifications();
    socketIo.on('reciveNewMessage', data => {
      setmessages(o=>[...o,{...data,isRead:"2"}])
    });

    socketIo.on("reciveChangeMessageStatus",(data)=>{
        setmessages((o)=>o.map((ele)=>{
          const find = data.messagesIds.find(e=> e == ele?.id)
          if (find) {
            return {...ele,isRead:data.status}
          }else{
            return ele
          }
        }))
    })
    return () => {
      setmessages([]);
      socketIo?.off("reciveNewMessage");
      // socketIo?.off("reciveChangeMessageStatus");
    };
  }, []);


  chatBackHandler(selecetedMessages,setselecetedMessages)
  return (
    <>
      <View style={{flex: 1, backgroundColor: colors.white}} >

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
            elevation: 10,
            shadowColor: colors.primary,
            paddingVertical: 10,
          }}>
          <StatusBar translucent={true} backgroundColor={'transparent'} />

          <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
            <View style={{borderRadius: 10, overflow: 'hidden'}}>
              <Icon
                name="arrow-right"
                type="feather"
                size={20}
                color={'#fff'}
                containerStyle={{borderRadius: 10, overflow: 'hidden'}}
                onPress={() => navigation.goBack()}
                style={{paddingLeft: 8, paddingRight: 8, paddingVertical: 10}}
              />
            </View>
            <Avatar
              size={45}
              rounded
              // style={{}}
              icon={{name: 'user', type: 'ant-design'}}
              // containerStyle={{borderColor: '#fff', backgroundColor: '#974ECF'}}
              source={
                !freindData?.image ||
                freindData?.image == 'image-user.png' ||
                freindData?.image == ''
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
            {selecetedMessages?.length >= 1 && <Icon
              size={20}
              name="delete"
              type="material-community"
              color={'#fff'}
              onPress={() => {
                setshowMDLDelMessages(true)
              }}
              style={{padding: 8}}
            />}
          </View>
        </LinearGradient>

        <FlashList
          data={[...messages].reverse()}
          ref={flatlistRef}
          inverted
          estimatedItemSize={150}
          showsVerticalScrollIndicator={false}
          renderToHardwareTextureAndroid
          keyExtractor={(_, x) => x.toString()}
          ListFooterComponent={
            <View
              style={{
                backgroundColor: colors.light,
                margin: 20,
                padding: 10,
                alignItems: 'center',
                borderRadius: 15,
                elevation: 0,
                shadowColor: colors.primary,
              }}>
              <Text
                style={{
                  color: colors.secondry,
                  fontWeight: '700',
                  textAlign: 'center',
                }}>
                {' '}
                جميع الرسائل تكون محفوظة عند الطرفين {'\n'} ترسل الرسائل مشفرة
                الى الطرف الآخر {'\n'} لا يتم حفظ اي معلومات في قواعد بياناتنا{' '}
              </Text>
            </View>
          }
          renderItem={({item, index}) => {
            const compar = JSON.parse(item.sender).id !== userData?._id;
            // const isSelcted = selecetedMessages?.find((ele)=> ele == item.id) || false
            return (
              <TouchableOpacity
                onPress={() => {
                  console.log(item);
                  if (selecetedMessages?.length >= 1) {
                    (selecetedMessages?.find((e)=> e.id == item.id))
                    ? setselecetedMessages(o=>o.filter((e)=> e.id != item.id))
                    :  setselecetedMessages(o=>[...o,item])
                  }
                }}
                onLongPress={()=>{
                  (selecetedMessages?.find((e)=> e.id == item.id))
                    ? setselecetedMessages(o=>o.filter((e)=>e.id != item.id))
                    :  setselecetedMessages(o=>[...o,item])
                }}
                style={{
                  backgroundColor: selecetedMessages.find((im)=>im.id == item.id) ? "#eef" : "#0000",
                  marginVertical:1
                }}>
                {
                  <GetDateLastMessages
                    messages={[...messages]}
                    date={+JSON.parse(item.timestamp)}
                    item={item}
                    index={index}
                  />
                }
                <View
                  style={{
                    flexDirection: compar ? 'row' : 'row-reverse',
                    // alignItems: 'center',
                    
                  }}>
                  <LinearGradient
                    colors={
                      !compar
                        ? [colors.light, colors.light]
                        : [colors.light, colors.light]
                    }
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    
                    style={{
                      alignSelf: compar ? 'flex-start' : 'flex-end',
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
                      padding: 10,
                      paddingHorizontal: 15,
                      alignItems: 'center',
                      justifyContent: 'center',
                      maxWidth: '85%',
                      borderBottomWidth:2,
                      borderLeftWidth:compar ? 2 : 0,
                      borderRightWidth:!compar ? 2 : 0,
                      borderColor:compar ?colors.secondry:colors.primary
                    }}>
                    <Text
                      style={{
                        color: !compar ? colors.primary : colors.secondry,
                        fontSize: 15,
                        fontWeight: '600',
                        textAlignVertical: 'center',
                        paddingVertical:5
                      }}>
                      {item.content}
                    </Text>
                  </LinearGradient>
                  <View
                    style={{paddingVertical:10,alignItems:"center",justifyContent:'flex-end',}}>
                    { !compar &&
                    <Icon
                      name={
                        item?.isRead == '2'
                          ? 'checkmark-done'
                          : item.isRead == '1'
                          ? 'checkmark'
                          : 'time-outline'
                      }
                      type="ionicon"
                      color={true ? colors.primary : colors.secondry}
                      size={15}
                    />}
                    <Text
                      style={{
                        color: compar ? colors.primary : colors.secondry,
                        fontSize: 12,
                        textAlign: 'left',
                        padding: 1,
                        marginHorizontal: 10,
                        fontWeight: 'bold',
                      }}>
                      {formatDate(+JSON.parse(item.timestamp))}
                      {}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />

        <View>
          {/* <Text>{}</Text> */}
          <View style={styles.inpt}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingEnd: 5,
              }}>
              {/* <Icon
                name={"emoji-happy"}
                type="entypo"
                color={colors.secondry}
                containerStyle={{borderRadius:50,overflow:"hidden"}}
                underlayColor={colors.secondry}
                style={{padding:5,}}
                
              /> */}
            </View>
            <View style={{flex: 2}}>
              <Input
                placeholder="اكتب ..."
                bg={'#fff'}
                bw={1}
                bc={mesgContent != ""?colors.primary:colors.secondry}
                mh={5}
                e={0}
                shc="#08d"
                br={50}
                ph={15}
                // multH={100}
                mult
                fc={colors.typograf}
                icn2="send"
                ict2="font-awesome"
                icc2="#08d"
                value={mesgContent}
                // focusAndBlur={!emojis}
                onChangeText={t => setmesgContent(t)}
              />
            </View>

            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                backgroundColor:
                  mesgContent != '' ? colors.primary : colors.secondry,
                borderRadius: 50,
                height:50,
                // flex:1
              }}>
              <Icon
                name="send"
                type="font-awesome"
                containerStyle={{borderRadius: 500}}
                underlayColor={colors.light}
                style={{
                  // paddingHorizontal:15,

                  padding: 15,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                disabled={mesgContent == ''}
                disabledStyle={{backgroundColor: '#0000'}}
                color={colors.light}
                size={20}
                onPress={() => {
                  sendMessage();
                }}
              />
            </View>
          </View>

          {/* <EmojiPicker
          allowMultipleSelections
          enableSearchBar={false}
           
           onEmojiSelected={(e)=>{
            // console.log(e.emoji);
          }} open={showEmojiModel} onClose={() => setshowEmojiModel(false)} /> */}
        </View>
        {/* <Animated.View style={{height:300,marginBottom:animatedKeyEmojis,}} >
          <View style={{backgroundColor:"#fff",paddingVertical:5,flexDirection:"row",paddingHorizontal:20}} >
            <Icon name='delete' type='feather' color={colors.secondry} size={30} onPress={()=>{
              const mesg = mesgContent.slice(0, -1)
              setmesgContent(mesg)
            }} />
          </View>
          <EmojiKeyboard
            emojiSize={25}
            enableSearchBar={false}
            hideHeader
            styles={{container:{
              backgroundColor:"#fff",
              borderRadius:0,
              elevation:0
            }}}
            onEmojiSelected={(e)=>{
              // console.log(e.emoji);
              console.log(e);
              setmesgContent((o)=>o.concat(e.emoji || ""))
            }}
            // allowMultipleSelections
            />
        </Animated.View> */}

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


        {/* models */}

        <AlertDialog 
        data={{
          title:`حذف ${selecetedMessages.length} رسالة ؟`,
          body:"هل تود حذف الرسائل المحدده؟",
          visible:showMDLDelMessages,

        }} btns={{
          acceptBtnTitle:"حذف عندي",
          rejectBtnTitle:"حذف عند الكل ",
          acceptBtnPress:()=>{delMessages(false);setshowMDLDelMessages(false);setselecetedMessages([])},
          rejectBtnPress:()=>{delMessages(true);setshowMDLDelMessages(false);setselecetedMessages([])},
        }}
        setState={setshowMDLDelMessages}
        showBtnReject={!!!selecetedMessages.find((ele)=> JSON.parse(ele?.sender).id !== userData?._id)}
        />


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
    alignItems: 'flex-end',
    padding: 5,
    backgroundColor: '#fff',
    margin: 5,
    borderRadius: 25,
    borderColor: colors.secondry,
  },
});
