import {Icon} from '@rneui/base';
import {ListItem, Avatar} from '@rneui/themed';
import React, {useState, useRef, useEffect} from 'react';
import {TouchableOpacity, SectionList, Alert, Modal} from 'react-native';
import {StatusBar} from 'react-native';
import {View, StyleSheet, ScrollView, Image, Text} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useAuth} from '../../Contexts/Auth_Context';
import {useLocalDataBase} from '../../Contexts/LocalDataBase';
import {deleteAccount} from '../../Requists';
import Lottie from 'lottie-react-native';
import {colors} from '../../assets/colors';
import AlertLoading from '../../components/AlertLoading';
import AlertDialog from '../../components/AlertDialog';
const SettingHome = ({navigation}) => {
  let animationRef = useRef(null);

  useEffect(() => {
    animationRef.current?.play(30, 120);
    return () => {};
  }, []);

  const STATUSBAR_HEIGHT = StatusBar.currentHeight;
  const {saveloggedIn, userData, Token, logout} = useAuth();
  const {RemoveAllData,setAllMessages,setLastChats,setMessagesNotRead} = useLocalDataBase();
  const [loadDeleteAcount, setloadDeleteAcount] = useState(false);
  const [logoutLoading, setlogoutLoading] = useState(false);
  const [showAlertDialog, setshowAlertDialog] = useState(false)
const [showAlertDeleteAccount, setshowAlertDeleteAccount] = useState(false)
  const logOut = async () => {
    await RemoveAllData()
    logout().then(  () => {
      setlogoutLoading(false);
      (navigation.replace('phone'));
    });
  };

  const DelAccount = id => {

    setloadDeleteAcount(true);
    setshowAlertDeleteAccount(false)
    if (id) {
      const dara = {id: id, token: Token};
      // console.log(dara);
      logOut("del")
      .then(() => {
      deleteAccount(dara)
        .then(() => {
         
              // console.log('لقد تم حذف الحساب بنجاح');
              setloadDeleteAcount(false);
              setshowAlertDeleteAccount(false);
              (navigation.replace('phone'));
            
        })
        .catch(err => {
          console.log(err);
          setshowAlertDeleteAccount(false);
          setloadDeleteAcount(false);
          Alert.alert('حدث خطأ أثناْ حذف الحساب');
        });
      })
      .catch(err => {console.log(err);setshowAlertDeleteAccount(false);});
    } else {
      setloadDeleteAcount(false);
      
      Alert.alert('حدث خطأ أثناْ حذف الحساب');
    }
  };

  const list2 = [
    {
      name: 'Amy Farha',
      avatar_url: 'https://uifaces.co/our-content/donated/XdLjsJX_.jpg',
      subtitle: 'Vice President',
      linearGradientColors: ['#FF9800', '#F44336'],
    },
    {
      name: 'Chris Jackson',
      avatar_url: 'https://uifaces.co/our-content/donated/KtCFjlD4.jpg',
      subtitle: 'Vice Chairman',
      linearGradientColors: ['#3F51B5', '#2196F3'],
    },
    {
      name: 'Amanda Martin',
      avatar_url:
        'https://images.unsplash.com/photo-1498529605908-f357a9af7bf5?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=047fade70e80ebb22ac8f09c04872c40',
      subtitle: 'CEO',
      linearGradientColors: ['#FFD600', '#FF9800'],
    },
    {
      name: 'Christy Thomas',
      avatar_url: 'https://randomuser.me/api/portraits/women/48.jpg',
      subtitle: 'Lead Developer',
      linearGradientColors: ['#4CAF50', '#8BC34A'],
    },
    {
      name: 'Melissa Jones',
      avatar_url:
        'https://images-na.ssl-images-amazon.com/images/M/MV5BMTQwMDQ0NDk1OV5BMl5BanBnXkFtZTcwNDcxOTExNg@@._V1_UY256_CR2,0,172,256_AL_.jpg',
      subtitle: 'CTO',
      linearGradientColors: ['#F44336', '#E91E63'],
    },
  ];

  const DATA = [
    {
      title: 'إعدادت الحساب',
      data: [
        {
          title: 'الملف الشخصي',
          iconName: 'person',
          iconType: 'fontisto',
          onPress: () => {
            navigation.navigate('EditProfile');
          },
        },
        {
          title: 'تسجيل الخروج',
          iconName: 'log-out',
          iconType: 'feather',
          onPress: () => {
            setshowAlertDialog(true)
          },
        },
        {
          title: 'حذف الحساب',
          iconName: 'deleteuser',
          iconType: 'ant-design',
          onPress: () => {
            setshowAlertDeleteAccount(true);
            // Alert.alert('تنبيه !', 'هل تريد حذف هذا الحساب نهائياً!؟!', [
            //   {text: 'نعم', onPress: () => DelAccount(userData._id)},
            //   {text: 'تراجع'},
            // ]);
          },
        },
      ],
    },
  ];

  const editProfile = async () => {
    
    setuploadLoading(true);
    try {
      // save image in firebase storage
      const reference = storage().ref(
        `usersImgaes/${userData.phoneNumber}-profile.png`,
      );
      await reference.putFile(ImageSelected);

      //   get uri image from firebase storage
      const image = await storage()
        .ref(`usersImgaes/${userData.phoneNumber}-profile.png`)
        .getDownloadURL();
      if (image) {
        editProfile({phoneNumber, username, image}, data.res.token)
          .then(dat => {
            const allData = {
              res: {user: dat.data.res.user, token: data.res.token},
            };
            // console.log(allData);
            saveloggedIn(allData);
            navigation.replace('home');
          })
          .catch(err => {
            
            setuploadLoading(false);
            console.log(err.response);
          });
      }
      
      setuploadLoading(false);
    } catch (error) {
      setuploadLoading(false);
      console.log(error);
    }
  };

  const Item = ({item}) => (
    <TouchableOpacity onPress={item.onPress} style={styles.item}>
      <Icon
        name={item.iconName}
        type={item.iconType}
        color={colors.secondry}
        style={{
          padding: 5,
          marginHorizontal: 10,
          width: 45,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />
      <Text style={styles.title}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <>
      {/* logout */}
      <AlertDialog
        data={{
          title: 'تسجيل الخروج',
          body: 'هل تريد تسجيل الخروج؟ سيتم حذف جميع الدردشات والرسائل!',
          visible: showAlertDialog,
        }}
        btns={{
          acceptBtnPress:() => {
                    logOut();
                    setlogoutLoading(true);
                    setshowAlertDialog(false);
                  },
          rejectBtnPress:()=>{setshowAlertDialog(false);console.log("dd");},
          acceptBtnTitle:"نعم",
          rejectBtnTitle:"تراجع"
        }}
      />

      <AlertDialog
        data={{
          title: 'تنبيه',
          body: 'هل تريد حذف الحساب نهائيا؟ سيتم حذف جميع البينات المتعلقة بهذا الحساب !',
          visible: showAlertDeleteAccount,
          type:"danger"
        }}
        btns={{
          acceptBtnPress:() => {
                    DelAccount(userData._id)
                    
                  },
          rejectBtnPress:()=>{setshowAlertDeleteAccount(false);},
          acceptBtnTitle:"نعم",
          rejectBtnTitle:"تراجع"
        }}
      />
      <AlertLoading loading={logoutLoading||loadDeleteAcount} title={loadDeleteAcount?"جاري حذف الحساب":"جاري تسجيل الخروج"} />
      <View style={{flex: 1, backgroundColor: colors.light}}>
        <LinearGradient
          colors={[colors.primary, colors.primary]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}>
          <View
            style={{
              paddingTop: STATUSBAR_HEIGHT + 10,
              alignItems: 'center',
              flexDirection: 'row',
              padding: 10,
              paddingBottom: 10,
            }}>
            <Image
              source={
                userData.image == 'image-user.png' || userData.image == ''
                  ? require('../../assets/images/user-image.png')
                  : {uri: userData.image}
              }
              style={{
                width: 50,
                height: 50,
                margin: 5,
                borderRadius: 100,
                borderColor: '#fff',
                borderWidth: 0,
                backgroundColor: colors.light,
                marginBottom: 0,
              }}
            />
            <View
              style={{
                alignItems: 'center',
                //   margin: 5,
                //   marginVertical: 10,
                marginBottom: 0,
                //   marginTop:10
              }}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 20,
                  fontWeight: '600',
                  marginBottom: 0,
                }}>
                {' '}
                {userData.username}{' '}
              </Text>
              <Text style={{color: '#fff'}}>
                {' '}
                {userData.countryKey + ' ' + userData.phoneNumber}{' '}
              </Text>
            </View>

            {/* <TouchableOpacity
          onPress={()=>{navigation.navigate("EditProfile")}}
          style={styles.btnEdit}>
            <Text
              style={{
                color: 'rgba(78, 116, 289, 1)',
              }}>
              {' '}
              تعديل{' '}
            </Text>
            <Icon
              name="user-edit"
              type="font-awesome-5"
              size={15}
              color="rgba(78, 116, 289, 1)"
            />
          </TouchableOpacity> */}
          </View>

          <View style={styles.bodySetting}>
            <SectionList
              sections={DATA}
              keyExtractor={(item, index) => item + index}
              renderItem={({item}) => <Item item={item} />}
              renderSectionHeader={({section: {title}}) => (
                <Text style={styles.header}>{title}</Text>
              )}
            />
          </View>
        </LinearGradient>
      </View>
      {/* <Modal visible={loadDeleteAcount} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0003',
          }}>
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Lottie
              ref={animationRef}
              source={require('../../assets/lottie/loading.json')}
              autoPlay
              style={{height: 100}}
            />
          </View>
        </View>
      </Modal> */}
    </>
  );
};

export default SettingHome;

const styles = StyleSheet.create({
  btnEdit: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 7,
    margin: 10,
    flexDirection: 'row-reverse',
    borderRadius: 10,
    paddingHorizontal: 10,
    elevation: 5,
  },
  bodySetting: {
    backgroundColor: '#fff',
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    overflow: 'hidden',
    // paddingTop: 30,
    //   height: '70%',
  },
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    marginHorizontal: 16,
  },
  item: {
    backgroundColor: '#fff',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#ddd',
    borderBottomWidth: 0.8,
    // marginVertical: 8
  },
  header: {
    fontSize: 20,
    backgroundColor: '#eef',
    padding: 10,
    color: '#333',
  },
  title: {
    fontSize: 16,
    color: colors.typograf,
  },
});
