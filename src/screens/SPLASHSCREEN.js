import React, {useState, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {Icon, Button, Header} from '@rneui/themed';
import LinearGradient from 'react-native-linear-gradient';
import {useAuth} from '../Contexts/Auth_Context';
import {socketIo, useSocket} from '../Contexts/Socket_context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useLocalDataBase} from '../Contexts/LocalDataBase';

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
    console.log(checkChatsAndMessages);
    if (checkChatsAndMessages >= 3 && !CheckLoggedIn) {
      setCheckLoggedIn(true);
      checkUser();
    }
  }, [checkChatsAndMessages]);

  return (
    <View style={styles.body}>
      <LinearGradient
        colors={['#E6F4FE', '#E6F4FE', '#D4EEFF']}
        style={styles.linearGradient}>
        <Icon name="message1" type="ant-design" size={50} color={'#3383BB'} />
      </LinearGradient>
    </View>
  );
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
