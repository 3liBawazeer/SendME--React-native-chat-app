import {Text, StyleSheet, View,Platform,PermissionsAndroid,TouchableOpacity,FlatList,Button,Image} from 'react-native';
import React, {useEffect,useState} from 'react';
import Header from '../../components/Header';
import {useAuth} from '../../Contexts/Auth_Context';
import Contacts from 'react-native-contacts';
import { getAllUsers, sendFriendReq } from '../../Requists';
import { socketIo } from '../../Contexts/Socket_context';
import { Modal } from 'react-native';
import { Icon } from '@rneui/themed/dist/Icon';


const FriendsList = ({navigation}) => {


    const { Token } = useAuth()
    const [contacts, setcontacts] = useState([])
    const [myFriends, setmyFriends] = useState([])
    const [showMDLProfile, setshowMDLProfile] = useState(false)


    const getContact = () => { 
  
      
      if (Platform.OS === "ios") {
        Contacts.getAll().then(contacts => {
          // contacts returned
        })
      } else if (Platform.OS === "android") {
  
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          {
            'title': 'Contacts',
            'message': 'This app would like to view your contacts.',
            'buttonPositive': 'Please accept bare mortal'
          }
        ).then(()=>{
            
            Contacts.getAll().then((contacts) => 
                {
                 setcontacts(contacts);
                 if (Token) {
                            getAllUsers(Token).then((data)=>
                            {
                                  const users = data.data.res.users;
                                  const all =  contacts.map((item,index)=>{
                                    const findFrined = users.find((im,ix)=> item.phoneNumbers[0].number  == im.phoneNumber ) 
                                    console.log(findFrined);
                                    if (findFrined) {
                                      findFrined.username = item.displayName
                                    }
                                    return  findFrined
                                  });
                                  const frindes = all.filter((item)=> {
                                    if (item) {
                                      return item
                                    }
                                  }); // all friends from جهات الاتصال
                                  setmyFriends(frindes)
  
                            }).catch((err)=>{
                              console.log(err);
                            })
                           }
                  }).catch((e) => {
                      console.log(e)
                  })
          })
        
      }
  
     }
  

  return (
    <View style={{flex:1,}}>
      
      <FlatList 
         data={myFriends}
         keyExtractor={(_,x)=>x.toString()}
         renderItem={({item})=>(
          <TouchableOpacity style={{padding:10,margin:10,elevation:0,borderRadius:10,borderBottomWidth:0.8,borderBottomColor:"#ddd",marginVertical:0}} onPress={()=>{
            setshowMDLProfile(item)
            }} >
            <Text style={{fontWeight:"700",fontSize:16,color:"#08d"}}>
              {item.username}
            </Text>
            <Text>
              {item.phoneNumber}
            </Text>
          </TouchableOpacity>
         )}
        />

         <Button title='get' onPress={()=>getContact()} />

         <ShowProfileMDl show={showMDLProfile} setshow={setshowMDLProfile}  navigation={navigation} />

    </View>
  )
}

export default FriendsList

const styles = StyleSheet.create({})


const ShowProfileMDl = ({show,setshow,navigation}) => { 
    

    const nav = show ;
    const {userData,Token} = useAuth();
    const [loadingSent, setloadingSent] = useState(false)

    const sendRequistFreind = () => { 

        setloadingSent(true)
        
        if (nav.username && nav._id && userData.username && userData._id ) {
            const data = {
                myId:userData._id,
                myName:userData.username,
                friendId:nav._id,
                friendName:nav.username,
            };
            sendFriendReq(data,Token)
            .then(()=>{
             navigation.goBack();
            }).catch((err)=>console.log(err.response))
            .then(()=>setloadingSent(false))
        }
     }


  return (<Modal visible={show?true:false} animationType="slide"  transparent>
    <View style={{flex:1,justifyContent:"flex-end"}}>

        <View style={{backgroundColor:"#fff",elevation:50,shadowColor:"#000", margin:20,borderRadius:20}}>
              <View style={{position:"absolute",margin:5}}>
              <Icon name='close' type='material' style={{padding:5}} onPress={()=>{setshow(false)}} />
              </View>
                <View style={{alignItems:"center"}} >

                    <View style={{marginVertical:20}}>
                        <Image source={require("../../assets/images/user-image.png")} style={{width:150,height:150}} />
                    </View>

                    <View>
                        <Text style={{color:"#333",fontSize:25,fontWeight:'500'}} >
                            {nav.username}
                        </Text>
                    </View>

                </View>

                <View style={{margin:20}} >
                    <Button title='مراسله' onPress={()=>{setshow(false);navigation.navigate("chat",{checkChat:true,friendData:show})}} />
                </View>
            
            </View>
    </View>

  </Modal>)
 }