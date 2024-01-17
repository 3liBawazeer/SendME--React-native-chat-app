import React, {useState, useEffect} from 'react';
import {StyleSheet,Image, View,Text, PermissionsAndroid, Platform} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useAuth} from '../Contexts/Auth_Context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useLocalDataBase} from '../Contexts/LocalDataBase';
import { colors } from '../assets/colors';
import { getMyContactsInSendMe } from '../Requists';
import Contacts from 'react-native-contacts';
const SPLASHSCREEN = ({navigation}) => {
  
  const {Token, setUserData, setToken} = useAuth();
  const {checkChatsAndMessages,contactsLive,saveContactsLive} = useLocalDataBase();
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
    console.log(checkChatsAndMessages,"ddddddddddddd");
    if (checkChatsAndMessages >= 4 && !CheckLoggedIn  ) {
      setCheckLoggedIn(true);
      checkUser();
    }
    return ()=>{
      
    }
  }, [checkChatsAndMessages]);



  // permmison get contact
//   useEffect(() => {
//     const permid = async () => { 
//       await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
//         {
//           title: 'Contacts',
//           message: 'This app would like to view your contacts.',
//           buttonPositive: 'Please accept bare mortal',
//         },
//       ).catch((err)=>{
//          throw Error(err)
//       })
//      }

//   permid().then(()=>{
//     if (contactsLive.length <= 0) {
//       console.log("get Contact requist",contactsLive.length);
//       getContact()
//     }else{
//       console.log("get Contact setState");
//     }
//   })
  
//   return ()=>{

//   }
// }, []);


// const getContact = async () => {
//   if (Platform.OS === 'ios') {
   
//   } else if (Platform.OS === 'android') {

    
//       Contacts.getAll()
//         .then(contacts => {

//           // this is your contacts in your phone | {displayName: "name",phoneNumber:"11110000"}
//           const numbers = contacts.map((item)=>{
//             if (item && item.phoneNumbers.length > 0) {
//               const after = item?.phoneNumbers[0]?.number?.replace(/\-|\)|\(|\s/gi,'');
//               return {displayName:item.displayName, phoneNumber: after};
//             }
//           }).filter((i)=>i);
//           // here we check and get all contact that has a send me acount
//           if (Token) {

//             getMyContactsInSendMe(Token,numbers).then((data)=>{
//               const users = data.data.res.users;
              
//               saveContactsLive(users).then((res)=>{
//                 // console.log("save contacts succ");
//               }).catch((err)=>{
//                 console.log(err,"\n from saveContactsLive ");
//               })
//             })
//             .catch((err)=>{
//               console.log(err)
//             })

//           }

//         })
//         .catch(e => {
//           console.log(e);
//           // Alert.alert('خطأ', ' تأكد من إتصالك بالشبكة ');
//         });
    
//   }
// };


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
