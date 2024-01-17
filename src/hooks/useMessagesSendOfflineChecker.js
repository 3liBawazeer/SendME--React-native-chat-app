import { useCallback, useEffect } from "react"
import { getUnReadMessages } from "../Requists"
import { socketIo } from "../Contexts/Socket_context"
import { useLocalDataBase } from "../Contexts/LocalDataBase"
import { useAuth } from "../Contexts/Auth_Context";


// To used : 
// useMessagesSendOfflineChecker({netConnection,LastChats,MessagesNotRead});
export const useMessagesSendOfflineChecker = (props) => { 

    const {netConnection,LastChats} = props
    const { changeMessageStatus,getMessagesNotRead,MessagesNotRead } = useLocalDataBase();
    const {userData} = useAuth();
    
    // This is for Check Messages not send 🎈
    useEffect(()=>{
       if (userData) {
     
      //  getMessagesNotRead().then((data)=>{
      //   // console.log(data,"3333333333333333333333");
       
      //  })
      const messagesNotSend = MessagesNotRead.filter((msg)=>{
        return ((JSON.parse(msg?.sender)?.id == userData?._id) && (msg?.isRead == "0"))
    });


        if (messagesNotSend.length != 0) {
           messagesNotSend.map((ele)=>{

            const message = {
                id: ele.id,
                content: ele.content,
                sender: ele.sender,
                chat: ele.chat,
                timestamp: Date.now(),
                isRead: '0',
              };

            const friendId = (LastChats.find((im)=> im.chat == ele.chat))?.friendData?.id;

            socketIo?.emit('sendNotifyNewMessage', [
                friendId,
                message,
              ],()=>{
                changeMessageStatus([ele.id],"1")
                // console.log("Message offline Sended ");
              });

              socketIo?.emit('sendNewMessage', [
                friendId,
                message,
              ]);
           })
        }
       }
    },[netConnection,userData])



 };