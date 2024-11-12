import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useRef} from 'react';
import {Colors} from '../theme/Colors';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {FontSizes} from '../theme/FontSizes';
import {Fonts} from '../assets/Fonts';
import {useFocusEffect} from '@react-navigation/native';

const BankDetails = () => {
  const scrollViewRef = useRef<ScrollView>(null);

  useFocusEffect(
    React.useCallback(() => {
      // Scroll to top when the screen comes into focus
      scrollViewRef.current?.scrollTo({y: 0, animated: true});
    }, []),
  );

  return (
    <ScrollView ref={scrollViewRef} style={styles.container}>
      <View style={styles.ImageBackgroundcontainer}>
        <Image
          style={styles.img}
          source={require('../assets/img/bank-detail.png')}
        />
      </View>
      <Text style={styles.BanckDetailText}>BANK DETAIL</Text>
      <Image
        style={[styles.img2]}
        source={require('../assets/img/images-removebg-preview.png')}
      />
      <View style={styles.ImageBackgroundcontainer}>
        <Image style={styles.img} source={require('../assets/img/hdfc.png')} />
      </View>
      {/* containerBank one  */}

      <View style={styles.containerBank}>
        <View style={styles.row}>
          <Text style={styles.label}>BANK NAME</Text>
          <Text style={styles.separator}>::</Text>
          <Text style={styles.value}>HDFC</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>ACCOUNT NAME</Text>
          <Text style={styles.separator}>::</Text>
          <Text style={styles.value}>Goldmine</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>ACCOUNT NUMBER</Text>
          <Text style={styles.separator}>::</Text>
          <Text style={styles.value}>0123654789</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>IFSC CODE</Text>
          <Text style={styles.separator}>::</Text>
          <Text style={styles.value}>HDFC000</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>BRANCH NAME</Text>
          <Text style={styles.separator}>::</Text>
          <Text style={styles.value}>Ahmedabad</Text>
        </View>
      </View>
      {/* containerBank second  */}
      <View style={styles.ImageBackgroundcontainer}>
        <Image style={styles.img} source={require('../assets/img/hdfc.png')} />
      </View>

      <View style={styles.containerBank}>
        <View style={styles.row}>
          <Text style={styles.label}>BANK NAME</Text>
          <Text style={styles.separator}>::</Text>
          <Text style={styles.value}>HDFCBANK</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>ACCOUNT NAME</Text>
          <Text style={styles.separator}>::</Text>
          <Text style={styles.value}>GOLDMINE COMMODITELS PVT LTD</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>ACCOUNT NUMBER</Text>
          <Text style={styles.separator}>::</Text>
          <Text style={styles.value}>00060340004694</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>IFSC CODE</Text>
          <Text style={styles.separator}>::</Text>
          <Text style={styles.value}>HDFC0000006</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>BRANCH NAME</Text>
          <Text style={styles.separator}>::</Text>
          <Text style={styles.value}>Navrangpura</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default BankDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgn,
  },
  ImageBackgroundcontainer: {},
  img: {
    height: responsiveScreenHeight(10),
    width: '100%',
  },
  BanckDetailText: {
    fontSize: FontSizes.large1,
    fontFamily: Fonts.ExtraBold,
    color: Colors.primaryColor,
    textAlign: 'center',
    paddingVertical: responsiveScreenHeight(1),
  },
  containerBank: {
    padding: responsiveScreenHeight(1),
    backgroundColor: Colors.primaryColor,
    marginVertical: responsiveScreenHeight(0.7),
  },
  row: {
    flexDirection: 'row',
    marginBottom: responsiveScreenHeight(1),
  },
  label: {
    color: Colors.white,
    fontSize: FontSizes.small,
    fontFamily: Fonts.Medium,
    // fontWeight: 'bold',
    flex: 1,
  },
  separator: {
    color: Colors.white,
    fontSize: FontSizes.small,
    marginHorizontal: responsiveScreenHeight(0.5),
    fontFamily: Fonts.Regular,
  },
  value: {
    color: Colors.white,
    fontSize: FontSizes.small,
    flex: 1,
  },
  img2: {
    height: responsiveScreenHeight(5),
    width: responsiveScreenWidth(50),
    alignSelf: 'center',
    transform: [{rotate: '180deg'}],
    marginBottom: responsiveScreenHeight(1),
  },
});
