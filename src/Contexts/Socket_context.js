import React , {useEffect,useState,useContext,createContext } from 'react'
import { StyleSheet, } from 'react-native';
import socket from 'socket.io-client';
import { BACK_END_URL } from '../Requists';
import {useAuth} from './Auth_Context';
import { useLocalDataBase } from './LocalDataBase';

let socketIo;
let serverPeer;

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
       return () => {

       }
      }
    },[userData])

    useEffect(() => {
      socketIo?.on("reciveNotifyNewMessage",reciveMessagesfun )

      socketIo?.on("onlineUsers",(data)=>{
        setOnlineUsers(data)
      })

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
          id:data.id,
          content:data.content,
          sender:data.sender,
          chat:data.chat,
          timestamp:data.timestamp,
          isRead:data.isRead
      }).then((suc)=>{
        
        getLastChats().then((last)=>{
          const findOne = last.find((item)=>item.chat == data.chat) ;
          if (findOne) {
            console.log("LAST CHAT FOUND :)");
          }else{
            saveLastChat({
              friendData:JSON.parse(data.sender),
              chat:data.chat,
             })
            .then((o)=>{
              console.log(o);
            }).cach((err)=>console.log(err))
          }
         }).catch((err)=>console.log(err.message))

      }).catch((err)=>{console.log(err);})

      getMessagesNotRead()

   };

   
      

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