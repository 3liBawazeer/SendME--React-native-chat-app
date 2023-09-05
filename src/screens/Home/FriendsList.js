import {
  Text,
  StyleSheet,
  View,
  Platform,
  PermissionsAndroid,
  TouchableOpacity,
  FlatList,
  Button,
  Image,
  StatusBar,
  Linking,
  Animated,
  Easing,
  Keyboard,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {useAuth} from '../../Contexts/Auth_Context';
import Contacts from 'react-native-contacts';
import {getAllUsers, sendFriendReq} from '../../Requists';
import {Modal} from 'react-native';
import {Icon, SearchBar, Avatar} from '@rneui/themed';
import LinearGradient from 'react-native-linear-gradient';
import Lottie from 'lottie-react-native';
import Input from '../../components/Input';
import Btn from '../../components/Btn';
import {useLocalDataBase} from '../../Contexts/LocalDataBase';

const FriendsList = ({navigation}) => {

  const {contactsLive, contactsNotReg,saveContactsLive,saveContactsNotReg} = useLocalDataBase();

  let animationRef = useRef(null);
  

  useEffect(() => {
    //  && contactsNotReg.length == 0
    if (contactsLive.length == 0) {
      getContact()
    }
  }, []);

  useEffect(() => {
    animationRef.current?.play(0, 240);
    
    return () => {
      setmyFriends([]);
      setcontactsSendMe([]);
      setcontacts([]);
      animationRef.current?.stop();
    };
  }, []);

  const {Token} = useAuth();

  const [loadingContacts, setloadingContacts] = useState(false);

  const [animatSearchBAr] = useState(new Animated.Value(-50));
  const [showSerch, setshowSerch] = useState(false);
  const animatSearch = event => {
    if (event) {
      console.log(' showSerch true');
      setshowSerch(true);
      Animated.timing(animatSearchBAr, {
        toValue: 0,
        duration: 800,
        useNativeDriver: false,
        easing: Easing.elastic(1),
      }).start();
    } else {
      setshowSerch(false);
      Keyboard.dismiss()
      Animated.timing(animatSearchBAr, {
        toValue: -50,
        duration: 800,
        useNativeDriver: false,
        easing: Easing.elastic(1),
      }).start();
    }
  };

  const [contacts, setcontacts] = useState([]);
  const [myFriends, setmyFriends] = useState([]);
  const [contactsSendMe, setcontactsSendMe] = useState([]);
  const [friendsNotRegister, setfriendsNotRegister] = useState([]);
  const [showMDLProfile, setshowMDLProfile] = useState(false);

  const getContact = async () => {
    setloadingContacts(true);
    if (Platform.OS === 'ios') {
      await Contacts.getAll().then(contacts => {
        setloadingContacts(false);
      });
    } else if (Platform.OS === 'android') {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: 'Contacts',
          message: 'This app would like to view your contacts.',
          buttonPositive: 'Please accept bare mortal',
        },
      ).then(() => {
        Contacts.getAll()
          .then(contacts => {
            setcontacts(contacts);
            if (Token) {
              const reContact = contacts.map((item, index) => {
                if (item.phoneNumbers.length > 0) {
                  const after = item?.phoneNumbers[0]?.number?.replace(
                    /\-|\)|\(|\s/gi,
                    '',
                  );
                  return {...item, phoneNumbers: after};
                }
              });

              getAllUsers(Token)
                .then(data => {
                  const users = data.data.res.users;

                  const all = reContact.map((item, index) => {
                    if (item) {
                      if (item?.phoneNumbers[0] == '+') {
                        const findFrined = users.find(
                          (im, ix) =>
                            item?.phoneNumbers ==
                            im.countryKey + im.phoneNumber,
                        );
                        if (findFrined) {
                          findFrined.username = item.displayName;
                        }
                        return findFrined;
                      } else {
                        const findFrined = users.find(
                          (im, ix) => item.phoneNumbers == im.phoneNumber,
                        );
                        if (findFrined) {
                          findFrined.username = item.displayName;
                        }
                        return findFrined;
                      }
                    }
                  });

                  const frindes = all.filter(item => {
                    if (item) {
                      return item;
                    }
                  });
                  const lastfilter = frindes.filter(
                    (item, index, inputArray) =>
                      inputArray.indexOf(item) == index,
                  );


                  saveContactsLive(lastfilter).then((res)=>{
                    console.log("save contacts succ");
                  })

                  setmyFriends(lastfilter);
                  setcontactsSendMe(lastfilter);
                  setloadingContacts(false);

                  // const allFreindNotReg = reContact.filter((item, index) => {
                  //   if (item?.phoneNumbers[0] == '+') {
                  //     return lastfilter.find(
                  //       ite =>
                  //         item?.phoneNumbers !==
                  //         ite.countryKey + ite.phoneNumber,
                  //     );
                  //   } else {
                  //     return lastfilter.find(
                  //       ite => item?.phoneNumbers !== ite.phoneNumber,
                  //     );
                  //   }
                  // });
                  // const fliterTrue = allFreindNotReg.filter(item => {
                  //   if (item) {
                  //     return item;
                  //   }
                  // });
                  // const lastfilterNotReg = fliterTrue.filter(
                  //   (item, index, inputArray) =>
                  //     inputArray.indexOf(item) == index,
                  // );
                  //  setfriendsNotRegister(lastfilterNotReg);
                  //  saveContactsNotReg(lastfilterNotReg)


                })
                .catch(err => {
                  console.log(err);
                  // setloadingContacts(false)loadingContacts(false);
              Alert.alert('خطأ', ' تأكد من إتصالك بالشبكة ');
                });
            }
          })
          .catch(e => {
            console.log(e);
            loadingContacts(false);
              Alert.alert('خطأ', ' تأكد من إتصالك بالشبكة ');
          });
      });
    }
  };

  const STATUSBAR_HEIGHT = StatusBar.currentHeight;

  const sendSMS = number => {
    const message = 'حمل تطبيق send me الآن ' + 'https://www.facebook.com';
    const operator = Platform.select({ios: '&', android: '?'});
    Linking.openURL(`sms:${number}${operator}body=${message}`);
  };

  const [search, setSearch] = useState('');

  const SearchBar = name => {
    // const serch = myFriends.filter((item,index)=> item.username.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
    //  console.log(serch);
    // setmyFriends(serch)
    let filtered = myFriends.filter(item => {
      const arr = name.split(' ');
      return arr.some(el =>
        item.username.toLowerCase().includes(el.toLowerCase()),
      );
    });
    setmyFriends(filtered);

    if (name.length == 0) {
      setmyFriends(contactsSendMe);
    }
  };
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <LinearGradient
        colors={['#5B70F7', '#7F8CE9']}
        start={{x: 0, y: 2}}
        end={{x: 0, y: 0}}
        style={{
          // borderRadius: 10,
          flexDirection: 'row',
          alignItems: 'center',
          borderTopRightRadius: 0,
          borderTopLeftRadius: 0,
          paddingVertical: 5,
          paddingTop: STATUSBAR_HEIGHT,
          zIndex:10,
        }}>
        <StatusBar translucent={true} backgroundColor={'transparent'} />

        <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
          <View>
            <Icon
              name="arrow-right"
              type="feather"
              size={20}
              color={'#fff'}
              onPress={() => navigation.goBack()}
              style={{paddingLeft: 8, paddingRight: 5, paddingVertical: 10}}
            />
          </View>

          <Text
            numberOfLines={1}
            style={{
              color: '#fff',
              fontSize: 16,
              paddingHorizontal: 5,
              fontWeight: 'bold',
              width: '70%',
              textAlign: 'left',
            }}>
            جهات الإتصال
          </Text>
        </View>

        <View style={{flexDirection: 'row', marginHorizontal: 5}}>
          {/* <Icon size={20} name='video-camera' type="font-awesome"  color={"#fff"} onPress={()=>{}} style={{padding:8,}} />
          <Icon size={20} name='phone' type="entypo" color={"#fff"} onPress={()=>{}} style={{padding:8,}} /> */}
          <Icon
            size={20}
            name={showSerch ? 'search-off' : 'search'}
            type="material"
            color={'#fff'}
            onPress={() => {
              animatSearch(!showSerch);
              // if (showSerch) {
                // focusINputRef.current.focus()
              // }else{
              //   focusINputRef.current.blur()
              // }
            }}
            style={{padding: 8}}
          />
          <Icon
            size={20}
            name="reload1"
            type="ant-design"
            color={'#fff'}
            onPress={() => {
              getContact();
            }}
            style={{
              padding: 8,
              // transform:[{rotate:"100deg"}]
            }}
          />
          <Icon
            size={20}
            name="dots-vertical"
            type="material-community"
            color={'#fff'}
            onPress={() => {}}
            style={{padding: 8}}
          />
        </View>
      </LinearGradient>

      <Animated.View
        style={{marginTop: animatSearchBAr, height: 50, zIndex: 1}}>
        <Input
          placeholder="البحث عن جهة إتصال"
          value={search}
          onChangeText={x =>{SearchBar(x);setSearch(x);}}
          bg={'#eef'}
          ic2
          focus={showSerch}
          blur={showSerch}
          icn2="search"
          focusAndBlur={showSerch}
          ict2="feather"
          onPressic2={() => {
            SearchBar();
          }}
        />
      </Animated.View>

      <Text
        style={{
          // borderBottomWidth: 1,
          borderColor: '#ddd',
          padding: 5,
          color: '#005',
          marginHorizontal: 20,
          marginTop: 10,
        }}>
        جهات إتصالك{' '}
      </Text>
      <FlatList
        // data={[...myFriends]}
        data={[...contactsLive]}
        onRefresh={() => getContact()}
        refreshing={loadingContacts}
        ListEmptyComponent={
          <View
            style={{
              flex: 0,
              margin: 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {/* {loadingContacts ? (
              <Lottie
                ref={animationRef}
                source={require('../../assets/lottie/loading.json')}
                autoPlay
                style={{height: 150}}
              />
            ) : ( */}
            <View>
              {/* <Icon name='contacts' type='ant-design' color={"#08d"} size={50} style={{}} /> */}
              <Text style={{color: '#004', fontSize: 18, fontWeight: '800'}}>
                {' '}
                لا توجد لديك اي جهة إتصال{' '}
              </Text>
            </View>
            {/* ) */}
            {/* } */}
          </View>
        }
        contentContainerStyle={{flex: contactsLive.length == 0 ? 1 : null}}
        keyExtractor={(_, x) => x.toString()}
        renderItem={({item, index}) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.list,
              {borderBottomWidth: index == myFriends.length - 1 ? 0 : 1},
            ]}
            onPress={() => {
              console.log(item);
              navigation.navigate('chat', {
                  checkChat: true,
                  newfriendData: item,
                });
            }}>
            <Avatar
              size={40}
              rounded
              icon={{name: 'user', type: 'ant-design'}}
              source={
                item?.image == 'image-user.png'
                  ? require('../../assets/images/user-image.png')
                  : {uri: item?.image}
              }
              containerStyle={{
                borderColor: '#fff',
                backgroundColor: '#974ECF',
                marginHorizontal: 10,
              }}
              // source={require("../../assets/images/defult.png")}
            />
            <View style={{alignItems: 'flex-start'}}>
              <Text style={{fontWeight: '700', fontSize: 16, color: '#08d'}}>
                {item.username}
              </Text>
              <Text>{item.phoneNumber}</Text>
            </View>
          </TouchableOpacity>
        )}
        // ListFooterComponent={
        //   !loadingContacts && (
        //     <View style={{margin: 0, marginTop: 10}}>
        //       {contactsNotReg.length > 0 && (
        //         <Text
        //           style={{
        //             borderColor: '#ddd',
        //             padding: 5,
        //             color: '#005',
        //             marginHorizontal: 20,
        //           }}>
        //           دعوة أصدقاء{' '}
        //         </Text>
        //       )}

        //       {contactsNotReg.map((item, index) => (
        //         <TouchableOpacity
        //           key={index}
        //           style={[styles.list, {justifyContent: 'space-between'}]}
        //           onPress={() => sendSMS(item?.phoneNumbers)}>
        //           <View style={{flexDirection: 'row', alignItems: 'center'}}>
        //             <Avatar
        //               size={40}
        //               rounded
        //               icon={{name: 'user', type: 'ant-design'}}
        //               source={require('../../assets/images/user-image.png')}
        //               containerStyle={{
        //                 borderColor: '#fff',
        //                 backgroundColor: '#974ECF',
        //                 marginHorizontal: 10,
        //               }}
        //               // source={require("../../assets/images/defult.png")}
        //             />

        //             <View
        //               style={{
        //                 alignItems: 'center',
        //                 justifyContent: 'space-between',
        //               }}>
        //               <View>
        //                 <Text
        //                   style={{
        //                     fontWeight: '700',
        //                     fontSize: 16,
        //                     color: '#007',
        //                   }}>
        //                   {item?.givenName + ' ' + item?.familyName}
        //                 </Text>
        //               </View>

        //               {/* <Text>
        //             {item?.phoneNumbers}
        //           </Text> */}
        //             </View>
        //           </View>

        //           <View
        //             style={{
        //               flexDirection: 'row',
        //               alignItems: 'center',
        //               justifyContent: 'center',
        //             }}>
        //             {/* <Icon name='user' type='feather' size={15}  color="#007"/> */}
        //             <Text style={{color: '#007', fontSize: 15}}> دعوه </Text>
        //           </View>
        //         </TouchableOpacity>
        //       ))}
        //     </View>
        //   )
        // }
      />

      {/* <ShowProfileMDl
        show={showMDLProfile}
        setshow={setshowMDLProfile}
        navigation={navigation}
      /> */}
    </View>
  );
};

export default FriendsList;

const styles = StyleSheet.create({
  list: {
    padding: 10,
    margin: 10,
    elevation: 0,
    borderRadius: 10,
    borderBottomWidth: 0.8,
    borderBottomColor: '#ddd',
    marginVertical: 0,
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor:"#08d"
  },
});

const ShowProfileMDl = ({show, setshow, navigation}) => {
  const nav = show;
  const {userData, Token} = useAuth();
  const [loadingSent, setloadingSent] = useState(false);

  const sendRequistFreind = () => {
    setloadingSent(true);

    if (nav.username && nav._id && userData.username && userData._id) {
      const data = {
        myId: userData._id,
        myName: userData.username,
        friendId: nav._id,
        friendName: nav.username,
      };
      sendFriendReq(data, Token)
        .then(() => {
          navigation.goBack();
        })
        .catch(err => console.log(err.response))
        .then(() => setloadingSent(false));
    }
  };

  return (
    <Modal visible={show ? true : false} animationType="slide" transparent>
      <View style={{flex: 1, justifyContent: 'flex-end'}}>
        <View
          style={{
            backgroundColor: '#fff',
            elevation: 50,
            shadowColor: '#000',
            margin: 20,
            borderRadius: 20,
          }}>
          <View style={{position: 'absolute', margin: 5}}>
            <Icon
              name="close"
              type="material"
              style={{padding: 5}}
              onPress={() => {
                setshow(false);
              }}
            />
          </View>
          <View style={{alignItems: 'center'}}>
            <View style={{marginVertical: 20}}>
              <Image
                source={
                  nav.image == 'image-user.png'
                    ? require('../../assets/images/user-image.png')
                    : {uri: nav.image}
                }
                style={{width: 150, height: 150, borderRadius: 100}}
              />
            </View>

            <View>
              <Text style={{color: '#333', fontSize: 25, fontWeight: '500'}}>
                {nav.username}
              </Text>
            </View>
          </View>

          <View style={{margin: 20, marginTop: -20}}>
            <Btn
              title="مراسله"
              onPress={() => {
                setshow(false);
                
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};
