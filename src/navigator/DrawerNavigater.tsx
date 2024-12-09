import React, {useEffect, useState} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import ProfileScreen from '../screens/ProfileScreen';
import BottomNavigater from './BottomNavigater';
import ContactUs from '../screens/ContactUs';
import CustomDrawerContent from './CustomDrawerContent';
import CustomHeader from '../screens/CustomHeader';
import AboutUs from '../screens/AboutUs';
import EconomicScreen from '../screens/EconomicScreen';
import KysScreen from '../screens/KysScreen';
import NetInfo from '@react-native-community/netinfo';
import CheckInternet from '../screens/CheckInternet';
import OtpVeriftProfileScreen from '../screens/OtpVeriftProfileScreen';
import ProfileMobileVerifyScreen from '../screens/AuthScreen/ProfileMobileVerifyScreen';

export type DrawerParamList = {
  Home: undefined;
  EconomicCalendar: undefined;
  KYC: undefined;
  AboutUs: undefined;
  ContactUs: undefined;
  Logout: undefined;
  OtpVeriftProfileScreen: {
    contact: string;
  };
  ProfileMobileVerifyScreen: {
    contact: string;
  };
};

const Drawer = createDrawerNavigator<DrawerParamList>();

const DrawerNavigator: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean>(true);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? false);
    });

    // Check initial connection state
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected ?? false);
    });

    return () => {
      unsubscribe();
    };
  }, []);
  return (
    <>
      {isConnected ? (
        <Drawer.Navigator
          screenOptions={{
            header: props => <CustomHeader />,
          }}
          drawerContent={props => <CustomDrawerContent {...props} />}>
          <Drawer.Screen name="Home" component={BottomNavigater} />

          <Drawer.Screen name="EconomicCalendar" component={EconomicScreen} />
          <Drawer.Screen name="KYC" component={KysScreen} />
          <Drawer.Screen name="AboutUs" component={AboutUs} />
          <Drawer.Screen name="ContactUs" component={ContactUs} />
          <Drawer.Screen
            name="Logout"
            component={ProfileScreen}></Drawer.Screen>
          <Drawer.Screen
            name="OtpVeriftProfileScreen"
            component={OtpVeriftProfileScreen}
            options={{
              headerShown: false,
            }}
          />
          <Drawer.Screen
            name="ProfileMobileVerifyScreen"
            component={ProfileMobileVerifyScreen}
            options={{
              headerShown: false,
            }}
          />
        </Drawer.Navigator>
      ) : (
        <CheckInternet setIsConnected={setIsConnected} />
      )}
    </>
  );
};

export default DrawerNavigator;
