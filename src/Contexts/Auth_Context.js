import AsyncStorage from '@react-native-async-storage/async-storage';
import React , {useEffect,useState,useContext,createContext} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import {useNavigation} from "@react-navigation/native"


const authContext = createContext({})

const Auth_Context = ({children}) => {

      const [ChatsandMessagesData, setChatsandMessagesData] = useState([])
      
      const navigation = useNavigation()
      const [isLoggedIn, setisLoggedIn] = useState(false)
      const [userData, setUserData] = useState(null)
      const [Token, setToken] = useState(null)

    
  
    const checkUser = async () => { 
        const user = await AsyncStorage.getItem("user");
        const token = await AsyncStorage.getItem("token");
        if (user && token) {
         //   console.log("USER::::",user,"TOKEN::::",token);
            setisLoggedIn(true);
            setUserData(JSON.parse(user))
            setToken(token)
            navigation.navigate("home")
        }
        return false
     }

     const logout = async () => { 
         await AsyncStorage.removeItem("user");
         await AsyncStorage.removeItem("token");
      }

    const saveloggedIn = async (data) => { 
     if (data.res.user && data.res.token) {
        setUserData(data.res.user)
        await AsyncStorage.setItem("token",data.res.token).then(()=>{

             AsyncStorage.setItem("user",JSON.stringify(data.res.user)).then(()=>{

                setisLoggedIn(true)
                
            }).catch((err)=>console.log(err))

        }).catch((err)=>console.log(err))
     }else{
        console.log("خطاْ أثنا حفظ الداتا");
     }
    }

  return (
    <authContext.Provider value={{isLoggedIn,setisLoggedIn,saveloggedIn,userData,setUserData,checkUser,logout,Token,setToken,ChatsandMessagesData,setChatsandMessagesData}}>
       {children}
    </authContext.Provider>
  )
}

export const useAuth = () => useContext(authContext);

export default Auth_Context

const styles = StyleSheet.create({})