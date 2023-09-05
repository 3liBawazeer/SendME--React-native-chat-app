import React, {useState, useEffect, useRef} from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  ScrollView,
  Image,
  Modal,
} from 'react-native';
import {editProfile, signIn, signUp} from '../../Requists';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useAuth} from '../../Contexts/Auth_Context';
import {Avatar} from '@rneui/themed';
import {Icon} from '@rneui/base';
import ImagePicker from 'react-native-image-crop-picker';
import Btn from '../../components/Btn';
import Input from '../../components/Input';
import storage from '@react-native-firebase/storage';
import LinearGradient from 'react-native-linear-gradient';
import Lottie from 'lottie-react-native';

const SignIn = ({navigation, route}) => {


    let animationRef = useRef(null)

    useEffect(() => {
      // animationRef.current?.play()
  
      // Or set a specific startFrame and endFrame with:
      animationRef.current?.play(0, 240,);
    }, [])

  const {isLoggedIn, saveloggedIn, setUserData, userData, checkUser} =
    useAuth();
  const {phoneNumber, data, countryKey} = route.params;
  const [ImageSelected, setImageSelected] = useState('');
  const [username, setusername] = useState('');
  const [loading, setloading] = useState(false);
  const [uploadLoading, setuploadLoading] = useState(false)

  // useEffect(()=>{
  //     checkUser()
  // },[isLoggedIn])

  // const logNav = () => navigation.navigate("home");

  // const [signData, setsignData] = useState({
  //     phoneNumber:"",
  //     password:"",
  // });
  // const [loading, setloading] = useState(false)

  // const sign_in = () => {
  //      if (signData.phoneNumber == "") {Alert.alert("!"," رقم الهاتف مطلوب")}
  //     else if (signData.password == "") {Alert.alert("!"," كلمة الرور مطلوبه")}
  //     else{
  //         setloading(true)
  //         const data = {
  //             phoneNumber:signData.phoneNumber,
  //             password:signData.password,
  //         };

  //         signIn(data).then((data)=>{
  //           console.log(data.data.res.token);
  //             saveloggedIn(data.data)
  //             setsignData({
  //                 phoneNumber:"",
  //                 password:"",
  //             });
  //             navigation.navigate("home")
  //         }).catch((err)=>{
  //             if (err.response.data.errorCode == "InvalidLogin") {
  //                 Alert.alert("!","كلمة الرور او رقم الهاتف غير صحيح !")
  //             } else if (err.response.data.errorCode == "NotRegistered") {
  //                 Alert.alert("!","كلمة الرور او رقم الهاتف غير صحيح !")
  //             }
  //         })
  //         .then(()=>setloading(false))

  //     }
  //  }

  const signIn = async () => {
    console.log(data.res.token);
    setloading(true);
    setuploadLoading(true)
    try {
      // save image in firebase storage
      const reference = storage().ref(
        `usersImgaes/${data.res.user.phoneNumber}-profile.png`,
      );
      await reference.putFile(ImageSelected);

    //   get uri image from firebase storage
    const image = await storage().ref(`usersImgaes/${data.res.user.phoneNumber}-profile.png`).getDownloadURL();
      if (image) {
        editProfile({phoneNumber, username , image}, data.res.token)
        .then(dat => {
          const allData = {
            res: {user: dat.data.res.user, token: data.res.token},
          };
          console.log(allData);
          saveloggedIn(allData);
          navigation.replace('home');
        })
        .catch(err =>{
            setloading(false);
            setuploadLoading(false)
            console.log(err.response)
        });
      }
      setloading(false);
      setuploadLoading(false)
    } catch (error) {
      setuploadLoading(false)
      console.log(error);
    }
  };

  const selectImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      cropperCircleOverlay:true
    }).then(image => {
      setImageSelected(image.path);
    });
  };

  return (
    <View style={{flex:1,backgroundColor:"#fff"}}>
         <LinearGradient 
            colors={['#5B70F7','#7F8CE9',]}
          start={{ x: 0, y: 0.5}} end={{ x: 1, y: 0 }}
          style={{flex:1}}
            >
        <ScrollView 
        contentContainerStyle={{paddingVertical:20,paddingTop:0}}
        >
     
        <View style={{alignItems:'center',justifyContent:"center",height:"30%",}}>
            <Image source={require("../../assets/images/sendMe_fff.png")} style={{width:200,height:200,borderRadius:30}} />
          </View>

      {/* <View style={{alignItems: 'center', marginVertical: 40, marginTop: 10}}>
        <Text style={{fontSize: 15, fontWeight: '700', color: '#fff'}}>
          أضف صورتك وإسمك لكي يسهل التعرف عليك
        </Text>
      </View> 
      */}

      <View style={{backgroundColor:"#fff",borderRadius:40,marginHorizontal:15,paddingTop:30,height:"70%",paddingBottom:10,marginTop:10,elevation:7,shadowColor:"#08d"}}>

      <View style={{alignItems: 'center', elevation: 5}}>
        <TouchableOpacity
          onPress={selectImage}
          style={{
            alignItems: 'center',
            marginTop: 0,
            backgroundColor: '#fff',
            width: 150,
            height: 150,
            borderRadius: 50,
            borderWidth:ImageSelected !== "" ?0:1,
            borderStyle:'dashed',
            borderColor:"#08d",
            justifyContent: 'center',
            overflow: 'hidden',
          }}>
          {ImageSelected == '' ? (
            <>
              <Icon
                name="camera-plus-outline"
                type="material-community"
                size={50}
                color="#08d"
              />
              <Text style={{fontSize: 16, fontWeight: 'bold', color: '#08d'}}>
                أضف صورتك
              </Text>
            </>
          ) : (
            <Image
              style={{width: '100%', height: '100%'}}
              source={{uri: ImageSelected}}
            />
          )}
        </TouchableOpacity>
      </View>

      <View>
        <View style={{alignItems: 'center', margin: 40, marginBottom: 0}}>
          <Input
            ic2
            icc2={'#5274E9'}
            icn2="person"
            ict2="fontisto"
            placeholder="أدخل إسمك"
            onChangeText={x => setusername(x)}
            value={username}
            bw={2}
            multH={40}
            br={10}
            bc="#08d2"
          />
        </View>

        <Btn onPress={signIn} loading={loading} />
      </View>

      </View>

      <Modal visible={uploadLoading} animationType="fade" transparent>
        <View style={{flex:1,justifyContent:"center",backgroundColor:"#3334",alignItems:"center"}}>


            <View style={{backgroundColor:"#fff",padding:30,paddingBottom:30,borderRadius:40,marginHorizontal:15,marginTop:10,elevation:7,shadowColor:"#08d"}}>

            <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop:0
            }}>
            <Lottie
                ref={animationRef}
                source={require("../../assets/lottie/uploading.json")}
                autoPlay
                style={{height:200,}}
              />
          </View>

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop:0,
              flexDirection:"row"
            }}>
               
            <Lottie
                ref={animationRef}
                source={require("../../assets/lottie/loading.json")}
                autoPlay
                style={{height:50,}}
              />
               <Text style={{color:"#07d",fontSize:17}}> جارِ الرفع يرجى الإنتظار ... </Text>
          </View>


            </View>

        </View>
      </Modal>

      
    </ScrollView>
    </LinearGradient>
    </View>
  );
};

export default SignIn;

const styles = StyleSheet.create({});
