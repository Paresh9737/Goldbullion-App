import React, {useContext} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {NavigationContext} from './NavigationContext';
import {Colors} from '../theme/Colors';
import HomeScreen from '../screens/HomeScreen';
import CoinRate from '../screens/CoinRate';
import UpdateScreen from '../screens/UpdateScreen';
import BankDetails from '../screens/BankDetails';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import KysScreen from '../screens/KysScreen';
import ContactUs from '../screens/ContactUs';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {FontSizes} from '../theme/FontSizes';
import {Fonts} from '../assets/Fonts';
import TradeScreen from '../screens/TradeScreen';

type ScreenParamList = {
  HomeScreen: undefined;
  CoinRate: undefined;
  TradeScreen: undefined;
  UpdateScreen: undefined;
  BankDetails: undefined;
};

const Tab = createBottomTabNavigator<ScreenParamList>();

interface TabBarIconProps {
  focused: boolean;
  color: string;
  size: number;
  iconSource: any;
  label: string;
  onPress: () => void;
}

const TabBarIcon: React.FC<TabBarIconProps> = ({
  focused,
  iconSource,
  label,
  onPress,
}) => (
  <TouchableOpacity
    style={[
      styles.tabButton,
      {
        backgroundColor: focused ? Colors.primaryColor1 : Colors.primaryColor,
      },
    ]}
    onPress={onPress}>
    <Image
      style={[
        styles.tabIcon,
        {tintColor: focused ? Colors.black : Colors.white},
      ]}
      source={iconSource}
      resizeMode="contain"
    />
    <Text
      style={[styles.tabLabel, {color: focused ? Colors.black : Colors.white}]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const BottomNavigator: React.FC = () => {
  const context = useContext(NavigationContext);
  const navigation = useNavigation<NavigationProp<ScreenParamList>>();

  if (!context) {
    return null; // Or a fallback UI
  }

  const {setCurrentScreen} = context;

  const handleTabPress = (
    screenIndex: number,
    screenName: keyof ScreenParamList,
  ) => {
    setCurrentScreen(screenIndex);
    navigation.navigate(screenName);
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}>
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <TabBarIcon
              focused={focused}
              iconSource={require('../assets/png/liverateicon.png')}
              label="LIVE RATE"
              onPress={() => handleTabPress(0, 'HomeScreen')}
              color=""
              size={0}
            />
          ),
        }}
      />
      <Tab.Screen
        name="CoinRate"
        component={CoinRate}
        options={{
          tabBarIcon: ({focused}) => (
            <TabBarIcon
              focused={focused}
              iconSource={require('../assets/png/coinrate.png')}
              label="COIN RATE"
              onPress={() => handleTabPress(1, 'CoinRate')}
              color=""
              size={0}
            />
          ),
        }}
      />
      <Tab.Screen
        name="TradeScreen"
        component={TradeScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <TabBarIcon
              focused={focused}
              iconSource={require('../assets/png/trade.png')}
              label="TRADE"
              onPress={() => handleTabPress(2, 'TradeScreen')}
              color=""
              size={0}
            />
          ),
        }}
      />
      <Tab.Screen
        name="UpdateScreen"
        component={UpdateScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <TabBarIcon
              focused={focused}
              iconSource={require('../assets/png/upadeticon.png')}
              label="UPDATE"
              onPress={() => handleTabPress(3, 'UpdateScreen')}
              color=""
              size={0}
            />
          ),
        }}
      />
      <Tab.Screen
        name="BankDetails"
        component={BankDetails}
        options={{
          tabBarIcon: ({focused}) => (
            <TabBarIcon
              focused={focused}
              iconSource={require('../assets/png/bankicon.png')}
              label="BANK DETAIL"
              onPress={() => handleTabPress(4, 'BankDetails')}
              color=""
              size={0}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabButton: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: 10,
    width: '100%',
  },
  tabIcon: {
    width: responsiveScreenWidth(7),
    height: responsiveScreenHeight(2.5),
  },
  tabLabel: {
    fontSize: responsiveScreenFontSize(1.3),
    marginTop: responsiveScreenHeight(0.5),
    fontFamily: Fonts.Medium,
  },
});

export default BottomNavigator;
