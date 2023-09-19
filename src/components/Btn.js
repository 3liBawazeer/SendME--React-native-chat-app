import { StyleSheet, Text, View ,TouchableOpacity, ActivityIndicator} from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { Icon } from '@rneui/themed'
import { colors } from '../assets/colors'
const Btn = ({
loading = false,
title = "التالي",
onPress,
icon = {name:'chevron-small-right',type:'entypo'}
}) => {
  return (
    <View style={{margin:0,marginTop:30,alignItems:"center"}}>
    <TouchableOpacity style={{ elevation:10}} 
                onPress={onPress}
            >
        <LinearGradient 
            colors={[colors.primary, colors.primary]} 
            end={{x:0.1,y:1}}
            style={styles.btn}
            >
           { loading 
            ? 
           <ActivityIndicator size={24} color={"#fff"} />
           :
           <>
            <Text style={styles.text}>{title}</Text>
            <Icon name={icon.name} color={"#fff"} type={icon.type} style={{backgroundColor:"#fff3",borderRadius:20,marginHorizontal:10}} />
            </>
            }
        </LinearGradient>
        </TouchableOpacity>
    </View>
  )
}

export default Btn

const styles = StyleSheet.create({
    btn:{
        padding: 11,
        alignItems: 'center',
        borderRadius: 0,
        flexDirection: 'row',
        justifyContent:"center",
        borderRadius:10,
        backgroundColor:"#fff",
        // elevation:20,
        shadowColor:"#7207c4"
        },
        text:{
            color:"#fff",
            fontWeight:"600",
            fontSize:18,
            marginHorizontal:5
        }
})