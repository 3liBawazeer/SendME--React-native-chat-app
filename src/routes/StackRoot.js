import React from 'react'
import { Modal, StyleSheet, Text, View } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import SignUp from '../screens/auth/SignUp'
import SignIn from '../screens/auth/SignIn'
import Home from '../screens/Home/Home'
import ChatScreen from '../screens/chat/ChatScreen'
// import SearchScreen from '../screens/TabBarScreens/SearchScreen'
import VideoCall from '../screens/chat/VideoCall'
import TestCall from '../screens/chat/TestCall'
import SPLASHSCREEN from '../screens/SPLASHSCREEN'
import PhoneVerifcation from '../screens/auth/PhoneVerifcation'
import FriendsList from '../screens/Home/FriendsList'
import SettingHome from '../screens/Setting/SettingHome'
import EditProfile from '../screens/Setting/EditProfile'


const StackRoot = () => {
  const stack = createStackNavigator()

  return (<>
        <stack.Navigator screenOptions={{
            headerShown:false,
        }}>
            <stack.Screen name='Splash'      component={SPLASHSCREEN} />
            <stack.Screen name='phone'       component={PhoneVerifcation} />
            <stack.Screen name='signIn'      component={SignIn} />
            <stack.Screen name='signUp'      component={SignUp} />
            <stack.Screen name='home'        component={Home} />
            {/* <stack.Screen name='search'      component={SearchScreen} /> */}
            <stack.Screen name='chat'   options={{
                presentation:"card"
            }}  component={ChatScreen} />
            {/* <stack.Screen name='VideoCall'   component={VideoCall} /> */}
            <stack.Screen name='friendsList' component={FriendsList} />
            <stack.Screen name='SettingHome' component={SettingHome} />
            <stack.Screen name='EditProfile' component={EditProfile} />
        </stack.Navigator>
        {/* <View>
            <Modal visible transparent animationType='fade' >
                <View style={{flex:1,backgroundColor:"#3335",alignItems:"center",justifyContent:"center"}}>
                     
                </View>
            </Modal>
        </View> */}
  </>)
}

export default StackRoot

const styles = StyleSheet.create({})