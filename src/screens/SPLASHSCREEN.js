import React, {useState, useEffect} from 'react';
import {StyleSheet,Image, View,Text} from 'react-native';
import {Icon, Button, Header} from '@rneui/themed';
import LinearGradient from 'react-native-linear-gradient';
import {useAuth} from '../Contexts/Auth_Context';
import {socketIo, useSocket} from '../Contexts/Socket_context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useLocalDataBase} from '../Contexts/LocalDataBase';
import { colors } from '../assets/colors';

const SPLASHSCREEN = ({navigation}) => {
  
  const {isLoggedIn, userData, Token, setUserData, setToken} = useAuth();
  const {checkChatsAndMessages} = useLocalDataBase();
  const [CheckLoggedIn, setCheckLoggedIn] = useState(false);


  const checkUser = async () => {
    const user = await AsyncStorage.getItem('user');
    const token = await AsyncStorage.getItem('token');
    if (user && token) {
      setUserData(JSON.parse(user));
      setToken(token);
      navigation.replace('home');
    } else {
      navigation.replace('phone');
    }
  };

  useEffect(() => {
    if (checkChatsAndMessages >= 3 && !CheckLoggedIn  ) {
      setCheckLoggedIn(true);
      checkUser();
    }
    return ()=>{
      
    }
  }, [checkChatsAndMessages]);

  return (<>
    <View style={styles.body}>
      <LinearGradient
        colors={[colors.primary, colors.primary]}
        style={styles.linearGradient}>
        <View  style={styles.linearGradient} >
        <Image source={require("../assets/images/sendMe_fff.png")} style={{width:200,height:200,}} />
        </View>
        <View style={{marginBottom:15,padding:5,borderRadius:5}}>
           <Text style={{color:colors.light,fontSize:10}} > Development by 3li.a.a.B </Text>
       </View>
      </LinearGradient>
    </View>
    
    </>);
};

export default SPLASHSCREEN;

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    margin: 10,
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
  icons: {
    backgroundColor: 'red',
    borderRadius: 50,
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
