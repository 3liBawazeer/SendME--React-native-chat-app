import { StyleSheet, Text, TouchableOpacity, View, } from 'react-native'
import React ,{ useState} from 'react'
import CountryPicker from 'react-native-country-picker-modal'
import { TextInput } from 'react-native-gesture-handler'
import { Icon } from '@rneui/themed'

const InputPhoneNumber = ({
    codeStyle,
    onSelectKey,
    onChangeNumber,
    placeholder="أدخل رقم جوالك",
    containerStyle,
    onFocus,
    onContentSizeChange
}) => {


    const [countryCode, setCountryCode] = useState('FR')
    const [country, setCountry] = useState(null)
    const [CountryKey, setCountryKey] = useState("+967")

    const [Number, setNumber] = useState("")

    const [showMDL, setshowMDL] = useState(false)

    const [withCountryNameButton, setWithCountryNameButton] = useState(false)
    const [withFlag, setWithFlag] = useState(true)
    const [withEmoji, setWithEmoji] = useState(false)
    const [withFilter, setWithFilter] = useState(true)
    const [withAlphaFilter, setWithAlphaFilter] = useState(false)
    const [withCallingCode, setWithCallingCode] = useState(false)

    
    const onSelect = (country) => {
        // console.log("+"+country.callingCode[0]);
        setCountryKey("+"+country.callingCode[0])
        onSelectKey(`+${country.callingCode[0]}`)
        setshowMDL(false)
      setCountryCode(country.cca2)
      setCountry(country)
    }

  return (
    <View style={[styles.container,containerStyle]}>

    <View style={styles.input}>
        <TextInput
        onFocus={onFocus}
         placeholder={placeholder}
         keyboardType="phone-pad"
         value={Number}
         onChangeText={(t)=>{
            setNumber(t)
            onChangeNumber(t)
         }}
         onContentSizeChange={onContentSizeChange}
         
        />
    </View>

    <TouchableOpacity 
    onPress={()=>{
        setshowMDL(true)
    }} style={{justifyContent:"center",flexDirection:"row",alignItems:"center",width:"15%",borderRightWidth:1,marginVertical:4,borderColor:"#08d5"}}>
        {/* <Icon name='chevron-small-down' type='entypo' /> */}
        <Text style={[{color:"#333"},codeStyle]}> {CountryKey}  </Text>
    </TouchableOpacity>

    
    <CountryPicker
      {...{
        countryCode,
        withFilter,
        withFlag,
        withCountryNameButton,
        withAlphaFilter,
        withCallingCode,
        withEmoji,
        onSelect,
      }}
      
      visible={showMDL}
      containerButtonStyle={{backgroundColor:"#08d",opacity:0,width:1}}
    />
    
  </View>
  )
}

export default InputPhoneNumber

const styles = StyleSheet.create({
    container:{
    flexDirection:"row-reverse",
    backgroundColor:"#fff",
    width:"100%",
    borderWidth:2,
    borderColor:"#08d2",
    borderRadius:10,
    
    },
    input:{
        width:"85%",
        alignItems:"center",
        height:40
        
    }
})