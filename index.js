/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import notifee, { AndroidImportance } from '@notifee/react-native';

import messaging from '@react-native-firebase/messaging';

messaging().setBackgroundMessageHandler(async remoteMessage => {
	// console.log('Message handled in the background!', remoteMessage);
  });
AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', async (e) => {
	
});

notifee.onBackgroundEvent(async ({ type, detail }) => {
 
});

// notifee.registerForegroundService( notification => {
// 	return new Promise( () => {
// 	} );
// } );

AppRegistry.registerComponent(appName, () => App);
