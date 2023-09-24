import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { socketIo, useSocket }  from "../Contexts/Socket_context";

export const useMessagesRemovedOfflineChecker = () => { 
    const {netConnection} = useSocket();
    useEffect(()=>{
        getMessagesRemoved().then((data)=>{
            if (data.length != 0) {
                data.map((item)=>{
                    socketIo?.emit("delMessages",item,(res)=>{
                        if (res.isSent) {
                            console.log("send Messages Removed DONE 🎈🎈🎈🎈",item);
                            removeMessagesRemoved(item?.toId)
                        }
                    });
                })
            }
        })
    },[netConnection])
}

export const getMessagesRemoved = async toId => {
    try {
        const jsonValue = await AsyncStorage.getItem('messagesRemovedOffline');
        const parsedValue = jsonValue ? JSON.parse(jsonValue) : [];
        
        if (parsedValue.length >= 1) {
            return parsedValue
            // return parsedValue.filter(im => im?.toId == toId);
        } else {
            return [];
        }
    } catch (error) {
        console.log('Error retrieving data:', error);
    }
};

export const removeMessagesRemoved = async toId => {
    try {
        const jsonValue = await AsyncStorage.getItem('messagesRemovedOffline');
        const parsedValue = jsonValue ? JSON.parse(jsonValue) : [];
        const data = parsedValue.filter(im => im.toId !== toId);
        await AsyncStorage.setItem("messagesRemovedOffline",JSON.stringify(data))
    } catch (error) {
        console.log('Error removing data:', error);
    }
};

export const setMessagesRemoved = async (toId,newMessagesRemoved) => {
    try {
        // await AsyncStorage.removeItem('messagesRemovedOffline')
        const jsonValue = await AsyncStorage.getItem('messagesRemovedOffline');
        const parsedValue = jsonValue ? JSON.parse(jsonValue) : [];
        const data = parsedValue.filter(im => im.toId !== toId);
        data.push(newMessagesRemoved);
        await AsyncStorage.setItem("messagesRemovedOffline",JSON.stringify(data))
    } catch (error) {
        console.log('Error updating data:', error);
    }
};