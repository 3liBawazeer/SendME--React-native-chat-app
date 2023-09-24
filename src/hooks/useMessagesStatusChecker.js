import AsyncStorage from '@react-native-async-storage/async-storage';
import {useLayoutEffect} from 'react';
import { useLocalDataBase } from '../Contexts/LocalDataBase';
import {socketIo} from '../Contexts/Socket_context';

export const useMessagesStatusChecker = props => {
  const {friendId, chatId, AllMessages, userData, setmessages} = props;
  const {changeMessageStatus} = useLocalDataBase();

  useLayoutEffect(() => {
    const unsub = setTimeout(async () => {
      if (chatId && friendId) {
        const mesg = AllMessages.filter(item => item.chat == chatId);
        const messageNotRead = mesg
          .filter(ele => {
            const sender =
              ele?.isRead != '2' &&
              JSON?.parse(ele?.sender)?.id != userData?._id;
            return sender;
          })
          .map(ele => ele?.id);

          let allMessagesStatus = {
            messagesIds: [...messageNotRead],
            status: '2',
            toId: friendId,
          };

          const meesgaeStatusChangeOffline = await getMessagesStatusChangeOffLine(friendId);

         if (meesgaeStatusChangeOffline.length != 0) {
          allMessagesStatus.messagesIds = [...messageNotRead,...meesgaeStatusChangeOffline[0]?.messagesIds]
         }
         

        if (allMessagesStatus?.messagesIds?.length != 0) {
          changeMessageStatus(messageNotRead, '2')
          setMessagesStatusChangeOffLine(friendId,allMessagesStatus)
          socketIo?.emit('sendChangeMessageStatus', allMessagesStatus, (res) => {
            if (res.isSent) {
               removeMessagesStatusChangeOffLine(friendId).then(()=>{
                setmessages(o =>
                  o.map(ele => {
                    const find = messageNotRead.find(e => e == ele?.id);

                    if (find) {
                      return {...ele, isRead: '2'};
                    } else {
                      return ele;
                    }
                  }),
                );
               })
            }

          });
        }
      }
    }, 100);
    return () => clearTimeout(unsub);
  }, [chatId, friendId, AllMessages]);
};



const getMessagesStatusChangeOffLine = async toId => {
  try {
    const jsonValue = await AsyncStorage.getItem('messagesStatusChangedOffline');
    const parsedValue = jsonValue ? JSON.parse(jsonValue) : [];

    if (parsedValue.length >= 1) {
      return parsedValue.filter(im => im?.toId == toId);
    } else {
      return [];
    }
  } catch (error) {
    console.log('Error retrieving data:', error);
  }
};

const removeMessagesStatusChangeOffLine = async toId => {
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

const setMessagesStatusChangeOffLine = async (toId,newMessagesStatus) => {
  try {
    // await AsyncStorage.removeItem('messagesStatusChangedOffline')
    const jsonValue = await AsyncStorage.getItem('messagesStatusChangedOffline');
    const parsedValue = jsonValue ? JSON.parse(jsonValue) : [];
    const data = parsedValue.filter(im => im.toId !== toId);
    data.push(newMessagesStatus);
    await AsyncStorage.setItem("messagesStatusChangedOffline",JSON.stringify(data))
  } catch (error) {
    console.log('Error updating data:', error);
  }
};
