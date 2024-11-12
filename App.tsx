import React from 'react';
import {NavigationProvider} from './src/navigator/NavigationContext';
import {AuthProvider} from './src/navigator/contaxt/AuthContaxt';
import AppNav from './src/navigator/contaxt/AppNav';
import {StatusBar} from 'react-native';

const App: React.FC = () => {
  return (
    <>
      <StatusBar
        backgroundColor="#610004"
        // translucent={true}
        barStyle="light-content"
      />
      <AuthProvider>
        <NavigationProvider>
          <AppNav />
        </NavigationProvider>
      </AuthProvider>
    </>
  );
};

export default App;
