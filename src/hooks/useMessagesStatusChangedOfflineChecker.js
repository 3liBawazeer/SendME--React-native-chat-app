import AsyncStorage from '@react-native-async-storage/async-storage';
import {useLayoutEffect} from 'react';
import { socketIo, useSocket } from '../Contexts/Socket_context';


export const useMessagesStatusChangedOfflineChecker = props => {
    const {netConnection} = useSocket();
    useLayoutEffect(() => {
      const unsub = setTimeout(async () => {
  
            const meesgaeStatusChangeOffline = await getMessagesStatusChangeOffLine();
           if (meesgaeStatusChangeOffline.length != 0) {
                meesgaeStatusChangeOffline.map((item)=>{
                    console.log("This is => : ",item);
                    socketIo?.emit('sendChangeMessageStatus', item, (res) => {
                        if (res.isSent) {
                           removeMessagesStatusChangeOffLine(item?.toId)
                        }
                      });
                })
           }
           
      }, 100);
      return () => clearTimeout(unsub);
    }, [netConnection]);
  };


  
const getMessagesStatusChangeOffLine = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('messagesStatusChangedOffline');
      const parsedValue = jsonValue ? JSON.parse(jsonValue) : [];
      if (parsedValue.length >= 1) {
        return parsedValue
      } else {
        return [];
      }
    } catch (error) {
      console.log('Error retrieving data:', error);
    }
  };
  
  const removeMessagesStatusChangeOffLine = async (toId) => {
    try {
      console.log("MessagesStatusUnSend removed 👍👍👍");
      const jsonValue = await AsyncStorage.getItem('messagesStatusChangedOffline');
      const parsedValue = jsonValue ? JSON.parse(jsonValue) : [];
      const data = parsedValue.filter(im => im.toId !== toId);
      await AsyncStorage.setItem("messagesStatusChangedOffline",JSON.stringify(data))
    } catch (error) {
      console.log('Error removing data:', error);
    }
  };
