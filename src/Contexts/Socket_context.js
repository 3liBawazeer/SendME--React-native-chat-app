import React, {useEffect, useState, useContext, createContext} from 'react';
import {StyleSheet, AppState} from 'react-native';
import socket from 'socket.io-client';
import {BACK_END_URL} from '../Requists';
import {useAuth} from './Auth_Context';
import {useLocalDataBase} from './LocalDataBase';
import messaging from '@react-native-firebase/messaging';
import {displayNotfee} from './notificationHandler';
let socketIo;
let serverPeer;
import uuid from 'react-native-uuid';
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation, useRoute} from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
const socketContext = createContext();

const Socket_context = ({children}) => {


  const {userData} = useAuth();
  const {
    LastChats,
    setLastChats,
    saveMessage, 
    getLastChats, 
    saveLastChat, 
    getMessagesNotRead,
    changeMessageStatus,
    AllMessages,
    setAllMessages,
  } = useLocalDataBase();
  const [netConnection, setnetConnection] = useState({
    isConnected: false,
    net: false,
  });
  const [OnlineUsers, setOnlineUsers] = useState([]);
  const [checkMessages, setcheckMessages] = useState(true)


  useEffect(() => {
    if (userData != null && userData?._id) {
      socketIo = socket(BACK_END_URL, {query: {userId: userData._id}})
      socketIo.on('connect', () => {
        console.log('user connected in client ... !');
      });
      socketIo.emit('joinNotificationRoom', {userId: userData._id});
    }
    return () => {
      socketIo?.disconnect();
      socketIo?.emit('leaveApp', userData?._id);
      socketIo?.off('joinNotificationRoom');
    };
  }, [userData,netConnection]);

  useEffect(() => {
         setcheckMessages(()=>true)
      if (!netConnection.isConnected) {
        setcheckMessages(false)
      }else{
       
        socketIo?.emit('getMessagesStatus_Requist', {userId: userData?._id});
        socketIo?.emit("getOnlineUsers","")
      }
      socketIo?.on('getMessagesStatus_Responsive', data => {
        if (data?.length != 0) {
          let arr = []
          data.map((ele)=>{
            arr.push(...ele.messagesIds)
          });
          console.log(arr);
          changeMessageStatus(arr,"2")
        }
        setcheckMessages(false)
      });
      return () =>{
        socketIo?.off('getUnReadMessages_Requist');
        socketIo?.off('getUnReadMessages_Responsive');
        socketIo?.off('getOnlineUsers');
        setcheckMessages(false)
      }
  }, [netConnection,userData?._id])
  

  useEffect(() => {
    socketIo?.on('reciveNotifyNewMessage', (data) => {
      const findChat = LastChats.find(item => item.chat == data.chat);
      reciveMessagesfun(data,!!findChat)
      // socketIo?.emit('sendChangeMessageStatus', {
      //   messagesIds: [data.id],
      //   status: '1',
      //   toId: JSON.parse(data?.sender)?.id,
      // },(res) => {
      //   if (res.isSent) {
      //     changeMessageStatus([data.id],"1")
      //   }
      // });
    });
    socketIo?.on('onlineUsers', data => {
      setOnlineUsers(data);
    });

   

    return () => {
      socketIo?.off('reciveNotifyNewMessage');
      socketIo?.off('sendChangeMessageStatus');
      socketIo?.off('onlineUsers');
      
    };
  }, [socketIo]);

  useEffect(() => {
    socketIo?.on("reciveChangeMessageStatus",(data)=>{
      changeMessageStatus([...data.messagesIds],data.status).then(()=>{
        // setAllMessages((o)=>o.map((ele)=>{
        //   const find = data.messagesIds.find(e=> e == ele.id )
        //   if (find) {
        //     return {...ele,isRead:data.status}
        //   }else{
        //     return ele
        //   }
        // }))
      })
        
    });
    return ()=>{
      socketIo?.off('reciveChangeMessageStatus');
    }
  }, [socketIo])
  

  useEffect(() => {
    notifee.onForegroundEvent(async ({type, detail}) => {
      const {notification, pressAction, input} = detail;

      if (type === EventType.ACTION_PRESS && pressAction.id == 'reply') {
        if (detail?.notification?.data) {
          sendMessage(input, detail?.notification?.data);
        }
      }
    });
    const unsubscribe = NetInfo.addEventListener(state => {
      // console.log("STATE", state );
      setnetConnection(o => ({...o, isConnected: state.isConnected}));
    });

    // Unsubscribe
    return () => {
      unsubscribe();
    };
  }, []);



  const sendMessage = async (input, ids) => {
    let user = await AsyncStorage.getItem('user');
    user = JSON.parse(user);

    const chatId = ids.chatId;
    const friendId = ids.friendId;
    const friendData = ids.friendData;
    const messageId = uuid.v4();
    let SENDER = {
      username: user?.username,
      image: user?.image || '',
      id: user?._id,
      phoneNumber: user?.phoneNumber,
    };

    if (input !== '') {
      const sendData = [
        friendId,
        {
          id: messageId,
          content: input,
          sender: JSON.stringify(SENDER),
          chat: chatId,
          timestamp: Date.now(),
          isRead: '0',
        },
        {
          senderToken: user?.FCMtoken,
          reciverToken: friendData?.FCMtoken,
        },
      ];
      socketIo.emit('sendNotifyNewMessage', sendData,()=>{
        changeMessageStatus([messageId],"1")
      });
      socketIo.emit('sendNewMessage', sendData);
      saveMessage({
        id: messageId,
        content: input,
        sender: JSON.stringify(SENDER),
        chat: chatId,
        timestamp: Date.now(),
        isRead: '0',
      })
        .then(suc => {
          getLastChats()
            .then(last => {
              const findOne = last.find(item => item.chat == chatId);
              if (findOne) {
                // console.log('LAST CHAT FOUND :)');
              } else {
                saveLastChat({
                  friendData,
                  chat: chatId,
                })
                  .then(o => {
                    // setOnceSaveCHat(1);
                  })
                  .cach(err => console.log(err));
              }
            })
            .catch(err => console.log(err.message));
        })
        .catch(err => {
          console.log(err.message);
        });
    }
  };



  const reciveMessagesfun = (data,newChat) => {

    const findOne = LastChats.find(item => item.chat == data.chat);
    // console.log(!!findOne,"this params true if we want toadd new chat");

    displayNotfee(data);
    saveMessage({
      id: data.id,
      content: data.content,
      sender: data.sender,
      chat: data.chat,
      timestamp: data.timestamp,
      isRead: data.isRead,
    })
      .then(suc => {
        if (!findOne && newChat) {
          const frind = {
            friendData: JSON.parse(data.sender),
            chat: data.chat,
          }
          saveLastChat(frind).then(()=>{

          }).cach((err)=>{
            console.log("error on save last chat",err);
          })
        } else {
           
        }


        // getLastChats()
        //   .then(last => {
        //     const findOne = last.find(item => item.chat == data.chat);
        //     if (findOne) {
        //       // console.log('LAST CHAT FOUND :)');
        //     } else {
        //       saveLastChat({
        //         friendData: JSON.parse(data.sender),
        //         chat: data.chat,
        //       })
        //         .then(o => {})
        //         .cach(err => console.log(err));
        //     }
        //   })
        //   .catch(err => {console.log(err)});
      })
      .catch(err => {
        console.log(err);
      });

    getMessagesNotRead();
  };

  notifee.onBackgroundEvent(async ({type, detail}) => {
    const {notification, pressAction, input} = detail;

    if (type === EventType.ACTION_PRESS && pressAction.id != '') {
      switch (pressAction.id) {
        case 'reply':
          sendMessage(input, detail?.notification?.data);
          break;

        default:
          break;
      }
      await notifee.cancelNotification(notification.id);
    }
  });
  messaging().setBackgroundMessageHandler(async () => {});

  return (
    <socketContext.Provider value={{OnlineUsers,netConnection,checkMessages,setcheckMessages,reciveMessagesfun}}>
      {children}
    </socketContext.Provider>
  );
};
export {socketIo, serverPeer};
export default Socket_context;

export const useSocket = () => useContext(socketContext);

const styles = StyleSheet.create({});
