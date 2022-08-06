import React from 'react'
import { StyleSheet, Text, View,TextInput } from 'react-native'
import { Icon } from '@rneui/themed'

const Input = ({
    ic1=false,
    ic2=false,
    mult=false,
    multH,
    bg,
    icc1,
    ics1,
    ict1,
    icn1,
    icc2,
    ics2,
    ict2,
    icn2,
    placeHoldColor = "#777",
    placeholder,
    onChangeText,
    value,
    fs,
    ff,
    fc = "#333",
    fw,
    br,
    ta,
    keyboardType,
    password,
    editable,
    bbw,
    bbc,
    bblr,
    bbrr,
    btrr,
    btlr,
    e,
    bw,
    onPressic1
}) => {
    return (
        <View style={{
            flexDirection:"row",
            alignItems:"center",
            backgroundColor:bg,
            borderWidth:bw,
            borderRadius:br,
            borderBottomWidth:bbw,
            borderBottomColor:bbc,
            borderBottomLeftRadius:bblr,
            borderBottomRightRadius:bbrr,
            borderTopRightRadius:btrr,
            borderTopLeftRadius:btlr,
            elevation:e,
            }}>

              { ic1 && <View style={{width:"10%"}}>
                <Icon name={icn1} type={ict1}  color={icc1} size={ics1} onPress={onPressic1} style={{padding:5}} containerStyle={{borderRadius:50}} />
               </View>} 

            <View style={{width: !ic2&&!ic1? '100%' : ic1  ?'80%':'90%',height:multH}}>
              <TextInput 
              keyboardType={keyboardType}
              placeholder={placeholder}
              placeholderTextColor={placeHoldColor}
              onChangeText={onChangeText}
              value={value}
              secureTextEntry={password}
              multiline={mult}
              style={{
                  fontSize:fs,
                  fontFamily:'NotoKufiArabic-Medium',
                  fontWeight:fw,
                  color:fc,
                  paddingHorizontal:10,
                  textAlign:ta
              }}
              editable={editable}
              />
            </View>

            { ic2 && <View style={{width:"10%"}}>
            <Icon name={icn2} type={ict2}  color={icc2} size={ics2} />
            </View>}

        </View>
    )
}

export default Input

const styles = StyleSheet.create({})
