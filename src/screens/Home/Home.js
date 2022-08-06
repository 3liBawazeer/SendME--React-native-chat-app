import {Pressable, StyleSheet, View} from 'react-native';
import React, {useEffect,useRef,useState} from 'react';
import Header from '../../components/Header';
import { Tab, Text, TabView } from '@rneui/themed';
import {useAuth} from '../../Contexts/Auth_Context';
import { TouchableOpacity } from 'react-native-gesture-handler';
import  Icon  from 'react-native-vector-icons/FontAwesome';
import HomeView from './HomeView';
import FriendsRequists from './FriendsRequists';
import FriendsList from './FriendsList';
import { socketIo, useSocket } from '../../Contexts/Socket_context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db, useLocalDataBase } from '../../Contexts/LocalDataBase';


const Home = ({navigation}) => {

const {LastChats,setAllMessages,AllMessages} = useLocalDataBase()
const {userData, logout} = useAuth();
const [index, setIndex] = React.useState(0);
  




  return (
    <View style={styles.body}>
      <Header
      title='CHATY'
      icn1='more-vertical'
      ict1='feather'
      bg={"#08d"}
      fc={"#fff"}
      onPressIc1={()=>{  db.transaction((tx)=>{
        tx.executeSql(
            "DELETE FROM last_chats",
            [],
            (tx,res)=>{
              resolve("DELTET MESSAGE SUCCEFULY >>>")
             },
             (err)=> reject(err),
         )
        })
}}
      />

<>
    <Tab
      value={index}
      onChange={(e) => {setIndex(e);console.log(e);}}
      indicatorStyle={{
        backgroundColor: 'white',
        height: 2,
      }}
      variant="default"
      
    >
      <Tab.Item
        title="الصفحة الرئيسية"
        titleStyle={{ fontSize: 14 ,color:index == 0 ? "#fff":"#333"}}
      />
      <Tab.Item
        title="طلبات الصداقه"
        titleStyle={{ fontSize: 14 ,color:index == 1 ? "#fff":"#333"}}
      />
      <Tab.Item
        title="الأصدقاء"
        titleStyle={{ fontSize: 14 , color:index == 2 ? "#fff":"#333"}}
        // icon={{ name: 'cart', type: 'ionicon', color: 'white' }}
      />
    </Tab>

    <TabView value={index} onChange={setIndex} animationType="spring">

      <TabView.Item style={{ backgroundColor: '#fff', width: '100%' }}>

        <HomeView navigation={navigation} userData={userData} LastChats={LastChats} setAllMessages={setAllMessages} AllMessages={AllMessages}  />

      </TabView.Item>

      <TabView.Item style={{ backgroundColor: '#fff', width: '100%' }}>

        <FriendsRequists/>

      </TabView.Item>

      <TabView.Item style={{ backgroundColor: '#fff', width: '100%' }}>

        <FriendsList navigation={navigation} userData={userData} />

      </TabView.Item>

    </TabView>
  </>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
});
