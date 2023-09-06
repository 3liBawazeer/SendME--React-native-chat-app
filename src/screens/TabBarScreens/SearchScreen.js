// import {Pressable, StyleSheet, View,Platform,PermissionsAndroid,TouchableOpacity,FlatList,Button} from 'react-native';
// import React, {useEffect,useState} from 'react';
// import Header from '../../components/Header';
// import {useAuth} from '../../Contexts/Auth_Context';
// import Contacts from 'react-native-contacts';
// import { getAllUsers } from '../../Requists';
// import { socketIo } from '../../Contexts/Socket_context';
// const SearchScreen = ({navigation}) => {

//   const {Token} = useAuth()

//   // useEffect(() => {
//   //   getContact()
    
//   // }, [])
  
//   const [contacts, setcontacts] = useState([])
//   const [myFriends, setmyFriends] = useState([])
//   const getContact = () => { 

//     socketIo.emit("CheckAndCreateChats","ddddddddddddddddddddddd")

    
//     if (Platform.OS === "ios") {
//       Contacts.getAll().then(contacts => {
//         // contacts returned
//       })
//     } else if (Platform.OS === "android") {

//       PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
//         {
//           'title': 'Contacts',
//           'message': 'This app would like to view your contacts.',
//           'buttonPositive': 'Please accept bare mortal'
//         }
//       ).then(()=>{
          
//           Contacts.getAll().then((contacts) => 
//               {
//                setcontacts(contacts);
//                if (Token) {
//                           getAllUsers(Token).then((data)=>
//                           {
//                                 const users = data.data.res.users;
//                                 const all =  contacts.map((item,index)=>{
//                                   const findFrined = users.find((im,ix)=> item.phoneNumbers[0].number  == im.phoneNumber ) 
//                                   // console.log(findFrined);
//                                   if (findFrined) {
//                                     findFrined.username = item.displayName
//                                   }
//                                   return  findFrined
//                                 });
//                                 const frindes = all.filter((item)=> {
//                                   if (item) {
//                                     return item
//                                   }
//                                 }); // all friends from جهات الاتصال
//                                 setmyFriends(frindes)

//                           }).catch((err)=>{
//                             console.log(err);
//                           })
//                          }
//                 }).catch((e) => {
//                     console.log(e)
//                 })
//         })
      
//     }

//    }

//   return (
//     <View style={{flex:1}}>
//       <Header
//         onPress={() => {logout();}}
//       />

//        <View style={{flex:1}} >

//         <FlatList 
//          data={myFriends}
//          keyExtractor={(_,x)=>x.toString()}
//          renderItem={({item})=>(
//           <TouchableOpacity style={{padding:10,margin:10,elevation:0,borderRadius:10,borderBottomWidth:0.8,borderBottomColor:"#ddd",marginVertical:0}} onPress={()=>{
//             navigation.navigate("profile",item)
//             }} >
//             <Text style={{fontWeight:"700",fontSize:16,color:"#08d"}}>
//               {item.username}
//             </Text>
//             <Text>
//               {item.phoneNumber}
//             </Text>
//           </TouchableOpacity>
//          )}
//         />

//         <Button  onPress={()=>getContact()} />

//        </View>

//     </View>
//   )
// }

// export default SearchScreen

// const styles = StyleSheet.create({})