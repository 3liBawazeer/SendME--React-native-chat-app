import React , {useState,useEffect,useContext} from 'react'
import { Alert, StyleSheet, Text, View,TextInput, Button,ScrollView } from 'react-native'
import { signIn, signUp } from '../../Requists'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useAuth } from '../../Contexts/Auth_Context'
import AsyncStorage from '@react-native-async-storage/async-storage'

const SignIn = ({navigation}) => {

    const {isLoggedIn,saveloggedIn,setUserData,userData,checkUser} = useAuth()

    useEffect(()=>{
        checkUser()
    },[isLoggedIn])

    // const logNav = () => navigation.navigate("home");
     

    // const checkUser = async () => { 
    //     const user = await AsyncStorage.getItem("user");
    //     const token = await AsyncStorage.getItem("token");
    //     if (isLoggedIn) {
    //         setUserData(user)
    //         navigation.navigate("home")
    //     }
    //     return false
    //  }

    const [signData, setsignData] = useState({
        phoneNumber:"",
        password:"",
    });
    const [loading, setloading] = useState(false)

    const sign_in = () => { 
         if (signData.phoneNumber == "") {Alert.alert("!"," رقم الهاتف مطلوب")}
        else if (signData.password == "") {Alert.alert("!"," كلمة الرور مطلوبه")}
        else{
            setloading(true)
            const data = {
                phoneNumber:signData.phoneNumber,
                password:signData.password,
            };

            signIn(data).then((data)=>{
              console.log(data.data.res.token);
                saveloggedIn(data.data)
                setsignData({
                    phoneNumber:"",
                    password:"",
                });
                navigation.navigate("home")
            }).catch((err)=>{
                if (err.response.data.errorCode == "InvalidLogin") {
                    Alert.alert("!","كلمة الرور او رقم الهاتف غير صحيح !")
                } else if (err.response.data.errorCode == "NotRegistered") {
                    Alert.alert("!","كلمة الرور او رقم الهاتف غير صحيح !")
                }
            })
            .then(()=>setloading(false))

        }
     }

    return (
            <ScrollView showsVerticalScrollIndicator={false}>

    
                  <TextInput placeholder=' رقم الجوال '  value={signData.phoneNumber} onChangeText={(t)=>setsignData((o)=>{return{...o,phoneNumber:t}})}   />
                  <TextInput  placeholder='كلمة المرور'  value={signData.password} onChangeText={(t)=>setsignData((o)=>{return{...o,password:t}})} type="password" />



                  <Button title='تسجيل'   onPress={sign_in} / >
                    
                 

                  <TouchableOpacity onPress={()=>{navigation.navigate("signUp")}}>
                    <Text  style={{fontWeight:"900",color:"blue",textDecorationLine:"underline"}}> تسجيل جديد </Text>
                  </TouchableOpacity>

                  </ScrollView>
      )
}

export default SignIn

const styles = StyleSheet.create({})