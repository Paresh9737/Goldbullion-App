import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {Colors} from '../theme/Colors';
import {FontSizes} from '../theme/FontSizes';
import {Fonts} from '../assets/Fonts';

interface CheckInternetProps {
  setIsConnected: React.Dispatch<React.SetStateAction<boolean>>;
}

const CheckInternet: React.FC<CheckInternetProps> = ({setIsConnected}) => {
  const checkConnection = () => {
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected ?? false);
    });
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.img}
        source={require('../assets/png/nointernet.png')}
      />
      <Text style={styles.text}>No Internet Connection</Text>
    </View>
  );
};

export default CheckInternet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    height: responsiveScreenHeight(20),
    width: responsiveScreenWidth(40),
    resizeMode: 'cover',
  },
  text: {
    color: Colors.red,
    marginVertical: responsiveScreenHeight(5),
    fontSize: FontSizes.large,
    fontFamily: Fonts.Medium,
  },
});
