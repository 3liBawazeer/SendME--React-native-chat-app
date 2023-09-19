import {StyleSheet, Text, View} from 'react-native';
import React , { useEffect } from 'react';
import Auth_Context from './src/Contexts/Auth_Context';
import { NavigationContainer } from '@react-navigation/native'
import StackRoot from './src/routes/StackRoot';
import Socket_context from './src/Contexts/Socket_context';
import LocalDataBase from './src/Contexts/LocalDataBase';
import Call_Context from './src/Contexts/Call_Context';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { MenuProvider } from 'react-native-popup-menu';
import messaging from '@react-native-firebase/messaging';
import Toast from 'react-native-toast-message';
const App = () => {

  useEffect(() => {
    return () => {
    }
  }, [])

  return (<>
    <MenuProvider>
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
    </MenuProvider>
    <Toast/>
  </>);
};

export default App;

const styles = StyleSheet.create({});
