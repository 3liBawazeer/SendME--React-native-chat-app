import React , {useEffect,useState,useContext,createContext,useRef} from 'react'
import { StyleSheet, Text, View } from 'react-native';
import socket from 'socket.io-client';
import { BACK_END_URL } from '../Requists';
import {useAuth} from './Auth_Context'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveMessage,getLastChats,saveLastChat } from './LocalDataBase';
let socketIo;

const socketContext = createContext();

const Socket_context = ({children}) => {
  
  const {userData} = useAuth()
  
  const [AllMessages, setAllMessages] = useState([]);
  const [lastChats, setlastChats] = useState([])
  // let getLastChats = useRef([]).current;
  let AllMessagesRef = useRef([]).current;

  const getMessagesAndChat = async () => {
  const chats =  await AsyncStorage.getItem("chats");
  const messages = await AsyncStorage.getItem("messages");
  
  console.log(JSON.parse(messages),"<=== this is all messages");

  if (chats && messages) {
    setAllMessages(JSON.parse(messages));
    AllMessagesRef = JSON.parse(messages);
    setlastChats(JSON.parse(chats));
    // getLastChats = JSON.parse(chats);
  }
  }

  useEffect(()=>{
    socketIo = socket(BACK_END_URL);
    socketIo.on("connect",()=>{
      console.log("user connected in client ... !")
    });

    getMessagesAndChat();

    return () => {
    }
  },[])

  useEffect(() => {
    socketIo.on("reciveNotifyNewMessage",reciveMessagesfun )
    return ()=>{
      socketIo.off("reciveNotifyNewMessage",reciveMessagesfun )
    }
  }, [socketIo])
  

  useEffect(() => {
    if(userData?._id){
      socketIo.emit("joinNotificationRoom",{userId:userData._id})
    }
  }, [userData])



  
   const reciveMessagesfun =  (data) => {

        saveMessage({
          content:data.content,
          sender:data.sender,
          chat:data.chat,
          timestamp:data.timestamp,
      }).then((suc)=>{
          console.log(suc,"save message recive ");
      }).catch((err)=>{console.log(err);})

     getLastChats().then((last)=>{
      const findOne = last.find((item)=>item.chat == data.chat) ;
      if (findOne) {
        console.log("LAST CHAT FOUND :)");
      }else{
        saveLastChat({
          friendData:data.sender,
          chat:data.chat,
         })
        .then((o)=>{
          console.log(o);
        }).cach((err)=>console.log(err))
      }
     }).catch((err)=>console.log(err.message))

   };

   const saveChats = async () => { 
  //  await AsyncStorage.setItem("chats",JSON.stringify(getLastChats))
  //     .then(()=>{

  //       console.log("New Chat Saved ...");
       

  //     }).catch((err)=>{console.log(err);})
    }

    const saveMessages = async () => { 
     await  AsyncStorage.setItem("messages",JSON.stringify(AllMessagesRef))
    .then(()=>{console.log("New Message Save ...")})
    .catch((err)=>{console.log(err,"on save New Message to async storage");}) }

  //  useEffect(() => {

  //   const reciveMessagesFromUser = (data) => { 
          
  //      console.log("::::::::: this is messages :::::::::");
  //      AllMessagesRef.push({
  //       content:data.content,
  //       sender:{username:data.sender.username,img:data.sender.image,id:data.sender._id},
  //       chat:data.chatId,
  //       timestamp:data.timestamp});
  //         setAllMessages((o)=>[...o,{
  //            content:data.content,
  //            sender:{username:data.sender.username,img:data.sender.image,id:data.sender._id},
  //            chat:data.chatId,
  //            timestamp:data.timestamp,
  //         }]);
      
  //  }

  //   socketIo.on("reciveNewMessage",reciveMessagesFromUser);
  //   return () => {
  //      socketIo.off("reciveNewMessage",reciveMessagesFromUser);
  //   }
  // }, [socketIo])
 
  


  return (
    <socketContext.Provider value={{socketIo,lastChats,setlastChats,AllMessages,setAllMessages,AllMessagesRef,saveChats,saveMessages}}>
       {children}
    </socketContext.Provider>
  )
}
export {socketIo} ;
export default Socket_context

export const useSocket = () => useContext(socketContext);

const styles = StyleSheet.create({})