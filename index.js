/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import notifee, { AndroidImportance } from '@notifee/react-native';



AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => {
	console.log("fuck you".toUpperCase());
});

notifee.onBackgroundEvent(async ({ type, detail }) => {
 
});

notifee.registerForegroundService( notification => {
	return new Promise( () => {
	} );
} );

AppRegistry.registerComponent(appName, () => App);
