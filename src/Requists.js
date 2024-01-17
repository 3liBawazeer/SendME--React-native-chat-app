export const BACK_END_URL = "http://192.168.43.240:5001";
export const BACK_END_URL_DB = "http://192.168.43.240:5001";
// export const BACK_END_URL_DB = "https://sendmebackend8080.adaptable.app";
// export const BACK_END_URL = "https://sendme-oyhw.onrender.com";
import axios from "axios";
import Toast from 'react-native-toast-message';
import NetInfo from '@react-native-community/netinfo';

export const checkInternetConnection = async () => {
  try {
    const netInfoState = await NetInfo.fetch();
    if (netInfoState.isConnected) {
      console.log('متصل بالإنترنت');
    } else {
      console.log('غير متصل بالإنترنت');
    }
  } catch (error) {
    console.error('حدث خطأ أثناء التحقق من الاتصال بالإنترنت', error);
  }
};

    export const signUp = (data) => { 
        const fun = new Promise((resolve,rej)=>{
            axios.post(BACK_END_URL_DB + "/auth/signUp",data).then((res)=>{
                resolve(res)
            }).catch((err)=>{
                if (err.message == "Network Error") {
                    Toast.show({
                        type: 'error',
                        text1: 'غير متصل بلإنترنت',
                        text2: 'تأكد من إتصالك بل إنترنت',
                        visibilityTime:4000,
                      });
                   return rej({net:false,error:err.message})
                }else{
                    return rej({net:true,error:err.message})
                };
            })
        })
    return fun;
    }

    export const signIn = (data) => { 
    const fun = new Promise((resolve,rej)=>{
    axios.post(BACK_END_URL_DB + "/auth/login",data).then((res)=>{
        resolve(res)
    }).catch((err)=>{
        if (err.message == "Network Error") {
            Toast.show({
                type: 'error',
                text1: 'غير متصل بلإنترنت',
                text2: 'تأكد من إتصالك بل إنترنت',
                visibilityTime:4000,
              });
           return rej({net:false,error:err.message})
        }else{
            return rej({net:true,error:err.message})
        };
    })
    })
    return fun;
    }

    export const logoutReq = (token,data) => { 
        const fun = new Promise((resolve,rej)=>{
        axios.post(BACK_END_URL_DB + "/auth/logout",{phoneNumber:data},{
            headers: {
                'auth_token_jwt': token ,
                'Accept' : 'application/json',
                'Content-Type': 'application/json'
                }
        }).then((res)=>{
            resolve(res)
        }).catch((err)=>{
            if (err.message == "Network Error") {
                Toast.show({
                    type: 'error',
                    text1: 'غير متصل بلإنترنت',
                    text2: 'تأكد من إتصالك بل إنترنت',
                    visibilityTime:4000,
                  });
               return rej({net:false,error:err.message})
            }else{
                return rej({net:true,error:err.message})
            };
        })
        })
        return fun;
        }

    export const getMyContactsInSendMe = (token,data) => { 
        const fun = new Promise((resolve,rej)=>{
            axios.post(BACK_END_URL_DB + "/persons/all-users",{contact:data},{
                headers: {
                    'auth_token_jwt': token ,
                    'Accept' : 'application/json',
                    'Content-Type': 'application/json'
                    }
            }).then((res)=>{
                resolve(res)
            }).catch((err)=>{
                if (err.message == "Network Error") {
                    Toast.show({
                        type: 'error',
                        text1: 'غير متصل بلإنترنت',
                        text2: 'تأكد من إتصالك بل إنترنت',
                        visibilityTime:4000,
                      });
                   return rej({net:false,error:err.message})
                }else{
                    return rej({net:true,error:err.message})
                };
            })
        })
       return fun;
     }

     export const getandCreateChat = (data,token) => { 
        const fun = new Promise((resolve,rej)=>{
            axios.post(BACK_END_URL_DB + "/chat/getandCreateChat",data,{
                headers: {
                    'auth_token_jwt': token ,
                    'Accept' : 'application/json',
                    'Content-Type': 'application/json'
                    }
            }).then((res)=>{
                resolve(res)
            }).catch((err)=>{
                if (err.message == "Network Error") {
                    Toast.show({
                        type: 'error',
                        text1: 'غير متصل بلإنترنت',
                        text2: 'تأكد من إتصالك بل إنترنت',
                        visibilityTime:4000,
                      });
                   return rej({net:false,error:err.message})
                }else{
                    return rej({net:true,error:err.message})
                };
            })
        })
       return fun;
     }

     export const editProfile = (data,token) => { 
        const fun = new Promise((resolve,rej)=>{
            axios.post(BACK_END_URL_DB + "/auth/editProfile",data,{
                headers: {
                    'auth_token_jwt': token ,
                    'Accept' : 'application/json',
                    'Content-Type': 'application/json'
                    }
            }).then((res)=>{
                resolve(res)
            }).catch((err)=>{
                if (err.message == "Network Error") {
                    Toast.show({
                        type: 'error',
                        text1: 'غير متصل بلإنترنت',
                        text2: 'تأكد من إتصالك بل إنترنت',
                        visibilityTime:4000,
                      });
                   return rej({net:false,error:err.message})
                }else{
                    return rej({net:true,error:err.message})
                };
            })
        })
       return fun;
     }

     export const deleteAccount = (data) => { 
        const fun = new Promise((resolve,rej)=>{
            axios.post(BACK_END_URL_DB + "/persons/deleteAccount",{id:data.id},{
                headers: {
                    'auth_token_jwt': data.token ,
                    'Accept' : 'application/json',
                    'Content-Type': 'application/json'
                    }
            }).then((res)=>{
                resolve(res)
            }).catch((err)=>{
                if (err.message == "Network Error") {
                    Toast.show({
                        type: 'error',
                        text1: 'غير متصل بلإنترنت',
                        text2: 'تأكد من إتصالك بل إنترنت',
                        visibilityTime:4000,
                      });
                   return rej({net:false,error:err.message})
                }else{
                    return rej({net:true,error:err.message})
                };
            })
        })
       return fun;
     }

     export const getUnReadMessages = (data) => { 
        const fun = new Promise((resolve,rej)=>{
            axios.post(BACK_END_URL_DB + "/chat/getUnReadMessages",{userId:data.id},{
                headers: {
                    'auth_token_jwt': data.token ,
                    'Accept' : 'application/json',
                    'Content-Type': 'application/json'
                    }
            }).then((res)=>{
                resolve(res)
            }).catch((err)=>{
                if (err.message == "Network Error") {
                    // Toast.show({
                    //     type: 'error',
                    //     text1: 'غير متصل بلإنترنت',
                    //     text2: 'تأكد من إتصالك بل إنترنت',
                    //     visibilityTime:4000,
                    //   });
                   return rej({net:false,error:err.message})
                }else{
                    return rej({net:true,error:err})
                };
            })
        })
       return fun;
     }