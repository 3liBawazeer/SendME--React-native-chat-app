import React , { useEffect ,useRef} from 'react'
import { StyleSheet, Text, View , Image ,Dimensions} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import {
    mediaDevices,
    RTCView,
    MediaStreamTrack
  } from 'react-native-webrtc';
import { Icon ,Button } from '@rneui/themed'
import Peer from "react-native-peerjs"
import { socketIo } from '../../Contexts/Socket_context';

const {height, width} = Dimensions.get('window');


export default function TestCall() {

    let serverPeer ;
    let peerId = useRef(null).current;
    useEffect(() => {
        
        serverPeer = new Peer(undefined,{
          host:"192.168.43.240",
          port:5001,
          secure:false, 
          path:"/myPeer",
        });
         
      serverPeer.on('open',(id)=>{

        peerId = id ;

    //     socketIo.on("recieveReqPeerId",(data)=>{
    //       Alert.alert("callinggg",`${data.username} calling for you now`,[
    //         {text:"accept",
    //         onPress:()=>{
    //              fourground().then(()=>{
    //               navigation.navigate("VideoCall",{})
    //               socketIo.emit("acceptRequistPeerId",{peerId:id,myId:userData?._id,userId:data.id});
    //              })
    //              .catch((err)=>{
    //               console.error(err);
    //              })
    //         }},
    //         {text:"close"}
    //       ])
    //   })
        });
      }, [])


    
  return (
    <View style={styles.body}>
        <LinearGradient colors={['#4c6699', '#3b5998', '#192f9a']} style={styles.linearGradient}>
            <View style={{flex:1}}>

            

             


            {/* <View style={{alignItems:"center",justifyContent:"center"}}>
                <Image source={require('../../assets/images/user-image.png')} blurRadius={10} style={{width:height,height:width,position:"absolute"}} />
            </View> */}


            </View>

            <View style={{}}>
                    <View style={{flexDirection:"row",padding:20,justifyContent:"space-around"}}>
                        <Icon name='call-end' type='material' style={styles.icons} color="#fff" 
                        // onPress={ async ()=>{
                        //         await notifee.stopForegroundService();
                        //         socketIo.emit("sendClosecallVideo",{myId:userData._id,userId:friendId})
                        //         setMyStream(null)
                        //         setuserStream(null)
                        // }} 
                        />
                        {/* <Icon name='microphone-slash' type='font-awesome' style={[styles.icons,{backgroundColor:"#8055"}]} color="#fff" /> */}
                        <Icon name='call-end' type='material' style={styles.icons} color="#fff" />
                    </View>
            </View>

        </LinearGradient>
    </View>
  )
}

const styles = StyleSheet.create({
    body:{
        flex:1,
    },
    linearGradient: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
      },
      buttonText: {
        fontSize: 18,
        fontFamily: 'Gill Sans',
        textAlign: 'center',
        margin: 10,
        color: '#ffffff',
        backgroundColor: 'transparent',
      },
      icons:{
        backgroundColor:"red",borderRadius:50,width:70,height:70,alignItems:"center",justifyContent:"center"
    }
})