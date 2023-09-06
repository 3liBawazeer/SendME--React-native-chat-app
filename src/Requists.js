export const BACK_END_URL = "http://192.168.1.102:5001";
import axios from "axios";

    export const signUp = (data) => { 
        const fun = new Promise((resolve,rej)=>{
            axios.post(BACK_END_URL + "/auth/signUp",data).then((res)=>{
                resolve(res)
            }).catch((err)=>{rej(err);})
        })
    return fun;
    }

    export const signIn = (data) => { 
    const fun = new Promise((resolve,rej)=>{
    axios.post(BACK_END_URL + "/auth/login",data).then((res)=>{
        resolve(res)
    }).catch((err)=>rej(err))
    })
    return fun;
    }

    export const getMyContactsInSendMe = (token,data) => { 
        const fun = new Promise((resolve,rej)=>{
            axios.post(BACK_END_URL + "/persons/all-users",{contact:data},{
                headers: {
                    'auth_token_jwt': token ,
                    'Accept' : 'application/json',
                    'Content-Type': 'application/json'
                    }
            }).then((res)=>{
                resolve(res)
            }).catch((err)=>rej(err))
        })
       return fun;
     }

     export const getandCreateChat = (data,token) => { 
        const fun = new Promise((resolve,rej)=>{
            axios.post(BACK_END_URL + "/chat/getandCreateChat",data,{
                headers: {
                    'auth_token_jwt': token ,
                    'Accept' : 'application/json',
                    'Content-Type': 'application/json'
                    }
            }).then((res)=>{
                resolve(res)
            }).catch((err)=>rej(err))
        })
       return fun;
     }

     export const editProfile = (data,token) => { 
        const fun = new Promise((resolve,rej)=>{
            axios.post(BACK_END_URL + "/auth/editProfile",data,{
                headers: {
                    'auth_token_jwt': token ,
                    'Accept' : 'application/json',
                    'Content-Type': 'application/json'
                    }
            }).then((res)=>{
                resolve(res)
            }).catch((err)=>rej(err))
        })
       return fun;
     }

     export const deleteAccount = (data) => { 
        const fun = new Promise((resolve,rej)=>{
            axios.post(BACK_END_URL + "/persons/deleteAccount",{id:data.id},{
                headers: {
                    'auth_token_jwt': data.token ,
                    'Accept' : 'application/json',
                    'Content-Type': 'application/json'
                    }
            }).then((res)=>{
                resolve(res)
            }).catch((err)=>rej(err))
        })
       return fun;
     }