import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  ListRenderItem,
  Modal,
  Alert,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ToastAndroid,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AuthContext} from '../navigator/contaxt/AuthContaxt';
import CustomButton from '../components/CustomButton';
import {Colors} from '../theme/Colors';
import {RootState} from '../redux/store';
import InputField from '../components/InputFild';
import {Svg} from '../helper/SvgProvider';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {FontSizes} from '../theme/FontSizes';
import {Fonts} from '../assets/Fonts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setUser} from '../redux/userSlice';
import {StackNavigationProp} from '@react-navigation/stack';
import {DrawerParamList} from '../navigator/DrawerNavigater';

type FormData = {
  username: string;

  email: string;
  contact: any;
  fiemName: string;
  gst: string;
  city: string;
};
type Errors = {
  [K in keyof FormData]?: string;
};
type MarketItem = {
  id: string;
  title: string;
  key: keyof RootState['user']; // Add a key to access userData properties
};

const DATA: MarketItem[] = [
  {
    id: '1',
    title: 'User ID',
    key: 'username',
  },
  {
    id: '2',
    title: 'Email',
    key: 'email',
  },
  {
    id: '3',
    title: 'Contact',
    key: 'contact',
  },
  {
    id: '4',
    title: 'FiemName',
    key: 'fiemName',
  },
  {
    id: '5',
    title: 'GST',
    key: 'gst',
  },
  {
    id: '6',
    title: 'City',
    key: 'city',
  },
];
const MIN_LENGTH = 10;
const MAX_LENGTH = 10;

type RegisterScreenNavigationProp = StackNavigationProp<
  DrawerParamList,
  'OtpVeriftProfileScreen'
>;
type Props = {
  navigation: RegisterScreenNavigationProp;
};

const ProfileScreen = ({navigation}: Props) => {
  const {logout} = useContext(AuthContext);
  const userData = useSelector((state: RootState) => state.user);
  const [getData, setGetData] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState<FormData>({
    username: userData.username || '',
    email: userData.email || '',
    contact: userData.contact || '',
    fiemName: userData.fiemName || '',
    gst: userData.gst || '',
    city: userData.city || '',
  });
  const [errors, setErrors] = useState<Errors>({});

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({...prev, [field]: value}));
    if (errors[field]) {
      setErrors(prev => ({...prev, [field]: ''}));
    }
  };
  const handleRegister = async (): Promise<boolean> => {
    let newErrors: Errors = {};
    let isValid = true;

    if (!formData.username || formData.username.length < 4) {
      newErrors.username = 'Username must be at least 4 characters';
      isValid = false;
    }
    if (!formData.contact) {
      newErrors.contact = 'Phone is required';
      isValid = false;
    } else if (
      formData.contact.length < MIN_LENGTH ||
      formData.contact.length > MAX_LENGTH
    ) {
      newErrors.contact = `Phone must be between ${MIN_LENGTH} digits`;
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!formData.city || formData.city.length < 2) {
      newErrors.city = 'City name must be at least 2 characters';
      isValid = false;
    }
    setErrors(newErrors);

    if (isValid) {
      const formattedContact = `+91${formData.contact}`;
      const updatedUserData = {
        username: formData.username,
        contact: formData.contact,
        email: formData.email,
        fiemName: formData.fiemName,
        gst: formData.gst,
        city: formData.city,
        password: userData.password,
      };

      // Check if contact number has been changed
      if (formData.contact !== userData.contact) {
        // Contact number changed, navigate to OTP screen
        setModalVisible(false);
        navigation.navigate('OtpVeriftProfileScreen', {
          contact: formattedContact,
        });
      } else {
        // Contact number not changed, update other fields
        dispatch(setUser(updatedUserData));
        await AsyncStorage.setItem('user', JSON.stringify(updatedUserData));
        setModalVisible(false);
        ToastAndroid.show('Profile updated successfully', ToastAndroid.LONG);
      }
    }

    return isValid;
  };

  const getDAta = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      setGetData(user);
    } catch (e) {
      console.log(`getDAta in error ${e}`);
    }
  };

  const renderProductHeader = () => (
    <View style={styles.logoView}>
      <Image style={styles.logo} source={require('../assets/png/logo.png')} />
    </View>
  );
  const renderMarketItem: ListRenderItem<MarketItem> = ({item}) => (
    <View style={styles.containerSecond}>
      <Text style={styles.label}>{item.title} *</Text>
      <Text style={[styles.label, {marginRight: responsiveScreenHeight(2)}]}>
        {userData[item.key]} {/* Access userData properties dynamically */}
      </Text>
    </View>
  );
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}>
        <FlatList
          ListHeaderComponent={renderProductHeader}
          data={DATA}
          renderItem={renderMarketItem}
          contentContainerStyle={{marginBottom: responsiveScreenHeight(1)}}
          keyExtractor={item => item.id}
          nestedScrollEnabled={true}
          scrollEnabled={false}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
        />

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Edit Profile</Text>

              <InputField
                value={formData.username}
                onChangeText={text => handleInputChange('username', text)}
                placeholder="Username"
                leftIcon={
                  <Svg.Use
                    height={responsiveScreenHeight(5)}
                    width={responsiveScreenWidth(7)}
                  />
                }
              />
              {errors.username ? (
                <Text style={styles.errorText}>{errors.username}</Text>
              ) : null}

              {/* Call  */}
              <InputField
                value={formData.contact}
                onChangeText={text => handleInputChange('contact', text)}
                placeholder="Contact No."
                keyboardType="number-pad"
                leftIcon={
                  <Svg.Call
                    height={responsiveScreenHeight(4)}
                    width={responsiveScreenWidth(5)}
                  />
                }
              />
              {errors.contact ? (
                <Text style={styles.errorText}>{errors.contact}</Text>
              ) : null}
              {/* Email  */}
              <InputField
                value={formData.email}
                onChangeText={text => handleInputChange('email', text)}
                placeholder="Email"
                leftIcon={
                  <Svg.Email
                    height={responsiveScreenHeight(5)}
                    width={responsiveScreenWidth(6)}
                  />
                }
              />
              {errors.email ? (
                <Text style={styles.errorText}>{errors.email}</Text>
              ) : null}
              {/* Filad Name  */}
              <InputField
                value={formData.fiemName}
                onChangeText={text => handleInputChange('fiemName', text)}
                placeholder="Firm Name"
                leftIcon={
                  <Svg.Use
                    height={responsiveScreenHeight(5)}
                    width={responsiveScreenWidth(7)}
                  />
                }
              />
              {errors.fiemName ? (
                <Text style={styles.errorText}>{errors.fiemName}</Text>
              ) : null}
              {/* Gst  */}
              <InputField
                value={formData.gst}
                onChangeText={text => handleInputChange('gst', text)}
                placeholder="GST IN"
                leftIcon={
                  <Svg.GST
                    height={responsiveScreenHeight(5)}
                    width={responsiveScreenWidth(6)}
                  />
                }
              />
              {errors.gst ? (
                <Text style={styles.errorText}>{errors.gst}</Text>
              ) : null}
              {/* City  */}
              <InputField
                value={formData.city}
                onChangeText={text => handleInputChange('city', text)}
                placeholder="City"
                leftIcon={
                  <Svg.City
                    height={responsiveScreenHeight(5)}
                    width={responsiveScreenWidth(6)}
                  />
                }
              />
              {errors.city ? (
                <Text style={styles.errorText}>{errors.city}</Text>
              ) : null}
              <CustomButton
                title="SAVE"
                onPress={handleRegister}
                buttonStyle={{backgroundColor: Colors.Yellow}}
                textStyle={{color: Colors.black}}
              />

              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Image
                  style={styles.textStyle}
                  source={require('../assets/png/close.png')}
                />
              </Pressable>
            </View>
          </View>
        </Modal>

        <CustomButton
          title="Edit"
          onPress={() => setModalVisible(true)}
          buttonStyle={styles.logoutButton}
          textStyle={styles.logoutButtonText}
        />

        <CustomButton
          title="Logout"
          onPress={logout}
          buttonStyle={styles.logoutButton}
          textStyle={styles.logoutButtonText}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: responsiveScreenHeight(2),
    backgroundColor: Colors.primaryColor2,
  },
  containerSecond: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: Colors.borderColor,
  },
  logo: {
    height: responsiveScreenHeight(18),
    width: responsiveScreenHeight(18),
    borderRadius: responsiveScreenHeight(9),
    alignSelf: 'center',
    resizeMode: 'cover',
  },
  logoView: {
    padding: 3,
    // borderWidth: 1,
    borderRadius: responsiveScreenHeight(9),
    alignSelf: 'center',
    // borderColor: Colors.black,
    marginVertical: responsiveScreenHeight(2),
  },
  logoutButton: {
    backgroundColor: Colors.Yellow,
    marginVertical: responsiveScreenHeight(1),
  },
  logoutButtonText: {
    color: Colors.black,
  },
  label: {
    fontSize: FontSizes.medium,
    fontFamily: Fonts.Medium,
    color: Colors.black,
    paddingLeft: responsiveScreenHeight(1),
    marginTop: responsiveScreenHeight(3),
    marginBottom: responsiveScreenHeight(1),
  },

  // modal
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primaryColor1,
  },

  modalView: {
    backgroundColor: Colors.primaryColor,
    borderRadius: 5,
    padding: 10,
    width: '95%',
  },
  button: {
    borderRadius: 20,
    padding: 10,
  },

  buttonClose: {
    position: 'absolute',
    right: 4,
    top: 0,
  },
  textStyle: {
    height: responsiveScreenHeight(3),
    width: responsiveScreenWidth(5),
    tintColor: Colors.Low,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',

    color: Colors.Yellow,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    width: 200,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  errorText: {
    color: Colors.Yellow,
    marginVertical: responsiveScreenHeight(-1),
    textAlign: 'right',
  },
  label2: {
    fontSize: FontSizes.medium,
    fontFamily: Fonts.Medium,
    marginBottom: responsiveScreenHeight(0.5),
    color: Colors.white,
    paddingLeft: responsiveScreenHeight(1),
  },
});

export default ProfileScreen;

// <InfoItem label="Username" value={userData.username} />
// <InfoItem label="Email" value={userData.email} />
// <InfoItem label="Contact" value={userData.contact} />
// <InfoItem label="Firm Name" value={userData.fiemName} />
// <InfoItem label="GST" value={userData.gst} />
// <InfoItem label="City" value={userData.city} />
