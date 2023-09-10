import {StyleSheet, Text, View} from 'react-native';
import React , { useEffect } from 'react';
import Auth_Context from './src/Contexts/Auth_Context';
import { NavigationContainer } from '@react-navigation/native'
import StackRoot from './src/routes/StackRoot';
import Socket_context from './src/Contexts/Socket_context';
import LocalDataBase from './src/Contexts/LocalDataBase';
import Call_Context from './src/Contexts/Call_Context';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';


const App = () => {

  useEffect(() => {
    // const subscribe = notifee.onForegroundEvent(({ type, detail }) => {
    //   const { notification, pressAction,input } = detail;
  
    //   if (type === EventType.ACTION_PRESS && pressAction.id !="" ) {
    //      switch (pressAction?.id) {
    //       case "reply":
    //         if (detail?.notification?.data) {
    //           // sendMessage(input,detail?.notification?.data)
    //           console.log(input,detail?.notification?.data,"<><>".repeat(100));
    //         }
    //         break;
         
    //       default:
    //         break;
    //      }
    //     }
        
  
    //   });
  
    return () => {
      // subscribe()
    }
  }, [])

  return (
    
    <NavigationContainer>

            <LocalDataBase>
      
              <Auth_Context>
      
                <Socket_context>

                  {/* <Call_Context> */}

                    <StackRoot />

                  {/* </Call_Context> */}
      
                </Socket_context>
      
              </Auth_Context>
      
          </LocalDataBase>
          
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({});
