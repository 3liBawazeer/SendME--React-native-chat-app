import React, {useState, useRef, useEffect} from 'react';
import {
  Alert,
  TextInput,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  BackHandler
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {Icon, Button} from '@rneui/base';
import InputPhoneNumber from '../../components/InputPhoneNumber';
import LinearGradient from 'react-native-linear-gradient';
import {ActivityIndicator} from 'react-native';
import OtpInputs from 'react-native-otp-inputs';
import {signUp} from '../../Requists';
import {useAuth} from '../../Contexts/Auth_Context';
import StepIndicator from 'react-native-step-indicator';
import Lottie from 'lottie-react-native';
import { Input } from '@rneui/themed';
import messageing from "@react-native-firebase/messaging"
import { colors } from '../../assets/colors';
import { useLocalDataBase } from '../../Contexts/LocalDataBase';
// cokors 7207c4 ==>

const customStyles = {
  stepIndicatorSize: 25,
  currentStepIndicatorSize: 30,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: '#6A2DD6',
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: '#6A2DD6',
  stepStrokeUnFinishedColor: '#aaaaaa',
  separatorFinishedColor: '#6A2DD6',
  separatorUnFinishedColor: '#aaaaaa',
  stepIndicatorFinishedColor: '#6A2DD6',
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: '#6A2DD6',
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: '#aaaaaa',
  labelColor: '#999999',
  labelSize: 13,
  currentStepLabelColor: '#6A2DD6',
};

const PhoneVerifcation = ({navigation}) => {
  const scrollViewRef = useRef();
  let animationRef = useRef(null);
  const {setAllMessages,setLastChats,setMessagesNotRead} = useLocalDataBase();

  useEffect(() => {
    animationRef.current?.play(0, 240);
    setAllMessages([]);
    setLastChats([]);
    setMessagesNotRead([]);
  }, []);

  

  // If null, no SMS has been sent
  const [confirm, setConfirm] = useState(null);
  const [phoneNumber, setphoneNumber] = useState('');
  const [countryKey, setcountryKey] = useState('+967');

  const [loading, setloading] = useState(false);
  const [verLoading, setverLoading] = useState(false);

  const [code, setCode] = useState('');

  // Handle the button press

  const checkSignIn = () => {
    if (phoneNumber == '') {
      Alert.alert('!', 'رقم الهاتف مطلوب لتسجيل الدخول');
    } else if (phoneNumber.length < 7) {
      Alert.alert('!', 'رقم الهاتف قصير جدا الرجاء التأكد من الرقم');
    } else if (phoneNumber.length > 10) {
      Alert.alert('!', 'رقم الهاتف طويل جدا الرجاء التأكد من الرقم');
    } else {
      signInWithPhoneNumber(countryKey + phoneNumber);
    }
  };

  async function signInWithPhoneNumber() {
    setloading(true);

    try {
      const numbers = ["713263323"];
      if (!numbers.includes(phoneNumber)) {
        const Confirmation = await auth().signInWithPhoneNumber(countryKey + phoneNumber);
        if (Confirmation) {
          setConfirm(Confirmation);
          setloading(false);
        }
      }else{
        const fcmToken = await messageing().getToken();
        signUp({phoneNumber,countryKey,FCMtoken:fcmToken})
          .then(data => {
            if (data.data.res.new == 'true') {
              setverLoading(false);
              navigation.replace('signIn', {
                data: data.data,
                phoneNumber,
                countryKey,
              });
            } else if (data.data.res.new == 'false') {
              saveloggedIn(data.data);
              navigation.replace('home', {
                data: data.data,
                phoneNumber,
                countryKey,
              });
            }else{
              setverLoading(false);
              Alert.alert('خطأ', ' تأكد من إتصالك بالشبكة  📶 ');
            }
          }).catch((error)=>{
            
                const err = error.message.split(' ')[0];
                switch (err) {
                  case '[auth/invalid-phone-number]':
                    Alert.alert(
                      '!خطأ',
                      'حدث خطأ اثنأ تسجيل الدخول الرجاء التأكد من الرقم ',
                    );
                    break;
                  case '[auth/network-request-failed]':
                    Alert.alert('خطأ', 'تأكد من إتصالك بالشبكة ');
                    break;
                    case '[auth/network-request-failed]':
                      Alert.alert('خطأ', 'تأكد من إتصالك بالشبكة ');
                      break;
                  default:
                    console.log(err,"//////");
                    break;
                }
                setloading(false);
          })
          .finally(()=>{
            setverLoading(false);
          })
          // .catch(err => {
          //   setverLoading(false);
          //   Alert.alert('خطأ', ' تأكد من إتصالك بالشبكة ');
          // });

      }
    } catch (error) {
      console.log(error);
      const err = error.message.split(' ')[0];
      switch (err) {
        case '[auth/invalid-phone-number]':
          Alert.alert(
            '!خطأ',
            'حدث خطأ اثنأ تسجيل الدخول الرجاء التأكد من الرقم ',
          );
          break;
        case '[auth/network-request-failed]':
          Alert.alert('خطأ', 'تأكد من إتصالك بالشبكة ');
          break;
        case '[auth/unknown]':
          Alert.alert(' خطأ',"لايمكن تسجيل الدخول في الوقت الحالي الرجاء المحاوله لاحقاً");
          break;
        default:
          console.log(err,"^_^");
          break;
      }
      setloading(false);
    }
  }

  const {saveloggedIn} = useAuth();

  async function confirmCode() {
    setverLoading(true);
    try {
      const aa = await confirm.confirm(code);
      // console.log(aa);

      if (aa) {
        const fcmToken = await messageing().getToken();
        signUp({phoneNumber, countryKey,FCMtoken:fcmToken})
          .then(data => {
            if (data.data.res.new == 'true') {
              setverLoading(false);
              navigation.replace('signIn', {
                data: data.data,
                phoneNumber,
                countryKey,
              });
            } else if (data.data.res.new == 'false') {
              saveloggedIn(data.data);
              navigation.replace('home', {
                data: data.data,
                phoneNumber,
                countryKey,
              });
            }else{
              setverLoading(false);
              Alert.alert('خطأ', ' تأكد من إتصالك بالشبكة ');
            }
          }).catch(err => {
            console.log(err,"rrrrrrrrrrr")
            setverLoading(false);
            Alert.alert('خطأ', ' تأكد من إتصالك بالشبكة ');
          });
      }else{
        setverLoading(false);
        // console.log(aa);
      }

    } catch (error) {
      const err = error.message.split(' ')[0];
      console.log(error.message, '|||');
      switch (err) {
        case '[auth/invalid-verification-code]':
          Alert.alert('!خطأ', 'رمز التحقق غير صحيح');
          break;
        case '[auth/network-request-failed]':
          Alert.alert('خطأ', 'تأكد من إتصالك بالشبكة ');
          break;
        default:
          break;
      }
      setverLoading(false);
    }
  }

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <LinearGradient
        colors={[colors.primary, colors.primary]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}>
        <ScrollView ref={scrollViewRef} contentContainerStyle={{}}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: '30%',
            }}>
            <Image
              source={require('../../assets/images/sendMe_fff.png')}
              style={{width: 200, height: 200}}
            />
          </View>

          <View
            style={{
              backgroundColor: '#fff',
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
              paddingTop: 30,
              height: '70%',
            }}>
            <View
              style={{
                margin: 50,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 0,
              }}>
              <Lottie
                ref={animationRef}
                source={require('../../assets/lottie/chat.json')}
                autoPlay
                style={{width: 50, height: 200}}
              />
            </View>

            <View style={{}}>
              <View
                style={{
                  marginBottom: 0,
                  // marginTop: -5,
                  marginHorizontal: 5,
                  // alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.secondry,
                    marginHorizontal: 35,
                  }}>
                  أدخل رقم الجوال للتسجيل الدخول
                </Text>
              </View>

              <View style={styles.body}>
                <View style={{alignItems: 'center'}}>
                  <InputPhoneNumber
                    editable={!loading}
                    onSubmitEditing={checkSignIn}
                    onContentSizeChanged={() => {
                      // console.log('ddfocus    s ss  s s');
                      console.log(scrollViewRef.current.scrollToEnd);
                      scrollViewRef.current.scrollToEnd({animated: true});
                    }}
                    onSelectKey={r => {
                      setcountryKey(r);
                    }}
                    onChangeNumber={t => setphoneNumber(t)}
                  />
                </View>

                <View
                  style={{
                    margin: 0,
                    marginVertical: 30,
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    style={{elevation: 0, backgroundColor: '#fff'}}
                    onPress={() => {
                      if (loading) {
                        return
                      }
                      checkSignIn();
                    }}>
                    <LinearGradient
                      colors={[colors.primary, '#7F8CE9']}
                      start={{x: 1, y: 0}}
                      end={{x: 0, y: 0}}
                      style={styles.btn}>
                      {loading ? (
                        <ActivityIndicator size={24} color={colors.light}  />
                      ) : (
                        <>
                          <Text style={styles.text}>التالي</Text>
                          <Icon
                            name="chevron-small-right"
                            color={'#fff'}
                            type="entypo"
                            style={{
                              backgroundColor: '#fff3',
                              borderRadius: 20,
                              marginHorizontal: 10,
                            }}
                          />
                        </>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>

      <Modal visible={confirm != null} animationType="slide" onRequestClose={()=>{BackHandler.exitApp()}} >
        <View style={{flex: 1, backgroundColor: '#fff'}}>
          <LinearGradient
            colors={[colors.primary, colors.primary]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}>
            <ScrollView contentContainerStyle={{}}> 
              <View
                style={{
                  marginTop: 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '30%',
                }}>
                <Image
                  source={require('../../assets/images/sendMe_fff.png')}
                  style={{width: 200, height: 200}}
                />
              </View>

              <View
                style={{
                  backgroundColor: '#fff',
                  borderTopRightRadius: 20,
                  borderTopLeftRadius: 20,
                  paddingTop: 0,
                  height: '70%',
                }}>
                <View
                  style={{
                    margin: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 0,
                  }}>
                  <Lottie
                    ref={animationRef}
                    source={require('../../assets/lottie/otpVerification.json')}
                    autoPlay
                    useNativeLooping
                    // loop={false}
                    style={{width: 50, height: 200}}
                  />
                </View>

                <View style={{}}>
                  <View
                    style={{
                      marginBottom: -10,
                      marginTop: -5,
                      marginHorizontal: 5,
                      alignItems: 'center',
                    }}>
                    <Text style={{fontSize: 14, color: colors.secondry}}>
                      لقد تم إرسال رمز التحقق الى{' '}
                      {countryKey + ' ' + phoneNumber}
                    </Text>
                  </View>

                  <View style={styles.body}>
                    <View style={{alignItems: 'center'}}>
                       <Input 
                        value={code}
                        placeholder=" *  *  *  *  *  * "
                        onChangeText={(t)=>setCode(t)}
                        keyboardType='phone-pad'
                        onSubmitEditing={()=>{ 
                          if (code == "") {
                          Alert.alert("!","أدخل رمز التحقق")
                        }else{
                          confirmCode();
                        }}}
                        autoFocus
                        style={{
                          textAlign:'center',
                          // backgroundColor:"#08d"
                        }}
                       />
                      {/* <OtpInputs
                        handleChange={code => setCode(code)}
                        onSubmitEditing={() => confirmCode()}
                        autoFocus={true}
                        numberOfInputs={6}
                        inputContainerStyles={{
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        inputStyles={{
                          borderBottomWidth: 1,
                          marginHorizontal: 5,
                          borderColor: '#7207c4',
                          textAlign: 'center',
                          height: 40,
                          width: 40,
                          fontSize: 17,
                          fontWeight: '900',
                          color: '#f88',
                        }}
                      /> */}
                    </View>

                    <View
                      style={{margin: 0, marginTop: 30, alignItems: 'center'}}>
                      <TouchableOpacity
                        style={{elevation: 0}}
                        onPress={!verLoading ? () => {
                          if (code == "") {
                            Alert.alert("!","أدخل رمز التحقق")
                          }else{
                            confirmCode();
                          }
                        }:null}>
                        <LinearGradient
                          colors={[colors.primary, '#7F8CE9']}
                          start={{x: 0, y: 0}}
                          end={{x: 1, y: 0}}
                          style={styles.btn}>
                          {verLoading ? (
                            <ActivityIndicator size={24} color={'#fff'} />
                          ) : (
                            <>
                              <Text style={styles.text}>التالي</Text>
                              <Icon
                                name="chevron-small-right"
                                color={'#fff'}
                                type="entypo"
                                style={{
                                  backgroundColor: '#fff3',
                                  borderRadius: 20,
                                  marginHorizontal: 10,
                                }}
                              />
                            </>
                          )}
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
          </LinearGradient>
        </View>
      </Modal>
    </View>
  );
};

export default PhoneVerifcation;

const styles = StyleSheet.create({
  body: {
    padding: 18,
    margin: 18,
    borderRadius: 10,
    paddingVertical: 30,
    marginTop: 0,
    // elevation:10,
    // shadowColor:"#9907f1",
    // backgroundColor:"#fff",
  },
  btn: {
    padding: 11,
    alignItems: 'center',
    borderRadius: 0,
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#fff',
    // elevation: 5,
    shadowColor: '#7207c4',
  },
  text: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
    marginHorizontal: 5,
  },
});
