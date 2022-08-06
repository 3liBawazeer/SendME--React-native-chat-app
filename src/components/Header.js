import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {Icon} from '@rneui/themed'


const Header = ({
  title = "title here",
  bg,
  fc = "#333",
  fs = 17,
  icn1 = "",
  ict1 = "",
  icn2 = "",
  ict2 = "",
  onPressIc1,
  onPressIc2,
  }) => {
    return (
        <View >

          <View style={[styles.body,{backgroundColor:bg}]} >
              { icn1 != "" && <Icon name={icn1} type={ict1} onPress={onPressIc1} style={{padding:10,}} containerStyle={{borderRadius:50}} />}
              <Text style={{fontSize:fs,color:fc}}>
                {title}
              </Text>
              { icn2 != "" && <Icon name={icn2} type={ict2}  onPress={onPressIc2} style={{padding:10,}} containerStyle={{borderRadius:50}} />}
          </View>
          
        </View>
      )
    }
    
    export default Header
    
    const styles = StyleSheet.create({
        body:{
          height:50,
          flexDirection:"row",
          alignItems:"center",
          justifyContent:'space-between',
          paddingHorizontal:10
        }
    })