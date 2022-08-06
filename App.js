import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Auth_Context from './src/Contexts/Auth_Context';
import { NavigationContainer } from '@react-navigation/native'
import StackRoot from './src/routes/StackRoot';
import Socket_context from './src/Contexts/Socket_context';
import LocalDataBase from './src/Contexts/LocalDataBase';

const App = () => {
  return (
    
    <NavigationContainer>

            <LocalDataBase>
      
              <Auth_Context>
      
              <Socket_context>
      
                  <StackRoot />
      
              </Socket_context>
      
              </Auth_Context>
      
          </LocalDataBase>
    </
    NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({});
