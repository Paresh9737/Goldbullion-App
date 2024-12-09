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

// import React, {useContext, useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   Image,
//   KeyboardAvoidingView,
//   Platform,
//   ActivityIndicator,
// } from 'react-native';
// import {AuthContext} from '../navigator/contaxt/AuthContaxt';
// import CustomButton from '../components/CustomButton';
// import {Colors} from '../theme/Colors';
// import {
//   responsiveScreenHeight,
//   responsiveScreenWidth,
// } from 'react-native-responsive-dimensions';
// import {FontSizes} from '../theme/FontSizes';
// import {Fonts} from '../assets/Fonts';
// import {StackNavigationProp} from '@react-navigation/stack';
// import {DrawerParamList} from '../navigator/DrawerNavigater';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {setUser} from '../redux/userSlice';
// import {useAppDispatch, useAppSelector} from '../redux/hook';
// import {RootState} from '../redux/store';

// type RegisterScreenNavigationProp = StackNavigationProp<
//   DrawerParamList,
//   'OtpVeriftProfileScreen'
// >;
// type Props = {
//   navigation: RegisterScreenNavigationProp;
// };

// const ProfileScreen = ({navigation}: Props) => {
//   const {logout} = useContext(AuthContext);
//   const [loading, setLoading] = useState(true); // Loading state
//   const dispatch = useAppDispatch();
//   const user = useAppSelector((state: RootState) => state.user);

//   // AsyncStorage માંથી ડેટા લોડ કરવું
//   const loadUserData = async () => {
//     try {
//       const userData = await AsyncStorage.getItem('user');
//       if (userData) {
//         dispatch(setUser(JSON.parse(userData))); // Redux state update
//       }
//     } catch (error) {
//       console.error('Error loading user data:', error);
//     } finally {
//       setLoading(false); // Loading પુરૂં થયું
//     }
//   };

//   useEffect(() => {
//     loadUserData();
//   }, []);

//   if (loading) {
//     // જો લોડિંગ છે તો લોડિંગ ઇન્ડિકેટર બતાવો
//     return (
//       <View style={styles.loaderContainer}>
//         <ActivityIndicator size="large" color="#0000ff" />
//         <Text>Loading user data...</Text>
//       </View>
//     );
//   }

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.container}>
//         <View style={styles.logoView}>
//           <Image
//             style={styles.logo}
//             source={require('../assets/png/logo.png')}
//           />
//         </View>

//         <View style={styles.containerSecond}>
//           <Text style={styles.label}>user ID *</Text>
//           <Text
//             style={[styles.label, {marginRight: responsiveScreenHeight(2)}]}>
//             {user.username || 'Not Available'}
//           </Text>
//         </View>

//         <View style={styles.containerSecond}>
//           <Text style={styles.label}>email *</Text>
//           <Text
//             style={[styles.label, {marginRight: responsiveScreenHeight(2)}]}>
//             {user.email || 'Not Available'}
//           </Text>
//         </View>

//         <View style={styles.containerSecond}>
//           <Text style={styles.label}>mobile *</Text>
//           <Text
//             style={[styles.label, {marginRight: responsiveScreenHeight(2)}]}>
//             {user.mobile || 'Not Available'}
//           </Text>
//         </View>
//         <View style={styles.containerSecond}>
//           <Text style={styles.label}>address *</Text>
//           <Text
//             style={[styles.label, {marginRight: responsiveScreenHeight(2)}]}>
//             {user.address || 'Not Available'}
//           </Text>
//         </View>

//         <CustomButton
//           title="Logout"
//           onPress={logout}
//           buttonStyle={styles.logoutButton}
//           textStyle={styles.logoutButtonText}
//         />
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   loaderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//   },
//   container: {
//     flexGrow: 1,
//     paddingHorizontal: responsiveScreenHeight(2),
//     backgroundColor: Colors.primaryColor2,
//   },
//   containerSecond: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     borderBottomWidth: 2,
//     borderBottomColor: Colors.borderColor,
//   },
//   logo: {
//     height: responsiveScreenHeight(18),
//     width: responsiveScreenHeight(18),
//     borderRadius: responsiveScreenHeight(9),
//     alignSelf: 'center',
//     resizeMode: 'cover',
//   },
//   logoView: {
//     padding: 3,
//     // borderWidth: 1,
//     borderRadius: responsiveScreenHeight(9),
//     alignSelf: 'center',
//     // borderColor: Colors.black,
//     marginVertical: responsiveScreenHeight(2),
//   },
//   logoutButton: {
//     backgroundColor: Colors.Yellow,
//     marginVertical: responsiveScreenHeight(1),
//   },
//   logoutButtonText: {
//     color: Colors.black,
//   },
//   label: {
//     fontSize: FontSizes.medium,
//     fontFamily: Fonts.Medium,
//     color: Colors.black,
//     paddingLeft: responsiveScreenHeight(1),
//     marginTop: responsiveScreenHeight(3),
//     marginBottom: responsiveScreenHeight(1),
//   },
// });

// export default ProfileScreen;
