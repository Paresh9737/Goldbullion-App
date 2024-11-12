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

const UpdateScreen = () => {
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
          source={require('../assets/img/upadetBaground.png')}
        />
      </View>
      <Text style={styles.UpadetText}>UPDATE</Text>
      <Image
        style={[styles.img2]}
        source={require('../assets/img/images-removebg-preview.png')}
      />
      <Text style={styles.UpadetText}>No update Found</Text>
    </ScrollView>
  );
};

export default UpdateScreen;

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
  UpadetText: {
    fontSize: FontSizes.large1,
    fontFamily: Fonts.ExtraBold,
    color: Colors.primaryColor,
    textAlign: 'center',
    paddingTop: responsiveScreenHeight(5),
  },
  img2: {
    height: responsiveScreenHeight(5),
    width: responsiveScreenWidth(50),
    alignSelf: 'center',
    transform: [{rotate: '180deg'}],
  },
});
