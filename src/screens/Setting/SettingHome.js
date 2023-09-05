import {Icon} from '@rneui/base';
import {ListItem, Avatar} from '@rneui/themed';
import React, {useState, useRef, useEffect} from 'react';
import {TouchableOpacity, SectionList, Alert, Modal} from 'react-native';
import {StatusBar} from 'react-native';
import {View, StyleSheet, ScrollView, Image, Text} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useAuth} from '../../Contexts/Auth_Context';
import { useLocalDataBase } from '../../Contexts/LocalDataBase';
import { deleteAccount } from '../../Requists';
import Lottie from 'lottie-react-native';
const SettingHome = ({navigation}) => {

  let animationRef = useRef(null);

  useEffect(() => {
    animationRef.current?.play(30, 120);
    return () => {
      
    }
  }, []);


  const STATUSBAR_HEIGHT = StatusBar.currentHeight;
  const {saveloggedIn, userData, Token,logout} = useAuth();
  const {RemoveAllData} = useLocalDataBase();
  const [loadDeleteAcount, setloadDeleteAcount] = useState(false)


  const logOut = async () => { 
   await logout().then(()=>{
      RemoveAllData().then(()=>{
        navigation.replace("phone")
        console.log("logout and delete data succefluy");
      })
    })
   }

   const DelAccount = (id) => { 
    setloadDeleteAcount(true)
     if (id) {
      const dara = {id:id,token:Token}

       deleteAccount(dara).then(()=>{

        logOut().then(()=>{

          console.log("لقد تم حذف الحساب بنجاح");
          setloadDeleteAcount(false)

        }).catch((err)=>console.log(err))

       }).catch((err)=>{
        console.log(err)
        setloadDeleteAcount(false)
        Alert.alert("حدث خطأ أثناْ حذف الحساب")
       })
     }else{
      setloadDeleteAcount(false)
      Alert.alert("حدث خطأ أثناْ حذف الحساب")
     }
    }

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
    // {
    //   title: 'الإعدادات',
    //   data: [
    //     {
    //       title: 'الملف الشخصي',
    //       iconName: 'ios-american-football',
    //       iconType: 'ionicon',
    //     },
    //     {
    //       title: 'الصفحه الرئيسيه',
    //       iconName: 'ios-american-football',
    //       iconType: 'ionicon',
    //     },
    //     {
    //       title: 'الديكور',
    //       iconName: 'ios-american-football',
    //       iconType: 'ionicon',
    //     },
    //   ],
    // },





    // this is the last setting 
    {
        title: 'إعدادت الحساب',
        data: [
            {
                title: 'الملف الشخصي',
                iconName: 'person',
                iconType: 'fontisto',
                onPress:()=>{navigation.navigate("EditProfile")}
              },
          {
            title: 'تسجيل الخروج',
            iconName: 'log-out',
            iconType: 'feather',
            onPress:()=>{Alert.alert("تنبيه !","هل تريد تسجيل الخروج؟ سيتم حذف جميع الدردشات والرسائل!",
            [
              {text:"نعم",onPress:()=>logOut()},
              {text:"تراجع"}
            ])}
          },
          {
            title: 'حذف الحساب',
            iconName: 'deleteuser',
            iconType: 'ant-design',
            onPress:()=>{Alert.alert("تنبيه !","هل تريد حذف هذا الحساب نهائياً!؟!",
            [
              {text:"نعم",onPress:()=>DelAccount(userData._id)},
              {text:"تراجع"}
            ])}
          },
        ],
      },
  ];


  const editProfile = async () => {
    setloading(true);
    setuploadLoading(true)
    try {
      // save image in firebase storage
      const reference = storage().ref(
        `usersImgaes/${userData.phoneNumber}-profile.png`,
      );
      await reference.putFile(ImageSelected);

    //   get uri image from firebase storage
    const image = await storage().ref(`usersImgaes/${userData.phoneNumber}-profile.png`).getDownloadURL();
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

  const Item = ({item}) => (        
    <TouchableOpacity onPress={item.onPress} style={styles.item}>
      <Icon
        name={item.iconName}
        type={item.iconType}
        color="#517fa4"
        style={{padding: 5, marginHorizontal: 10,width:45,alignItems:"center",justifyContent:'center'}}
      />
      <Text style={styles.title}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (<>
    <View style={{flex: 1, backgroundColor: '#eff'}}>
      <LinearGradient
        colors={['#5B70F7', '#7F8CE9']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}>
        <View
          style={{
            paddingTop: STATUSBAR_HEIGHT + 10,
            alignItems: 'center',
            flexDirection:"row",
            padding:10,
            paddingBottom:10
          }}>
          <Image
            source={
              userData.image == 'image-user.png'
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
              backgroundColor: '#fff2',
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
            <Text style={{color: '#fff', fontSize: 20,fontWeight:'600',marginBottom:0}}>
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
    <Modal visible={loadDeleteAcount} transparent animationType='fade' >
      <View 
        style={{
          flex:1,
          alignItems:"center",
          justifyContent:'center',
          backgroundColor:"#0003"
        }} >

          <View style={{backgroundColor:"#fff",borderRadius:10, alignItems:"center",
          justifyContent:'center',}} >
             
            <Lottie
                  ref={animationRef}
                  source={require('../../assets/lottie/loading.json')}
                  autoPlay
                  style={{height: 100}}
                />


          </View>

      </View>
    </Modal>
    </>);
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
    color: '#005',
  },
});