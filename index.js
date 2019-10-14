/**
 * @format
 */

import {AppRegistry, YellowBox} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

YellowBox.ignoreWarnings(['Warning: Each', 'Warning: Failed', 'Warning: componentWillReceiveProps']);
console.ignoredYellowBox = ['Warning: Each', 'Warning: Failed', 'Warning: componentWillReceiveProps'];
AppRegistry.registerComponent(appName, () => App);
