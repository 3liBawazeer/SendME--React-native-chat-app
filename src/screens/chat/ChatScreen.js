import {Pressable, StyleSheet, View,Platform,PermissionsAndroid,Text,FlatList} from 'react-native';
import React, {useEffect,useLayoutEffect,useState,useRef} from 'react';
import Header from '../../components/Header';
import {useAuth} from '../../Contexts/Auth_Context';
import Contacts from 'react-native-contacts';
import { getandCreateChat } from '../../Requists';
import { socketIo, useSocket } from '../../Contexts/Socket_context';
import { ActivityIndicator } from 'react-native';
import Input from '../../components/Input';
import { useLocalDataBase } from '../../Contexts/LocalDataBase';
import { saveMessage } from '../../Contexts/LocalDataBase';
const ChatScreen = ({route}) => {



   const routeData = route?.params;
   const flatlistRef = useRef(null)
   // const {AllMessages,setAllMessages,AllMessagesRef,saveMessagesAndChats} = useSocket()
   const {AllMessages,setAllMessages} = useLocalDataBase()
   const { userData , Token } = useAuth();
   const [ChatLoading, setChatLoading] = useState(false);
   const [chatId, setchatId] = useState(null)
   const [friendId, setfriendId] = useState(null)
   const [messages, setmessages] = useState([])
   const MessagesRef = useRef([]).current
   const [mesgContent, setmesgContent] = useState('')
   const [freindData, setfreindData] = useState(null)
   const [OnceSaveCHat, setOnceSaveCHat] = useState(0)

   const formatDate = (date) => {
      let d = date
      let ndate = new Date(d)
      let h = ndate.getHours();
      let m = ndate.getMinutes() ;
      let s = ndate.getSeconds();
      return `${h}:${m}`
    }


   const checkChatsAndAdd = () => { 
      // console.log(userData,":::::userDAta");
      // console.log(Token,":::::token");
      const data = {
         myId:userData._id,
         friendId:routeData.friendData?._id
      }
         getandCreateChat(data,Token).then((data)=>{
            setChatLoading(false);
            const chat = JSON.parse(data.data.res)
            // console.log(chat,"[ <==== chat  ] ");
            const friend = chat.users.find((ite)=>ite !== userData?._id)
            setfriendId(friend)
            // console.log(friend,"<===== this is friend id bddddddddddddddd ...");
            // console.log(chat._id,"<===== this is chat id between you and your freind ...");
            setchatId(chat._id)
         }).catch((err)=>console.log(err))
    }

    useEffect(() => {
     if(chatId){
      socketIo.emit("joinToChat",chatId._id)
      return () =>{
         console.log("clear join To Chat useEffect ");
         socketIo.off("joinToChat",chatId._id)
        }
     }
    }, [chatId])
    

   useEffect(() => {
     const clear = setTimeout(() => {
      if (routeData.checkChat) {
         setChatLoading(true)
         checkChatsAndAdd()
         setfreindData(routeData?.friendData)
     }else{
      // console.log(routeData);
        setchatId(routeData.chat)
        setfreindData(routeData.friendData)
        setfriendId(routeData.friendData.id)
     }
     } , 100 )
     return () => {
     console.log("clear on check chat id useEffect ");
     clearTimeout(clear)
     }
   }, [])
   



    const sendMessage = () => { 

      if (mesgContent !== "") {
         // console.log(routeData,"}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}thisi is schat id ");
         saveMessage({
            content:mesgContent,
            sender:{username:userData?.username,img:userData?.image,id:userData?._id},
            chat:chatId,
            timestamp:Date.now(),
         }).then((suc)=>{
            console.log(suc);
         }).catch((err)=>{console.log(err.message);})
         setmesgContent('');

       

        socketIo.emit("sendNotifyNewMessage",
        [
         friendId,
         {
            content:mesgContent,
            sender:{username:userData?.username,img:userData?.image,id:userData?._id,phoneNumber:userData?.phoneNumber},
            chat:chatId,
            timestamp:Date.now(),
            isRead:"false"
         }
        ]);
      //   socketIo.emit("sendNewMessage",[
      //    friendId,
      //    {
      //       content:mesgContent,
      //       sender:{username:userData?.username,img:userData?.image,id:userData?._id,phoneNumber:userData?.phoneNumber},
      //       chat:chatId,
      //       timestamp:Date.now(),
      //    }
      //   ])

        
        // send mesg to usre

      //   console.log(AllMessagesRef,"last mesg:::::::::::::::::::");

      //   saveMessAllMessagesRefagesAndChats()



      }
      
    }

   
    
    

    
  

  return (<>
    <View style={{backgroundColor:"#08d",flexDirection:"row",alignItems:"center",padding:10}}>
      
       <View style={{backgroundColor:"#fff",height:50,width:50,borderRadius:50}} >
         
       </View>
       <Text style={{color:"#fff",fontSize:17,paddingHorizontal:5,fontWeight:"bold"}} > {freindData?.username} </Text>
    </View>
    <View style={{flex:1}} >
       
       <FlatList
        data={AllMessages.filter((item)=>item.chat == chatId)}
        ref={flatlistRef} // assign the flatlist's ref to your component's FlatListRef...
        onContentSizeChange={() =>flatlistRef.current.scrollToEnd()} 
        keyExtractor={(_,x)=> x.toString()}
        renderItem={({item,index})=>(
         <View style={{backgroundColor:item.sender.id == userData?._id?"#08d":"#fff",alignSelf:item.sender.id==userData?._id?"flex-start":"flex-end",padding:20,paddingHorizontal:20,margin:5,elevation:10,borderRadius:10}}>
            <Text style={{color:item.sender.id == userData?._id? "#fff":"#08d",fontSize:17}} >{item.content}</Text>
            <Text  style={{color:item.sender.id == userData?._id? "#ddd":"#08d",fontSize:13,position:"absolute",bottom:3,right:5}}> {formatDate(item.timestamp)} </Text>
         </View>
        )}
       />

    </View>

    <View>
      <View style={{overflow:"hidden",margin:5,marginTop:0,borderRadius:50,elevation:5}}>
        <Input placeholder="رساله" bg="#eef" ic1 icn1="send" ict1="font-awesome" icc1="#08d" 
        onPressic1={()=>{
         if (routeData.checkChat && OnceSaveCHat == 0) {
            getLastChats().then((last)=>{
               const findOne = last.find((item)=>item.chat == chatId);
               if (findOne) {
                 console.log("LAST CHAT FOUND :)");
               }else{
                 saveLastChat({
                   friendData:freindData,
                   chat:chatId,
                  })
                 .then((o)=>{
                   console.log(o);
                   setOnceSaveCHat(1)
                 }).cach((err)=>console.log(err))
               }
              }).catch((err)=>console.log(err.message))
         }
         sendMessage();
         }} 
         value={mesgContent} onChangeText={(t)=>setmesgContent(t)}
        />
      </View>
    </View>


  {ChatLoading&&<View style={{backgroundColor:"#3335",alignItems:"center",justifyContent:"center",position:"absolute",width:"100%",height:"100%"}}>
     <View style={{backgroundColor:"#fff",padding:50,paddingHorizontal:20,borderRadius:20,flexDirection:"row",elevation:10,shadowColor:"#fff"}}>
      <Text > جاري التحقق من {"\n"} جهة الاتصال ...</Text>
      <ActivityIndicator size={40} color="#08d" />
     </View>
  </View>}

    </> )
}

export default ChatScreen

const styles = StyleSheet.create({})