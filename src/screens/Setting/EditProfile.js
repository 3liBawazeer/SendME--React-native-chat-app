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
  StatusBar,
  ToastAndroid,
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
import { useLocalDataBase } from '../../Contexts/LocalDataBase';
import { colors } from '../../assets/colors';

const EditProfile = ({navigation}) => {
  let animationRef = useRef(null);

  useEffect(() => {
    animationRef.current?.play(30, 120);
    setusername(userData.username)
    return () => setusername("")
  }, []);

  

  const {saveloggedIn, userData, Token } = useAuth();
  const {RemoveAllData} = useLocalDataBase();


  const [username, setusername] = useState("");
  const [ImageSelected, setImageSelected] = useState('');
  const [loadEditName, setloadEditName] = useState(false);
  const [showEditName, setshowEditName] = useState(false);
  const [editImageLoading, seteditImageLoading] = useState(false);

  const editImage = async img => {
    seteditImageLoading(true);
    try {
      const reference = storage().ref(
        `usersImgaes/${userData.phoneNumber}-profile.png`,
      );
      await reference.putFile(img);
      const image = await storage()
        .ref(`usersImgaes/${userData.phoneNumber}-profile.png`)
        .getDownloadURL();
      if (image) {
        editProfile(
          {
            phoneNumber: userData.phoneNumber,
            username: userData.username,
            image,
          },
          Token,
        )
          .then(dat => {
            const allData = {
              res: {user: dat.data.res.user, token: Token},
            };
            saveloggedIn(allData);
            setImageSelected('');
            // ToastAndroid.show("تم تعديل الصورة")
          })
          .catch(err => {
            seteditImageLoading(false);
            console.log(err.response);
          });
          seteditImageLoading(false);
      }else{
        console.log(" لم يتم حفظ الصوره");
        seteditImageLoading(false);

      }
      
    } catch (err) {
      seteditImageLoading(false);
      console.log(err.response);
    }
  };
  const selectImage = () => {
    ImagePicker.openPicker({
      // width: 300,
      // height: 400,
      cropping: true,
      cropperCircleOverlay: true,
      freeStyleCropEnabled:true
    }).then(image => {
      setImageSelected(image.path);
      editImage(image.path);
    }).catch(()=>{
      
    })
  };

  // console.log(userData?.image);

  const editName = () => {
    // console.log(username);
    setloadEditName(true);
    editProfile(
      {phoneNumber: userData.phoneNumber, username, image: userData.image},
      Token,
    ).then(dat => {
        const allData = {res:{user: dat.data.res.user, token: Token}};
        saveloggedIn(allData)
        setloadEditName(false);
        setshowEditName(false);
        setusername("")
      })
      .catch(err => {
        setloadEditName(false)
        console.log(err.response);
      });
  };

  //   const signIn = async () => {
  //     setloading(true);
  //     setuploadLoading(true);
  //     try {
  //       // save image in firebase storage

  //       if (image) {
  //         editProfile({phoneNumber:userData.phoneNumber, username, image}, Token)
  //           .then(dat => {
  //             const allData = {
  //               res: {user: dat.data.res.user, token: Token},
  //             };
  //             saveloggedIn(allData);
  //             navigation.goBack();
  //           })
  //           .catch(err => {
  //             setloading(false);
  //             setuploadLoading(false);
  //             console.log(err.response);
  //           });
  //       }
  //       setloading(false);
  //       setuploadLoading(false);
  //     } catch (error) {
  //       setuploadLoading(false);
  //       console.log(error);
  //     }
  //   };

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <LinearGradient
        colors={[colors.primary, colors.primary]}
        start={{x: 0, y: 0.5}}
        end={{x: 1, y: 0}}
        style={{
          paddingTop: StatusBar.currentHeight,
          flexDirection: 'row-reverse',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: 80,
          borderBottomRightRadius: 3,
          borderBottomLeftRadius: 3,
          paddingHorizontal: 10,
        }}>
        <Icon
          name="arrow-right"
          type="material-community"
          style={{opacity: 0}}
        />
        <Text
          style={{
            color: '#fff',
            fontSize: 20,
            padding: 10,
            textAlign: 'center',
          }}>
          {' '}
          الملف الشخصي{' '}
        </Text>
        <Icon
          name="arrow-right"
          type="material-community"
          color="#fff"
          style={{padding: 10, borderRadius: 50, overflow: 'hidden'}}
          onPress={() => {
            navigation.goBack();
          }}
        />
      </LinearGradient>

      <View
        style={{
          backgroundColor: '#fff',
          paddingTop: 30,
          paddingBottom: 10,
          flex: 1,
          alignItems: 'center',
          //   justifyContent:"center"
        }}>
        <View style={{alignItems: 'center', elevation: 5}}>
          {!editImageLoading && (
            <View
              style={{
                position: 'absolute',
                zIndex: 100,
                backgroundColor: '#fff',
                // padding:5,
                borderRadius: 50,
                bottom: -10,
                elevation: 5,
                left: 10,
                overflow: 'hidden',
              }}>
              <Icon
                name="image-edit-outline"
                type="material-community"
                style={{padding: 7}}
                onPress={selectImage}
              />
            </View>
          )}
          <View
            style={{
              alignItems: 'center',
              marginTop: 0,
              backgroundColor: '#fff',
              width: 150,
              height: 150,
              borderRadius: 60,
              borderWidth: ImageSelected !== '' ? 1 : 1,
              borderStyle: ImageSelected !== '' ? 'solid' : 'dashed',
              borderColor: '#08d',
              justifyContent: 'center',
              overflow: 'hidden',
              elevation: 1,
            }}>
            {editImageLoading ? (
              <>
                <Lottie
                  ref={animationRef}
                  source={require('../../assets/lottie/loading.json')}
                  autoPlay
                  style={{height: 100}}
                />
              </>
            ) : (
              <>
                <Image
                  style={{width: '100%', height: '100%',backgroundColor:"#eef"}}
                  // source={ImageSelected !== '' && {uri: ImageSelected} }
                  source={ userData?.image == 'image-user.png' ||  userData?.image == ""
                  ? require('../../assets/images/user-image.png')
                  : {uri: userData?.image}}
                />
              </>
            )}
          </View>
        </View>

        <View style={{marginTop: 50}}>
          <Text
            style={{
              marginHorizontal: 30,
              color: '#444',
              fontSize: 15,
              fontWeight: '700',
            }}>
            إسم المستخدم
          </Text>
          <View
            style={{flexDirection: 'row', alignItems: 'center', width: '100%'}}>
            <Icon name="user" type="ant-design" style={{padding: 20}} color="#aaa" />
            <View
              style={{
                marginHorizontal: 5,
                padding: 10,
                borderBottomColor: '#ddd',
                borderBottomWidth: 0.8,
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={{color: '#444', fontSize: 16}}>
                {' '}
                {userData?.username}{' '}
              </Text>
              <Icon
                name="edit"
                type="feather"
                color="#aaa" 
                style={{padding: 5}}
                onPress={() => {
                  setshowEditName(true);
                }}
              />
            </View>
          </View>
        </View>

        <View style={{marginTop: 10}}>
          <Text
            style={{
              marginHorizontal: 30,
              color: '#444',
              fontSize: 15,
              fontWeight: '700',
            }}>
            رقم الجوال
          </Text>
          <View
            style={{flexDirection: 'row', alignItems: 'center', width: '100%'}}>
            <Icon name="mobile1" type="ant-design" style={{padding: 20}}  color="#aaa"  />
            <View
              style={{
                marginHorizontal: 5,
                padding: 10,
                borderBottomColor: '#ddd',
                borderBottomWidth: 0.8,
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={{color: '#444', fontSize: 16}}>
                {' '}
                {userData.countryKey + ' ' + userData.phoneNumber}{' '}
              </Text>
              {/* <Icon name="edit" type="feather" style={{padding:5}} 
                   onPress={()=>{setshowEditName(true)}}
                  /> */}
            </View>
          </View>
        </View>

        <Modal
          visible={showEditName}
          animationType="slide"
          onRequestClose={() => {
            setshowEditName(false);
          }}>
          <LinearGradient
            colors={[colors.primary, colors.primary]}
            start={{x: 0, y: 0.5}}
            end={{x: 1, y: 0}}
            style={styles.hd}>
            <Icon
              name="arrow-right"
              type="material-community"
              style={{opacity: 0}}
            />
            <Text
              style={{
                color: '#fff',
                fontSize: 20,
                padding: 10,
                textAlign: 'center',
              }}>
              {' '}
              تعديل إسم المستخدم{' '}
            </Text>
            <Icon
              name="arrow-right"
              type="material-community"
              color="#fff"
              style={{padding: 10, borderRadius: 50, overflow: 'hidden'}}
              onPress={() => {
                setshowEditName(false);
              }}
            />
          </LinearGradient>
          <View style={{alignItems: 'center', margin: 20, marginBottom: 0}}>
            <Input
              ic2
              icc2={colors.secondry}
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
            <Btn
              onPress={editName}
              loading={loadEditName}
              title="تعديل الإسم"
            />
          </View>
        </Modal>
      </View>
    </View>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  hd: {
    // paddingTop:StatusBar.currentHeight,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    // height:50,
    borderBottomRightRadius: 3,
    borderBottomLeftRadius: 3,
    paddingHorizontal: 10,
  },
});
