export const BACK_END_URL = "http://192.168.43.240:3443";
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

export const getAllUsers = (token) => { 
        const fun = new Promise((resolve,rej)=>{
            axios.get(BACK_END_URL + "/persons/all-users",{
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