import { StyleSheet, Text, View ,Dimensions} from 'react-native'
import React, { useEffect , useState } from 'react'
import { Icon ,Button } from '@rneui/themed'
import {
    mediaDevices,
    RTCView,
    MediaStreamTrack
  } from 'react-native-webrtc';
import { socketIo, useSocket } from '../../Contexts/Socket_context';
import { useCalling } from '../../Contexts/Call_Context';
const {height, width} = Dimensions.get('window');
import { useAuth } from '../../Contexts/Auth_Context';
import notifee, { AndroidImportance } from '@notifee/react-native';
const VideoCall = ({route,navigation}) => {

    const {friendId} = route.params
    const {MyStream,setMyStream,setuserStream,userStream,serverPeer} = useCalling()
    const {userData} = useAuth()

    const closeNotff  = async () => { await notifee.stopForegroundService(); }

    useEffect(() => {
        socketIo?.on("recieveClosecallVideo", (userId)=>{
                closeNotff()
                setMyStream(null)
                setuserStream(null)
                navigation.goBack()
        })
    }, [])
    
    
    
  return (<>
    <View style={{flex:1,backgroundColor:"#000",}}>
      
      <View style={{zIndex:10,justifyContent:"flex-start",marginTop:-10,flex:1}}>
      {userStream != null && <RTCView streamURL={userStream?.toURL()} style={{height:height,width:width,}} />}
      <Text> this is user Stream </Text>
      </View>

      <View style={{zIndex:50,borderRadius:0,position:"absolute",}}>
       {MyStream != null && <RTCView  streamURL={MyStream?.toURL()} style={{width:120,height:170,overflow:"hidden",}} />}
       {/* <Text> this is my stream </Text> */}
      </View>


    </View>
    <View style={{backgroundColor:"#000",flexDirection:"row",padding:20,justifyContent:"space-around"}}>
        <Icon name='call-end' type='material' style={styles.icons} color="#fff" onPress={ async ()=>{
                await notifee.stopForegroundService();
                socketIo.emit("sendClosecallVideo",{myId:userData._id,userId:friendId})
                setMyStream(null)
                setuserStream(null)
        }} />
        <Icon name='microphone-slash' type='font-awesome' style={[styles.icons,{backgroundColor:"#8055"}]} color="#fff" />
        <Icon name='call-end' type='material' style={styles.icons} color="#fff" />
    </View>
    </>)
}

export default VideoCall

const styles = StyleSheet.create({
    icons:{
        backgroundColor:"red",borderRadius:50,width:70,height:70,alignItems:"center",justifyContent:"center"
    }
})