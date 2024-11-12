import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Colors} from '../theme/Colors';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {Svg} from '../helper/SvgProvider';
import {useNavigation} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {DrawerParamList} from '../navigator/DrawerNavigater';
import TextTicker from 'react-native-text-ticker';
import {FontSizes} from '../theme/FontSizes';
import {Fonts} from '../assets/Fonts';

const CustomHeader: React.FC = () => {
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();
  const [currentDateTime, setCurrentDateTime] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const formattedDateTime = now.toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      setCurrentDateTime(formattedDateTime);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const openDrawer = () => {
    navigation.toggleDrawer();
  };

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={openDrawer}>
          <Svg.TreeLinemenu
            height={responsiveScreenHeight(6)}
            width={responsiveScreenWidth(8)}
          />
        </TouchableOpacity>

        <Image
          style={styles.logo}
          resizeMode="cover"
          source={require('../assets/png/logo.png')}
        />
        <Text>{''}</Text>
      </View>
      <TextTicker
        style={styles.ticker}
        duration={10000}
        loop
        bounce={false}
        repeatSpacer={0}
        marqueeDelay={0}
        // isRTL={true}
      >
        Welcome to Goldmine - We shall be giving all Prices inclusive of 3% GST
        only at {currentDateTime}
      </TextTicker>
    </>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primaryColor,
    // height: responsiveScreenHeight(10),
    paddingHorizontal: responsiveScreenHeight(1),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: responsiveScreenHeight(1),
  },
  logo: {
    height: responsiveScreenHeight(5),
    width: responsiveScreenWidth(10),
    resizeMode: 'contain',
  },
  ticker: {
    backgroundColor: Colors.primaryColor1,
    fontSize: FontSizes.medium,
    fontFamily: Fonts.Bold,
    color: Colors.black,
    paddingVertical: responsiveScreenHeight(0.1),
    paddingLeft: responsiveScreenHeight(50),
  },
});
