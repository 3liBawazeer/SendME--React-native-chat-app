import { StyleSheet, Text, View,Modal, TouchableOpacity } from 'react-native'
import React , { useEffect,useRef }from 'react'
import { colors } from '../assets/colors'
import { Icon } from '@rneui/base'
import Lottie from 'lottie-react-native';

// shape of data
// show => {
//   visible:false,
//   title:"",
//   body:"",
//   
// }

const AlertLoading = ({
loading,
title
}) => {
    
    let animationRef = useRef(null)

    useEffect(() => {
      // animationRef.current?.play()
  
      // Or set a specific startFrame and endFrame with:
      animationRef.current?.play(0, 240,);
      return ()=>{}
    }, [])

  return (
    <Modal
     transparent
     animationType='fade'
     visible={loading}
    >
        <View style={styles.alertContainer} >
            <View style={styles.alertBody} >
                <View style={{padding:0,alignItems:"center",}} >
                <Lottie
                ref={animationRef}
                source={require("../assets/lottie/loading.json")}
                autoPlay
                style={{height:70,}}
              />
                </View>
                <View style={{backgroundColor:colors.primary,padding:10,alignItems:"center",justifyContent:"center",flex:1}} >
                     <Text style={{color:colors.light,fontWeight:"700",marginHorizontal:10}} > {title}... </Text>
                </View>
            </View>
        </View>
    </Modal>
  )
}

export default AlertLoading

const styles = StyleSheet.create({
    alertContainer:{flex:1,backgroundColor:"#0004",alignItems:"center",justifyContent:"center",},
    alertBody:{
        flexDirection:"row-reverse",
        backgroundColor:colors.light,
        borderRadius:8,
        overflow:"hidden",
        elevation:5,
        shadowColor:colors.primary,
        width:"70%"
    }
})