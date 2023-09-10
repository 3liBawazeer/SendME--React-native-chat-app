import React , {useEffect,useState,useContext,createContext } from 'react'
import { StyleSheet,AppState } from 'react-native';
import socket from 'socket.io-client';
import { BACK_END_URL } from '../Requists';
import {useAuth} from './Auth_Context';
import { useLocalDataBase } from './LocalDataBase';
import messaging from "@react-native-firebase/messaging"
import { displayNotfee } from './notificationHandler';
let socketIo;
let serverPeer;
import uuid from 'react-native-uuid';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const socketContext = createContext();

const Socket_context = ({children}) => {

  
  const {userData} = useAuth()
  const {saveMessage,getLastChats,saveLastChat,getMessagesNotRead} = useLocalDataBase()
  const [OnlineUsers, setOnlineUsers] = useState([])

  useEffect(()=>{
      if (userData != null) {
          socketIo = socket(BACK_END_URL,{query:{userId:userData._id}});
          socketIo.on("connect",()=>{
          console.log("user connected in client ... !")
         });
      }
      if(userData?._id){
        socketIo.emit("joinNotificationRoom",{userId:userData._id})
      }
      return () => {

      }
    },[userData])

    useEffect(() => {
      socketIo?.on("reciveNotifyNewMessage",reciveMessagesfun )
   
      socketIo?.on("onlineUsers",(data)=>{
        setOnlineUsers(data)
      })

      return ()=>{
        // socketIo.off("reciveNotifyNewMessage",reciveMessagesfun )
      }
    }, [socketIo])


    const sendMessage = async (input,ids) => {

      let user = await AsyncStorage.getItem("user");
      user = JSON.parse(user)

      const chatId = ids.chatId
      const friendId = ids.friendId
      const friendData = ids.friendData
      const messageId = uuid.v4();
      let SENDER = {
        username: user?.username,
        image: user?.image || "",
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
            senderToken:user?.FCMtoken,
            reciverToken:friendData?.FCMtoken,
          }
        ];
        socketIo.emit('sendNotifyNewMessage', sendData);
        socketIo.emit('sendNewMessage', sendData);
        saveMessage({
          id: messageId,
          content: input,
          sender: JSON.stringify(SENDER),
          chat: chatId,
          timestamp: Date.now(),
          isRead: '0',
        }).then(suc => {
              getLastChats()
                .then(last => {
                  const findOne = last.find(item => item.chat == chatId);
                  if (findOne) {
                    console.log('LAST CHAT FOUND :)');
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


    useEffect(() => {
       notifee.onForegroundEvent(({ type, detail }) => {
        const { notification, pressAction,input } = detail;
   
        if (type === EventType.ACTION_PRESS && pressAction.id == "reply" ) {
            if (detail?.notification?.data) {
              sendMessage(input,detail?.notification?.data)
            }
          }
    
        });
    }, [])
 

   const reciveMessagesfun =  (data) => {
        // displayNotfee(data)
        saveMessage({
          id:data.id,
          content:data.content,
          sender:data.sender,
          chat:data.chat,
          timestamp:data.timestamp,
          isRead:data.isRead
      }).then((suc)=>{

        

        getLastChats().then((last)=>{
          const findOne = last.find((item)=>item.chat == data.chat);
          if (findOne) {
            console.log("LAST CHAT FOUND :)");
          }else{
            saveLastChat({
              friendData:JSON.parse(data.sender),
              chat:data.chat,
             })
            .then((o)=>{
              
            }).cach((err)=>console.log(err))
          }
         }).catch((err)=>console.log(err.message))

      }).catch((err)=>{console.log(err);})

      getMessagesNotRead()

   };






   

  
  

   notifee.onBackgroundEvent(async ({ type, detail }) => {
    const { notification, pressAction,input } = detail;

    if (type === EventType.ACTION_PRESS && pressAction.id !="" ) {
       switch (pressAction.id) {
        case "reply":
          sendMessage(input,detail?.notification?.data)
          break;
       
        default:
          break;
       }
      await notifee.cancelNotification(notification.id);
    }


    });
  messaging().setBackgroundMessageHandler(()=>{});
   
      

  return (
    <socketContext.Provider value={{OnlineUsers}}>
       {children}
    </socketContext.Provider>
  )
}
export {socketIo,serverPeer} ;
export default Socket_context

export const useSocket = () => useContext(socketContext);

const styles = StyleSheet.create({})