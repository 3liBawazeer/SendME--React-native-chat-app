import { StyleSheet, Text, View,Modal, TouchableOpacity } from 'react-native'
import React from 'react'
import { colors } from '../assets/colors'
import { Icon } from '@rneui/base'


// shape of data
// show => {
//   visible:false,
//   title:"",
//   body:"",
  
// }

const AlertDialog = ({
    data={
        visible:false,
        title:"",
        body:"",
        type:"danger"||"primary"
       },
    btns={
        acceptBtnTitle:"نعم",
        rejectBtnTitle:"نعم",
        acceptBtnPress:()=>{},
        rejectBtnPress:()=>{},
    },
    cancelBtn = false,
    showBtnAccept=true,
    showBtnReject=true,
    setState
}) => {
    


  return (
    <Modal
     transparent
     animationType='fade'
     visible={data.visible}
     onRequestClose={()=>{
        data.visible = false
        setState(false)
     }}
    >
        <View style={styles.alertContainer} >
            <View style={styles.alertBody} >
                <View style={{backgroundColor:data.type == "danger"?colors.secondry:colors.primary,padding:10,flexDirection:"row",alignItems:"center"}} >
                     <Icon name='warning' color="#fff" size={20} />
                     <Text style={{color:colors.light,fontWeight:"900",marginHorizontal:10,fontSize:15}} > {data.title}</Text>
                </View>
                <View style={{padding:20,flexDirection:"row",alignItems:"center",paddingBottom:5}} >
                    <Text style={{fontSize:15}} >
                      {data.body}
                    </Text>
                </View>
                <View style={{flexDirection:"row",padding:5,}} >
                    {showBtnAccept&&<TouchableOpacity style={{padding:10,marginHorizontal:10}} onPress={btns.acceptBtnPress}>
                        <Text style={{color:colors.secondry,fontSize:15,fontWeight:"bold"}} > {btns.acceptBtnTitle} </Text>
                    </TouchableOpacity>}
                   {showBtnReject&&<TouchableOpacity style={{padding:10,marginHorizontal:10}} onPress={btns.rejectBtnPress} >
                        <Text style={{color:colors.secondry,fontSize:15,fontWeight:"bold"}} > {btns.rejectBtnTitle} </Text>
                    </TouchableOpacity>}
                </View>
            </View>
        </View>
    </Modal>
  )
}

export default AlertDialog

const styles = StyleSheet.create({
    alertContainer:{flex:1,backgroundColor:"#0004",alignItems:"center",justifyContent:"center",},
    alertBody:{
        // height:200,
        width:"80%",
        backgroundColor:colors.light,
        borderRadius:8,
        overflow:"hidden"
    }
})