import {StyleSheet, Text, View} from 'react-native';
import React , { useEffect } from 'react';
import Auth_Context from './src/Contexts/Auth_Context';
import { NavigationContainer } from '@react-navigation/native'
import StackRoot from './src/routes/StackRoot';
import Socket_context from './src/Contexts/Socket_context';
import LocalDataBase from './src/Contexts/LocalDataBase';
import Call_Context from './src/Contexts/Call_Context';
import notifee, { AndroidImportance } from '@notifee/react-native';


const App = () => {

  // useEffect(() => {
  //   fourground()
  // }, [])

  // const fourground = async () => { 
  //   try {
  //     const channelId = await notifee.createChannel( {
  //       id: 'screen_capture',
  //       name: 'Screen Capture',
  //       lights: true,
  //       vibration: false,
  //       importance: AndroidImportance.DEFAULT
  //     } );
    
  //     await notifee.displayNotification({
  //       // title: 'دردشه',
  //       // body: '',
  //       android: {
  //         channelId,
  //         asForegroundService: true
  //       }
  //     } );
  //   } catch( err ) {
  //     // Handle Error
  //   };
  //  }

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
