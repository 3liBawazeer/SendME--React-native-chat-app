import React , {useState,useEffect,useContext} from 'react'
import { Alert, StyleSheet, Text, View ,TextInput,Button,ScrollView} from 'react-native'
import { signUp } from '../../Requists'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useAuth } from '../../Contexts/Auth_Context'
import Input from '../../components/Input'
const SignUp = ({navigation}) => {

    const {isLoggedIn,saveloggedIn} = useAuth()

    const [signData, setsignData] = useState({
        username:"",
        phoneNumber:"",
        password:"",
        confirmPassword:""
    });
    const [loading, setloading] = useState(false)

    const sign_up = () => { 
        if (signData.username == "") {Alert.alert("!","اسم المستخدم مطلوب")}
        else if (signData.phoneNumber == "") {Alert.alert("!"," رقم الهاتف مطلوب")}
        else if (signData.password == "") {Alert.alert("!"," كلمة الرور مطلوبه")}
        else if (signData.confirmPassword  !== signData.password ) {Alert.alert("!","  كلمة الرور غير متطابقه")}
        else{
            setloading(true)
            const data = {
                username:signData.username,
                phoneNumber:signData.phoneNumber,
                password:signData.password,
            };

            signUp(data).then((data)=>{
               console.log(data.data);
               saveloggedIn(data.data)
               navigation.navigate("home",{user:data.data.res.user})
               setsignData({
                username:"",
                phoneNumber:"",
                password:"",
                confirmPassword:""
            })
            }).catch((err)=>{
                console.log(err.response.data);
                if (err.response.data.errorCode == "PhoneNumberUsed") {
                    Alert.alert("عذرا","هذا الرقم مسجل مسبقا حاول تسجيل الدخول .")
                }else if(err.response.data.errorCode == "validationError"){
                    Alert.alert("!",err.response.data.mesg)
                }else{
                    console.log(err.response.data);
                }
            })
            .then(()=>setloading(false))

        }
     }

    return (
        
            <ScrollView showsVerticalScrollIndicator={false}>

                    <Input  textAlign="center" placeholder='اسم المستخدم '  value={signData.username} onChangeText={(t)=>setsignData((o)=>{return{...o,username:t}})} />
    
                    <Input textAlign="center" placeholder=' رقم الجوال '  value={signData.phoneNumber} onChangeText={(t)=>setsignData((o)=>{return{...o,phoneNumber:t}})} />
                  
                    <Input textAlign="center" placeholder='كلمة المرور'  value={signData.password} onChangeText={(t)=>setsignData((o)=>{return{...o,password:t}})} type="password" />

                    <Input textAlign="center" placeholder=' تأكيد كلمة الرور '  value={signData.confirmPassword} onChangeText={(t)=>setsignData((o)=>{return{...o,confirmPassword:t}})} type="password" />

                  <Button  title='تسجيل جديد'  onPress={sign_up}  />

                  <TouchableOpacity onPress={()=>{navigation.navigate("signIn")}}>
                    <Text  style={{fontWeight:"900",color:"blue",textDecorationLine:"underline"}}> تسجيل الدخول </Text>
                  </TouchableOpacity>

                  </ScrollView>
      )
}

export default SignUp

const styles = StyleSheet.create({})