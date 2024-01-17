import { StyleSheet, Text, View } from 'react-native'
import React , {useState,memo} from 'react'
import Input from '../../components/Input'
import { colors } from '../../assets/colors'
import { Icon } from '@rneui/base'

const InputChat = ({
    sendMessage,
    setmesgContent
}) => {

    const [message, setmessage] = useState("")

  return (
    <View>
    {/* <Text>{}</Text> */}
    <View style={styles.inpt}>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingEnd: 5,
        }}>
        {/* <Icon
          name={"emoji-happy"}
          type="entypo"
          color={colors.secondry}
          containerStyle={{borderRadius:50,overflow:"hidden"}}
          underlayColor={colors.secondry}
          style={{padding:5,}}
          
        /> */}
      </View>
      
      <View style={{flex: 2}}>
        <Input
          placeholder="اكتب ..."
          bg={'#fff'}
          bw={1}
          bc={message != ""?colors.primary:colors.secondry}
          mh={5}
          e={0}
          shc="#08d"
          br={50}
          ph={15}
          // multH={100}
          mult
          fc={colors.typograf}
          icn2="send"
          ict2="font-awesome"
          icc2="#08d"
          value={message}
          // focusAndBlur={!emojis}
          onChangeText={t => {setmesgContent(t);setmessage(t)}}
        />
      </View>

      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          backgroundColor:
            message != '' ? colors.primary : colors.secondry,
          borderRadius: 50,
          height:50,
          // flex:1
        }}>
        <Icon
          name="send"
          type="font-awesome"
          containerStyle={{borderRadius: 500}}
          underlayColor={colors.light}
          style={{
            padding: 15,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          disabled={message == ''}
          disabledStyle={{backgroundColor: '#0000'}}
          color={colors.light}
          size={20}
          onPress={() => {
            setmessage("")
            sendMessage();
          }}
        />
      </View>
    </View>

    {/* <EmojiPicker
    allowMultipleSelections
    enableSearchBar={false}
     
     onEmojiSelected={(e)=>{
      // console.log(e.emoji);
    }} open={showEmojiModel} onClose={() => setshowEmojiModel(false)} /> */}
  </View>
  )
}

export default memo(InputChat)

const styles = StyleSheet.create({
    inpt: {
        overflow: 'hidden',
        marginTop: 0,
        flexDirection: 'row-reverse',
        alignItems: 'flex-end',
        padding: 5,
        backgroundColor: '#fff',
        margin: 5,
        borderRadius: 25,
        borderColor: colors.secondry,
      },
})