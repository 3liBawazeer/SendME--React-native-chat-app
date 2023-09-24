import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
// import { socketIo } from '../../Contexts/Socket_context'
import {ListItem} from '@rneui/themed';
import {Image} from 'react-native';
import {
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import {FlatList} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {formatDate} from "../../components/getTimeAr";
import { colors } from '../../assets/colors';


const HomeView = ({
  navigation,
  userData,
  LastChats = [],
  setAllMessages,
  AllMessages,
  MessagesNotRead,
  OnlineUsers,
}) => {
  const getLastMessage = chatId => {
    if (chatId) {
      const filterMesg = AllMessages?.filter(it => chatId == it.chat);
      const index = filterMesg?.length - 1;
      const lastMesg = filterMesg[index];
      return lastMesg || "8828";
    }else{
      return null
    }
  };
  // let noread;
  // const notRead = (item) => {
  //     const notRead = MessagesNotRead?.filter((ite)=>ite.chat == item?.chat)
  //     console.log(notRead.length,"|||||||||",item.chat);
  //     // noread = notRead.length
  //     return notRead.length
  //  }

  return (
    <View style={{flex: 1}}>
      <FlatList
        //  data={["1","2","3"]}
        data={LastChats}
        
        contentContainerStyle={{flex:LastChats.length == 0 ? 1 :0}}
        ListEmptyComponent={
           <View style={{flex:1,alignItems:"center",justifyContent:'center'}} >
             <Image source={require("../../assets/images/no-message.png")} style={{width:100,height:100,margin:10}} />
             <View style={{alignItems:"center",justifyContent:"center"}} >
               <Text style={{fontSize:18,color:"#007"}} > لا توجد رسائل حتى الآن. {"\n"} إبدا محادثة مع أصدقائك </Text>
             </View>
          </View>
        }
        
        renderItem={({item,index}) => {
          const senderlastMessage = getLastMessage(item?.chat) ? JSON.parse(getLastMessage(item?.chat)?.sender) : null
       return (<>
          
          <TouchableOpacity
            style={styles.listbody}
            onPress={() => {
              const chatMessages = AllMessages.filter(ite => ite.chat == item?.chat)
              navigation.navigate('chat', {item:item,chatMessages:chatMessages});
            }}>

            <View style={{flexDirection: 'row', flex: 1,overflow:"hidden"}}>
              
              <LinearGradient
                colors={OnlineUsers?.includes(item?.friendData?.id) ?[
                  colors.green,
                  colors.primary,
                  colors.secondry,
                ]:["#fff","#fff"]}
                start={{x: 0.0, y: 1.0}}
                end={{x: 1.0, y: 1.0}}
                style={{
                  borderRadius: 55,
                  padding:  3,
                  alignItems:"center",justifyContent:"center",
                }}>
                <View
                  style={{
                    backgroundColor: '#fff',
                    padding: 2,
                    borderRadius: 55,
                  }}>
                  <Image
                    // source={{uri:"https://firebasestorage.googleapis.com/v0/b/chatyphoneauth-ff1a8.appspot.com/o/usersImgaes%2F712345678-profile.png?alt=media&token=e990bc54-839d-4638-8b7f-c2d770688f88"}}
                    source={!item?.friendData?.image || item?.friendData?.image == "image-user.png" || item?.friendData?.image === "" ?require('../../assets/images/user-image.png'):{uri:item?.friendData?.image}}
                    style={{width: 45, height: 45, borderRadius: 55}}
                  />
                </View>
              </LinearGradient>

              <View style={{marginHorizontal: 7,alignItems:"flex-start",justifyContent:"center",}}>
                <Text style={styles.name}>{item?.friendData?.username}</Text>
                <Text style={styles.last} numberOfLines={1}>
                  { (senderlastMessage && !!(userData?._id) ) && ( (senderlastMessage?.id) == userData?._id) ? `انت : ${getLastMessage(item?.chat)?.content}` : getLastMessage(item?.chat)?.content}
                </Text>
              </View>

            </View>

            <View style={{alignItems: 'center', justifyContent: 'space-between',marginHorizontal:10}}>
            <Text style={{fontSize:10}}>
                {getLastMessage(item?.chat)?.timestamp && formatDate(+(JSON.parse(getLastMessage(item?.chat)?.timestamp)))}
                {/* 20 */}
            </Text>
              {MessagesNotRead?.filter(ite => (ite.chat == item?.chat) && (JSON.parse(ite.sender).id != userData?._id) ).length !==
                0 && (
                <Text
                  style={{
                    backgroundColor: colors.secondry,
                    fontSize:11,
                    color: '#FFF',
                    borderRadius: 50,
                    paddingHorizontal: 8,
                    paddingVertical: 5,
                    width:MessagesNotRead?.filter(ite => (ite.chat == item?.chat) && JSON.parse(ite.sender).id != userData?._id)
                    .length <= 9 ? 27 : "auto",
                    height:27,
                    textAlign:"center",
                    textAlignVertical:"center"
                  }}>
                  {
                    MessagesNotRead?.filter(ite => (ite.chat == item?.chat) && JSON.parse(ite.sender).id != userData?._id)
                      .length 
                  }
                </Text>
              )}
              <Text style={{fontSize:5,opacity:0}}>
                {/* {formatDate(JSON.parse(getLastMessage(item?.chat)?.timestamp))} */}
                20
            </Text>
            </View>
          </TouchableOpacity>
          <View style={{borderBottomColor: colors.light,borderBottomWidth: 1,width:"82%",alignItems:"center",alignSelf:"flex-end"}} />
        </>)}}
      />
    </View>
  );
};

export default HomeView;

const styles = StyleSheet.create({
  name: {
    color: '#1c1c1c',
    fontSize: 16,
    fontWeight: '600',
  },
  last: {
    color: '#aaa',
    fontSize: 14,
    marginHorizontal: 5,
    // backgroundColor:"#08d",
  },
  listbody: {
    flexDirection: 'row',
    margin: 5,
    padding: 5,
    marginBottom: 0,
    justifyContent:"space-between",
   paddingBottom:5
  },
  buttonText: {
    textAlign: 'center',
    color: '#4C64FF',
    padding: 15,
    marginLeft: 1,
    marginRight: 1,
    width: 198,
  },
});
