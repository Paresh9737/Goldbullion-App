import {
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useRef} from 'react';
import {Colors} from '../theme/Colors';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {FontSizes} from '../theme/FontSizes';
import {Fonts} from '../assets/Fonts';
import ImageSliderComponet from '../components/ImageSliderComponet';
import {useFocusEffect} from '@react-navigation/native';

interface Feature {
  title: string;
  description: string;
}
const FeatureItem: React.FC<Feature> = React.memo(({title, description}) => (
  <View style={styles.featureItem}>
    <Text style={styles.featureTitle}>
      {'\u2022'} {title}
    </Text>
    <Text style={styles.featureDescription}>{description}</Text>
  </View>
));

const features: Feature[] = [
  {
    title: 'Gold & Silver',
    description:
      'We offer a wide range of options for gold and silver investments, tailored to meet the needs of all our clients.',
  },
  {
    title: 'Live Rates',
    description:
      'Stay updated with real-time prices for Gold 999, Gold coins (ranging from 1 gram to 20 grams), Gold & Silver Comex, Gold & Silver Future, INR Spot, and more.',
  },
  {
    title: 'Market Updates',
    description:
      'We provide timely updates on market trends, ensuring that our clients are always informed of the latest developments.',
  },
  {
    title: 'Up-to-Date Rate Display',
    description:
      'Our platform ensures that you have access to the most current rates, helping you make informed investment decisions.',
  },
  {
    title: 'Current Market Behavior',
    description:
      'Gain insights into the behavior of the current market to better strategize your investments.',
  },
];

const AboutUs = () => {
  const scrollViewRef = useRef<ScrollView>(null);

  useFocusEffect(
    React.useCallback(() => {
      // Scroll to top when the screen comes into focus
      scrollViewRef.current?.scrollTo({y: 0, animated: true});
    }, []),
  );

  const renderFeatureItem = React.useCallback(
    ({item}: {item: Feature}) => <FeatureItem {...item} />,
    [],
  );
  return (
    <ScrollView
      ref={scrollViewRef}
      showsVerticalScrollIndicator={false}
      style={styles.container}>
      {/* <ImageBackground
        style={styles.imageBackground}
        source={require('../assets/img/goldimg.png')}
      /> */}
      <ImageSliderComponet />
      <Text style={styles.aboutText}>About Us</Text>

      <Image
        style={[styles.img]}
        source={require('../assets/img/images-removebg-preview.png')}
      />

      <Text
        style={[styles.footer, {paddingHorizontal: responsiveScreenHeight(2)}]}>
        Welcome to
        <Text style={styles.highlightText}>{' Goldmine Bullion'}</Text>, where
        excellence in precious metals trading meets unparalleled customer
        service. Our company has established a distinct benchmark in the trading
        of gold and silver, earning a reputation as a trusted partner in the
        market. We are proud to be a service-oriented brand that is open to all,
        offering our clients a secure and reliable platform for their
        investments.
      </Text>

      <Text
        style={[
          styles.footer,
          {
            paddingHorizontal: responsiveScreenHeight(2),
            marginTop: responsiveScreenHeight(1),
          },
        ]}>
        Since our inception, Goldmine Bullion has been a fast-growing
        organization with an impressive track record with suppliers across the
        region. Our commitment to providing valuable services has won us the
        satisfaction and trust of our customers. Our name reflects our
        dedication to quality and integrity in the market.
      </Text>

      <Text
        style={[
          styles.footer,
          {
            paddingHorizontal: responsiveScreenHeight(2),
            marginTop: responsiveScreenHeight(1),
          },
        ]}>
        As a major bullion entity in the city, we have set high standards in
        delivering exceptional services to our clients. We specialize in
        facilitating investments in precious metals, particularly gold and
        silver. Our team of experienced professionals is committed to ensuring
        that every customer interaction is marked by efficiency, expertise, and
        a genuine concern for your financial well-being.
      </Text>

      <View style={styles.featuresContainer}>
        <Text style={styles.heading}>Our Features</Text>
        <FlatList
          data={features}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderFeatureItem}
          nestedScrollEnabled={true}
          scrollEnabled={false}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
        />
        <Text style={styles.footer}>
          At Goldmine Bullion, we believe in setting the gold standard in
          customer service, transparency, and market expertise. Join us in
          making sound investments in precious metals and experience the
          confidence that comes with partnering with the best in the industry.
        </Text>
      </View>
    </ScrollView>
  );
};

export default AboutUs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgn,
  },
  imageBackground: {
    height: responsiveScreenHeight(10),
    width: '100%',
  },

  img: {
    height: responsiveScreenHeight(5),
    width: responsiveScreenWidth(50),
    alignSelf: 'center',
    transform: [{rotate: '180deg'}],
  },

  aboutText: {
    fontSize: FontSizes.large1,
    fontFamily: Fonts.ExtraBold,
    color: Colors.primaryColor,
    textAlign: 'center',
    paddingTop: responsiveScreenHeight(1),
    // paddingVertical: responsiveScreenHeight(0.5),
  },
  paragraph: {
    color: Colors.black,
    lineHeight: responsiveScreenHeight(2),
    paddingHorizontal: responsiveScreenHeight(1.5),
    letterSpacing: responsiveScreenHeight(0.1),
    fontSize: FontSizes.small,
    marginTop: responsiveScreenHeight(2),
  },
  highlightText: {
    fontSize: FontSizes.medium,
    fontWeight: 'bold',
  },
  featuresContainer: {
    padding: 16,
    backgroundColor: Colors.bgn,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  featureItem: {
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#555',
  },
  footer: {
    fontSize: 14,
    color: '#333',
    marginTop: 24,
    lineHeight: 20,
  },
});
