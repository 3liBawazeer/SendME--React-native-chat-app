import {Alert, FlatList, Image, TouchableOpacity, Pressable,StyleSheet, View ,Dimensions,Animated} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import Header from '../../components/Header';
import {Tab, Text, Icon, Button} from '@rneui/themed';
import {useAuth} from '../../Contexts/Auth_Context';
import HomeView from './HomeView';
// import BottomSheet from 'react-native-gesture-bottom-sheet';
import {socketIo, useSocket} from '../../Contexts/Socket_context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {db, useLocalDataBase} from '../../Contexts/LocalDataBase';
import {useFocusEffect} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {Avatar} from '@rneui/base';
import RBSheet from "react-native-raw-bottom-sheet";
import {StatusBar} from 'react-native';
import { colors } from '../../assets/colors';

const {height, width} = Dimensions.get('window');

const Home = ({navigation}) => {
  const {
    LastChats,
    setAllMessages,
    AllMessages,
    MessagesNotRead,
    getMessagesNotRead,
    contactsLive
  } = useLocalDataBase();
  const {OnlineUsers} = useSocket();

  const {userData, logout} = useAuth();
  const refRBSheet = useRef();

  useFocusEffect(
    useCallback(() => {
      console.log(MessagesNotRead);
    }, []),
  );
  const STATUSBAR_HEIGHT = StatusBar.currentHeight;

  const [shadowBackGround, setshadowBackGround] = useState(new Animated.Value(0))

  const [backBlack, setbackBlack] = useState(false)
  const bottomSheetData = [
    {name: 'settings', type: 'feather', title: 'الإعدادات',onPress:()=>{
      refRBSheet.current.close()
      setbackBlack(false);navigation.navigate("SettingHome")
    }},
    // {name:'person',type:'fontisto',title:"الملف الشخصي"},
    // {name:'person',type:'fontisto',title:"الملف الشخصي"},
  ];



  return (
    <>

      <View style={styles.body}>
        <View style={{flex: 1}}>
          <LinearGradient
            colors={[colors.primary, colors.primary]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={{flex: 1, paddingTop: STATUSBAR_HEIGHT}}>
            <StatusBar translucent={true} backgroundColor={'transparent'} />

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginHorizontal: 5,
              }}>
              <Icon
                onPress={() => {
                  navigation.navigate('friendsList');
                }}
                name="adduser"
                type="ant-design"
                containerStyle={{
                  borderRadius: 15,
                  marginTop: 10,
                  marginHorizontal: 5,
                }}
                color="#fff"
                style={{backgroundColor: '#fff2', padding: 7}}
              />

              <View
                style={{
                  marginTop: 10,
                  marginHorizontal: 10,
                  flexDirection: 'row-reverse',
                  alignItems: 'center',
                }}>
                <Image
                  source={require('../../assets/images/sendMe_fff.png')}
                  style={{width: 30, height: 45}}
                />
                <Text style={{fontSize: 25, fontWeight: '700', color: colors.light }}>
                  END
                  <Text
                    style={{fontSize: 25, fontWeight: '900', color: colors.secondry}}>
                    ME
                  </Text>
                </Text>
              </View>

              <View style={{flexDirection: 'row'}}>
                {/* <Icon onPress={()=>{navigation.navigate('friendsList')}} name='search' type="feather" containerStyle={{borderRadius:15,marginTop:10,marginHorizontal:5}} color="#fff" style={{backgroundColor:"#fff2",padding:7,}} /> */}
                <Icon
                  onPress={() => {
                    refRBSheet.current.open();
                  }}
                  name="menu"
                  type="feather"
                  containerStyle={{
                    borderRadius: 15,
                    marginTop: 10,
                    marginHorizontal: 5,
                  }}
                  color="#fff"
                  style={{backgroundColor: '#fff2', padding: 7}}
                />
              </View>
            </View>

            {/* <View style={{height:1,backgroundColor:"#fff5",margin:10,borderRadius:50,elevation:1,shadowColor:"#fff"}} ></View> */}

            {/* <View style={{marginBottom:10,marginHorizontal:5,flexDirection:"row"}}>
              <Avatar
                      size={55}
                      rounded
                      icon={{ name: 'plus', type: 'ant-design' }}
                      containerStyle={{ borderStyle:"dashed",borderWidth:2,borderColor:"#fff",backgroundColor:"#974ECF" ,margin:5}}
                      // source={require("../../assets/images/defult.png")}
                    />
                <FlatList
                 data={[]}
                 horizontal
                 showsHorizontalScrollIndicator={false}
                 renderItem={({item,index})=>(
                  <>
                   <View>
                   <Avatar
                   key={index}
                    size={55}
                    rounded
                    // icon={{ name: 'plus', type: 'ant-design' }}
                    // overlayContainerStyle={{backgroundColor:"#fff",margin:0,}}
                    containerStyle={{ borderStyle:"solid",borderWidth:2,borderColor:"#fff0",backgroundColor:"#fff" ,margin:5,padding:4,elevation:5,shadowColor:"#fff"}}
                    source={require("../../assets/images/defult.png")}
                  />
                   </View>
                  </>
                 )}
                 keyExtractor={(_,x)=>x.toString()}
                />
             </View> */}

            <View
              style={{
                flex: 1,
                backgroundColor: '#fff',
                borderTopRightRadius: 20,
                borderTopLeftRadius: 20,
                marginTop: 10,
              }}>
              <HomeView
                OnlineUsers={OnlineUsers}
                getMessagesNotRead={getMessagesNotRead}
                MessagesNotRead={MessagesNotRead}
                navigation={navigation}
                userData={userData}
                LastChats={LastChats}
                setAllMessages={setAllMessages}
                AllMessages={AllMessages}
              />
            </View>
          </LinearGradient>
        </View>
      </View>

    {backBlack && <Animated.View style={{backgroundColor:`#000`,position:"absolute",height,width,zIndex:10,opacity:shadowBackGround}} ></Animated.View> }


       <RBSheet
        ref={refRBSheet}
        height={100}
        onOpen={()=>{
          setbackBlack(true)
          Animated.timing(shadowBackGround,{
            toValue:0.4,
            duration:300,
            useNativeDriver:true,
          }).start()
        }}
        onClose={()=>{
          Animated.timing(shadowBackGround,{
            toValue:0,
            duration:300,
            useNativeDriver:true,
          }).start()
          setTimeout(() => {
            setbackBlack(false)
          }, 400);
        }}
        closeOnDragDown={true}
        closeOnPressMask={false}
        animationType="slide"
        customStyles={{
          wrapper: {
            backgroundColor: "#0000",
          },
          draggableIcon: {
            backgroundColor: "#aaa",
          },
          container:{
            elevation:15,
            shadowColor:"#000",
            borderTopRightRadius:20,
            borderTopLeftRadius:20,
          }
        }}
        
      >
        <FlatList
          data={bottomSheetData}
          renderItem={({item, index}) => (
            <>
              
                <TouchableOpacity
                onPress={item.onPress}
                  style={{
                    borderBottomColor: '#ddd',
                    borderBottomWidth:bottomSheetData.length - 1 == index ?1:1,
                    marginHorizontal: 0,
                    flex: 1,
                    justifyContent:'center'
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      padding: 12,
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                    }}>
                    <Icon
                      name={item.name}
                      size={25}
                      type={item.type}
                      color={'#80d5'}
                      style={{paddingHorizontal: 10}}
                    />
                    <Text
                      style={{
                        paddingHorizontal: 10,
                        color: '#333',
                        fontSize: 18,
                      }}>
                      {item.title}
                    </Text>
                  </View>
                </TouchableOpacity>

            
            </>
          )}
        />
        
      </RBSheet>
    </>
  );
};

export default Home;

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
});
