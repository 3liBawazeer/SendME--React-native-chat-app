import { StyleSheet, Text, View } from 'react-native'
import React ,{useEffect,useState} from 'react'
// import { socketIo } from '../../Contexts/Socket_context'
import {ListItem} from "@rneui/themed"
import { Image } from 'react-native'
import { TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler'
import { FlatList } from 'react-native'

const HomeView = ({navigation,userData,LastChats = [],setAllMessages,AllMessages}) => {

  
    console.log(LastChats.length,"fffffffff545s4d5f45d4f54d");

    const getLastMessage = (chatId) => { 
        const filterMesg = AllMessages.filter((it)=>chatId == it.chat )
        const index = filterMesg.length - 1 
        const lastMesg = filterMesg[index]?.content;
        return lastMesg
     }
  return (
    <View style={{flex:1}}>
        <FlatList
        //  data={["1","2","3"]}
        data={LastChats}
         renderItem={({item})=>(
            <TouchableOpacity style={styles.listbody} onPress={()=>{console.log(item);;navigation.navigate("chat",item)}}>
            <View>
                <Image source={require("../../assets/images/user-image.png")} style={{width:45,height:45}} />
            </View>
            <View style={{marginHorizontal:5}}>
                <Text style={styles.name}>{item?.friendData?.username}</Text>
                <Text style={styles.last} numberOfLines={1}> {getLastMessage(item?.chat)} </Text>
            </View>
        </TouchableOpacity>
         )}
        />

    </View>
  )
}

export default HomeView

const styles = StyleSheet.create({
    name:{
        color:"#1c1c1c",
        fontSize:16,
        fontWeight:"600",
    },
    last:{
        color:"#aaa",
        fontSize:14,
        marginHorizontal:5,
        width:277
    },
    listbody:{
     flexDirection:"row",
     margin:5,
     borderBottomColor:"#ddd",
     borderBottomWidth:1,
     padding:10,
     marginBottom:0
    }
})