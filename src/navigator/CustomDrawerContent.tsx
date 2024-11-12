import React, {useContext} from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import {NavigationContext} from './NavigationContext';
import {Colors} from '../theme/Colors';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {FontSizes} from '../theme/FontSizes';
import {Fonts} from '../assets/Fonts';

interface DrawerItem {
  label: string;
  screenName: string;
  Icon: ImageSourcePropType;
}

const drawerItems: DrawerItem[] = [
  {
    label: 'Live Rate',
    screenName: 'HomeScreen',
    Icon: require('../assets/png/liverateicon.png'),
  },
  {
    label: 'Coin Rate',
    screenName: 'CoinRate',
    Icon: require('../assets/png/coinrate.png'),
  },
  {
    label: 'Trade',
    screenName: 'TradeScreen',
    Icon: require('../assets/png/trade.png'),
  },
  {
    label: 'Update',
    screenName: 'UpdateScreen',
    Icon: require('../assets/png/upadeticon.png'),
  },
  {
    label: 'Bank Detail',
    screenName: 'BankDetails',
    Icon: require('../assets/png/bankicon.png'),
  },
  {
    label: 'Economic Calendar',
    screenName: 'EconomicCalendar',
    Icon: require('../assets/png/economicicom.png'),
  },
  {
    label: 'KYC',
    screenName: 'KYC',
    Icon: require('../assets/png/kycii.png'),
  },

  {
    label: 'About Us',
    screenName: 'AboutUs',
    Icon: require('../assets/png/aboutusicon.png'),
  },
  {
    label: 'Contact Us',
    screenName: 'ContactUs',
    Icon: require('../assets/png/contackusicon.png'),
  },

  {
    label: 'My Profile',
    screenName: 'Logout',
    Icon: require('../assets/png/profileicon.png'),
  },
];

const CustomDrawerContent: React.FC<DrawerContentComponentProps> = ({
  navigation,
}) => {
  const context = useContext(NavigationContext);

  if (!context) {
    return null;
  }

  const {currentScreen, setCurrentScreen} = context;

  const getBackgroundColor = (index: number) =>
    currentScreen === index ? Colors.primaryColor1 : Colors.white;

  const getTextColor = (index: number) =>
    currentScreen === index ? Colors.white : Colors.black;

  return (
    <DrawerContentScrollView
      style={styles.container}
      nestedScrollEnabled={true}>
      <View style={styles.Logocontainer}>
        <Image style={styles.logo} source={require('../assets/png/logo.png')} />
      </View>

      {drawerItems.map((item, index) => (
        <TouchableOpacity
          key={item.screenName}
          onPress={() => {
            setCurrentScreen(index);
            navigation.navigate(item.screenName);
          }}
          style={[
            styles.touchableOpacityButton,
            {backgroundColor: getBackgroundColor(index)},
          ]}>
          <Image
            style={[styles.IconListItem, {tintColor: getTextColor(index)}]}
            source={item.Icon}
          />
          <Text style={[styles.text, {color: getTextColor(index)}]}>
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  touchableOpacityButton: {
    padding: responsiveScreenHeight(1),
    marginVertical: responsiveScreenHeight(0.5),
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: responsiveScreenHeight(1),
  },
  text: {
    fontSize: FontSizes.medium,
    fontFamily: Fonts.Medium,
    paddingLeft: responsiveScreenHeight(2),
  },
  Logocontainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: responsiveScreenHeight(2),
    backgroundColor: Colors.primaryColor,
  },
  logo: {
    // resizeMode: 'contain',
    height: responsiveScreenHeight(12),
    width: responsiveScreenWidth(25),
  },
  IconListItem: {
    height: responsiveScreenHeight(2.3),
    width: responsiveScreenWidth(5.2),
  },
});

export default CustomDrawerContent;
