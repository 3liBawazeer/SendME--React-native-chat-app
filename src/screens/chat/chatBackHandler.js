import { useEffect } from "react";
import { BackHandler } from "react-native";

export const chatBackHandler = (selecetedMessages,setselecetedMessages) => { 
    useEffect(() => {
        const backAction = () => {
            console.log(selecetedMessages);
          if (selecetedMessages.length == 0) {
            return false
          } else {
            setselecetedMessages([])
          }
         return true;
           // تمنع الانتقال إلى الشاشة السابقة
        };
    
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    
        return () => backHandler.remove();
      }, [selecetedMessages]);
 }