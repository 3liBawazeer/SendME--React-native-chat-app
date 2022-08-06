import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import SignUp from '../screens/auth/SignUp'
import SignIn from '../screens/auth/SignIn'
import Home from '../screens/Home/Home'
import ChatScreen from '../screens/chat/ChatScreen'
import SearchScreen from '../screens/TabBarScreens/SearchScreen'

const StackRoot = () => {

    const stack = createStackNavigator()

  return (
        <stack.Navigator screenOptions={{
            headerShown:false,
        }}>
            <stack.Screen name='signIn' component={SignIn} />
            <stack.Screen name='signUp' component={SignUp} />
            <stack.Screen name='home' component={Home} />
            <stack.Screen name='search' component={SearchScreen} />
            <stack.Screen name='chat' component={ChatScreen} />
        </stack.Navigator>
  )
}

export default StackRoot

const styles = StyleSheet.create({})