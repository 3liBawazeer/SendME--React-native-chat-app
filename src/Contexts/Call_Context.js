import React , {useEffect,useState,useContext,createContext,useRef} from 'react'
import { Alert, StyleSheet, Text, View } from 'react-native';
import socket from 'socket.io-client';
import { BACK_END_URL } from '../Requists';
import {useAuth} from './Auth_Context'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalDataBase } from './LocalDataBase';
// import Peer from "react-native-peerjs"
import { useNavigation } from '@react-navigation/native';
// import {
//   mediaDevices,
//   RTCView
// } from 'react-native-webrtc';
import { socketIo } from './Socket_context';
import notifee, { AndroidImportance } from '@notifee/react-native';
const CallingContext = createContext({});
let serverPeer ;





const getMideaDiv = () => { 
    const pro = new Promise((resolve,reject)=>{
        let isFront = true;
        mediaDevices.enumerateDevices().then(sourceInfos => {
        console.log(sourceInfos);
        let videoSourceId;
        for (let i = 0; i < sourceInfos.length; i++) {
            const sourceInfo = sourceInfos[i];
            if(sourceInfo.kind == "videoinput" && sourceInfo.facing == (isFront ? "front" : "environment")) {
            videoSourceId = sourceInfo.deviceId;
            }
        }
        mediaDevices.getUserMedia({
            audio: true,
            video: {
            width: 700,
            height: 500,
            frameRate: 30,
            facingMode: (isFront ? "user" : "environment"),
            deviceId: videoSourceId
            },
            // quilty:0,
        })
        .then(stream => { 
              setTimeout(() => {
                  resolve(stream)
              }, 1);
        }).catch(error => {
          reject(error)
        });
        });
    })

    return pro
 }


 const fourground = async () => { 
    try {
      const channelId = await notifee.createChannel( {
        id: 'screen_capture',
        name: 'Screen Capture',
        lights: false,
        vibration: false,
        importance: AndroidImportance.DEFAULT
      } );
    
      await notifee.displayNotification( {
        // title: 'دردشه',
        // body: '',
        android: {
          channelId,
          asForegroundService: true,
        },
      } );
    } catch( err ) {
        throw new Error(err)
    };
   }






const Call_Context = ({children}) => {

    const {userData} = useAuth()
    const navigation = useNavigation()

    const [MyPeer, setMyPeer] = useState(null)
    const [userStream, setuserStream] = useState(null)
    const [MyStream, setMyStream] = useState(null)


    useEffect(() => {
        serverPeer = new Peer(undefined,{
        host:"192.168.43.240",
        port:5001,
        secure:false,
        path:"/myPeer",
      })
      // serverPeer.on('error',(err)=>console.log(err))
      serverPeer.on('open',(id)=>{
        setMyPeer(id)
        socketIo.on("recieveReqPeerId",(data)=>{
          Alert.alert("callinggg",`${data.username} calling for you now`,[
            {text:"accept",onPress:()=>{
                 fourground().then(()=>{
                  navigation.navigate("VideoCall",{})
                  socketIo.emit("acceptRequistPeerId",{peerId:id,myId:userData?._id,userId:data.id});
                 })
                 .catch((err)=>{
                  console.error(err);
                 })
            }},
            {text:"close"}
          ])
      })
      })
      // return ()=>{
      //   setmyPeerId("")
      // }
      }, [])


      const callToStream = (peerId) => { 
        
      }

      useEffect(() => {
         socketIo?.on("sendPeerId",(data) => {

                getMideaDiv()
                  .then((stream)=>{

                      setMyStream(stream)
                      const id = data.peerId
                      let call = serverPeer.call(id,stream);
                      call.on("stream",(stream)=>{
                      console.log("on call funcation :::::: ",stream?.toURL());
                      setuserStream(stream)
                      })

                      })
                      .catch((err)=>{
                        console.log(err);
                      })


        })

        return ()=>{
            console.log("clean sendPeerId /");
            socketIo?.off("sendPeerId")
            setMyStream(null)
            setuserStream(null)
        }
    
      }, [socketIo])

     

      useEffect(() => {
        serverPeer?.on("call",(call)=>{

            getMideaDiv().then((stream)=>{
              setMyStream(stream)
              call.answer(stream)
              call.on("stream",(stream)=>{
                     console.log("on answer funcation :::::: ",stream?.toURL());
                       setuserStream(stream)
                    });

            })
            .catch((err)=>{
            //   call.close()
              console.log(err);
            })

            call.on("close",()=>{
              console.log("peer js is closed now ...");
            })

        })
        return () =>{
            setMyStream(null)
            setuserStream(null)
        }
      }, [serverPeer])



  return (
    <CallingContext.Provider
     value={{MyStream,setMyStream,userStream,MyPeer,setuserStream}}
    >
           {children}
    </CallingContext.Provider>
  )
}

export default Call_Context
export {serverPeer}
export const useCalling = () => useContext(CallingContext);

const styles = StyleSheet.create({})