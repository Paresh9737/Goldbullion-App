import React, {useState, useEffect, useContext, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Platform,
  Modal,
  TextInput,
  Alert,
  Pressable,
  ToastAndroid,
} from 'react-native';
import {useAppDispatch, useAppSelector} from '../redux/hook';
import {RootState} from '../redux/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {logoutUser, setUser} from '../redux/userSlice';
import {AuthContext} from '../navigator/contaxt/AuthContaxt';
import {Colors} from '../theme/Colors';
import CustomAlert from '../components/CustomAlertALLScreen';
import {useCustomAlert} from '../components/useCustomAlertAllScreen';
import {deleteAccountUser} from '../redux/AuthStackReducer/deletAccountSlice';
import {showMessage} from 'react-native-flash-message';
import {Fonts} from '../assets/Fonts';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {FontSizes} from '../theme/FontSizes';
import InputField from '../components/InputFild';
import {Svg} from '../helper/SvgProvider';
import CustomButton from '../components/CustomButton';
import {editProfileUser} from '../redux/AuthStackReducer/editProfileSlice';

type FormData = {
  username: string | null;
  password: string;
  email: string | null;
  mobile: string | null;
  country_code: string;
  address: string | null;
};
type Errors = {
  [K in keyof FormData]?: string;
};
type ProfileScreenProps = {
  navigation: {
    navigate: (screen: string, params?: any) => void;
  };
};
const ProfileScreen = ({navigation}: ProfileScreenProps) => {
  const {logout} = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const user = useAppSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();
  const {visible, alertConfig, showAlert, hideAlert} = useCustomAlert();
  const [modalVisible, setModalVisible] = useState(false);

  const [formData, setFormData] = useState({
    email: user?.email || '',
    mobile: user?.mobile || '',
    address: user?.address || '',
  });
  const [errors, setErrors] = useState<Errors>({});

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({...prev, [field]: value}));
    if (errors[field]) {
      setErrors(prev => ({...prev, [field]: ''}));
    }
  };

  const validateForm = useCallback(() => {
    const newErrors: Errors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Mobile validation
    if (!formData.mobile) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Mobile number must be 10 digits';
    }

    // Address validation
    if (!formData.address) {
      newErrors.address = 'Address is required';
    } else if (formData.address.length < 4) {
      newErrors.address = 'Address must be at least 4 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleRegister = (): void => {
    if (validateForm()) {
      const updatedUserData = {
        ...user,
        ...formData,
      };

      try {
        if (formData.mobile !== user.mobile) {
          ToastAndroid.show('Enter OTP', ToastAndroid.LONG);
          navigation.navigate('ProfileMobileVerifyScreen', {
            contact: updatedUserData,
          });
        } else {
          dispatch(setUser(updatedUserData));
          loadUserData();
          dispatch(
            editProfileUser({
              email: formData.email,
              country_code: '+91',
              mobile: formData.mobile,
              address: formData.address,
              id: user.id,
            }),
          );
          ToastAndroid.show('Profile updated successfully', ToastAndroid.LONG);
        }

        setModalVisible(false);
      } catch (error) {
        showMessage({
          message: 'Update Failed',
          description:
            error instanceof Error
              ? error.message
              : 'An unexpected error occurred',
          type: 'danger',
        });
      }
    }
  };

  const loadUserData = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('user');
      console.log('Raw user data:', userDataString);

      if (userDataString) {
        try {
          const userData = JSON.parse(userDataString);
          if (userData && typeof userData === 'object') {
            dispatch(setUser(userData));
          } else {
            console.error('Invalid user data format');
            await AsyncStorage.removeItem('user');
            dispatch(logoutUser());
          }
        } catch (parseError) {
          console.error('Error parsing user data:', parseError);
          await AsyncStorage.removeItem('user');
          dispatch(logoutUser());
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
  }, []);

  const handleLogout = () => {
    showAlert({
      title: 'Logout',
      message: 'Are you sure you want to logout from your account?',
      confirmText: 'Logout',
      onConfirm: () => {
        hideAlert();
        logout();
      },
    });
  };

  const handleDeleteAccount = async () => {
    showAlert({
      title: 'Delete Account',
      message:
        'This action cannot be undone. Are you sure you want to delete your account permanently?',
      confirmText: 'Delete',
      onConfirm: async () => {
        hideAlert();
        try {
          const result = await dispatch(
            deleteAccountUser({id: user.id}),
          ).unwrap();

          if (result.status === 'success') {
            showMessage({
              message: 'Success',
              description: 'Account deleted successfully.',
              type: 'success',
              duration: 3000,
            });

            logout();
          } else {
            showMessage({
              message: 'Error',
              description: result.message || 'Account deletion failed.',
              type: 'danger',
              duration: 3000,
            });
          }
        } catch (error: any) {
          showMessage({
            message: 'Error',
            description: error.message || 'An unexpected error occurred.',
            type: 'danger',
            duration: 3000,
          });
          console.error('Error deleting account:', error);
        }
      },
    });
  };
  const opanEditProfile = () => {
    setFormData({
      email: user?.email || '',
      mobile: user?.mobile || '',
      address: user?.address || '',
    });
    setModalVisible(true);
    const newErrors: Errors = {};
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primaryColor} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Image
            source={require('../assets/png/logo.png')}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.editImageButton}>
            <Text style={styles.editImageText}>Edit</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.userName}>{user.username}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Personal Information</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user.email}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Mobile</Text>
              <Text style={styles.infoValue}>{user.mobile}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Address</Text>
              <Text style={styles.infoValue}>{user.address}</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              opanEditProfile();
            }}>
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.changePasswordButton]}
            onPress={() => {
              navigation.navigate('OtpVeriftProfileScreen');
            }}>
            <Text style={styles.buttonText}>Change Password</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={handleDeleteAccount}>
            <Text style={[styles.buttonText, styles.deleteButtonText]}>
              Delete Account
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.logoutButton]}
            onPress={handleLogout}
            accessibilityLabel="Logout"
            accessibilityHint="Logs you out of the application">
            <Text style={[styles.buttonText, styles.logoutButtonText]}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
        <CustomAlert
          visible={visible}
          title={alertConfig.title}
          message={alertConfig.message}
          confirmText={alertConfig.confirmText}
          onConfirm={alertConfig.onConfirm}
          onCancel={hideAlert}
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

              {/* Call  */}
              <InputField
                value={formData.mobile}
                onChangeText={text => handleInputChange('mobile', text)}
                placeholder="Contact No."
                keyboardType="number-pad"
                leftIcon={
                  <Svg.Call
                    height={responsiveScreenHeight(4)}
                    width={responsiveScreenWidth(5)}
                  />
                }
              />
              {errors.mobile ? (
                <Text style={styles.errorText}>{errors.mobile}</Text>
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
                value={formData.address}
                onChangeText={text => handleInputChange('address', text)}
                placeholder="Firm Name"
                leftIcon={
                  <Svg.Use
                    height={responsiveScreenHeight(5)}
                    width={responsiveScreenWidth(7)}
                  />
                }
              />
              {errors.address ? (
                <Text style={styles.errorText}>{errors.address}</Text>
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
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgn,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bgn,
  },
  header: {
    backgroundColor: Colors.primaryColor,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 30,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  profileImageContainer: {
    marginBottom: 15,
    alignItems: 'center',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: Colors.primaryColor1,
  },
  editImageButton: {
    position: 'absolute',
    right: -10,
    bottom: 0,
    backgroundColor: Colors.primaryColor1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
  },
  editImageText: {
    color: Colors.primaryColor,
    fontSize: 14,
    fontWeight: '600',
  },
  userName: {
    color: Colors.primaryColor1,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userEmail: {
    color: Colors.primaryColor2,
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primaryColor,
    marginBottom: 20,
  },
  infoRow: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
    paddingBottom: 10,
  },
  infoItem: {
    marginBottom: 5,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.textGrey,
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    color: Colors.Dark,
    fontWeight: '500',
  },
  actionButtons: {
    marginBottom: 30,
  },
  button: {
    backgroundColor: Colors.primaryColor,
    borderRadius: 15,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  buttonText: {
    color: Colors.primaryColor1,
    fontSize: 16,
    fontWeight: '600',
  },
  changePasswordButton: {
    backgroundColor: Colors.Dark,
  },
  deleteButton: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.Low,
  },
  deleteButtonText: {
    color: Colors.Low,
  },
  logoutButton: {
    backgroundColor: Colors.Low,
  },
  logoutButtonText: {
    color: Colors.white,
  },
  // modal css
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
