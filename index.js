/**
 * @format
 */
import 'react-native-gesture-handler';
import {Appearance, AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';
import {store} from './src/redux/store';
Appearance.setColorScheme('light');
const Root = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

export default Root;

AppRegistry.registerComponent(appName, () => Root);
