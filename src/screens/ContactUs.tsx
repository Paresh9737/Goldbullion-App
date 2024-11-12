import {
  Button,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useRef, useState} from 'react';
import {Colors} from '../theme/Colors';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {FontSizes} from '../theme/FontSizes';
import {Fonts} from '../assets/Fonts';
import InputField from '../components/InputFild';
import {useFocusEffect} from '@react-navigation/native';

type FormData = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};
type Errors = {
  [K in keyof FormData]?: string;
};
// Phone number ની લંબાઈ નક્કી કરવા માટે કૉન્સ્ટન્ટ્સ
const MIN_LENGTH = 10;
const MAX_LENGTH = 13;

type ContactItem = {
  id: string;
  title: string;
  icon: any;
  content: string;
};

const data: ContactItem[] = [
  {
    id: '1',
    title: 'ADDRESS',
    icon: require('../assets/png/location.png'),
    content:
      'Goldmine Commodities Pvt Ltd, Goldmine House, Below Shreyas Overbridge, Ahmedabad-380007',
  },
  {
    id: '2',
    title: 'CONTACT',
    icon: require('../assets/png/callus.png'),
    content: '9825412027\n9879206330\n7383010693',
  },
  {
    id: '3',
    title: 'E-MAIL',
    icon: require('../assets/png/email.png'),
    content: 'commodity@goldmine.net.in',
  },
];

const ContactUs = () => {
  const scrollViewRef = useRef<ScrollView>(null);

  useFocusEffect(
    React.useCallback(() => {
      // Scroll to top when the screen comes into focus
      scrollViewRef.current?.scrollTo({y: 0, animated: true});
    }, []),
  );

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Errors>({});

  // Reset input fields and errors when screen is focused
  useFocusEffect(
    useCallback(() => {
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      setErrors({});
    }, []),
  );

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({...prev, [field]: value}));
    if (errors[field]) {
      setErrors(prev => ({...prev, [field]: ''}));
    }
  };

  const handleSubmit = () => {
    let newErrors: Errors = {};
    let isValid = true;

    if (!formData.name || formData.name.length < 4) {
      newErrors.name = 'name must be at least 4 characters';
      isValid = false;
    }

    if (!formData.phone) {
      newErrors.phone = 'phone is required';
      isValid = false;
    } else if (
      formData.phone.length < MIN_LENGTH ||
      formData.phone.length > MAX_LENGTH
    ) {
      newErrors.phone = `phone must be between ${MIN_LENGTH} and ${MAX_LENGTH} digits`;
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = 'email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!formData.subject || formData.subject.length < 2) {
      newErrors.subject = 'subject name must be at least 2 characters';
      isValid = false;
    }
    if (!formData.message) {
      newErrors.message = 'City name must be at least 2 characters';
      isValid = false;
    }

    setErrors(newErrors);
    if (isValid) {
      console.log('done');
      ToastAndroid.show('Feedback Form submit', ToastAndroid.LONG);
    }
    return isValid;
  };

  const renderItem = ({item}: {item: ContactItem}) => (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{item.title}</Text>
      </View>
      <View style={styles.content}>
        <Image source={item.icon} style={styles.icon} />
        <Text style={styles.contentText}>{item.content}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView
      ref={scrollViewRef}
      showsVerticalScrollIndicator={false}
      style={styles.container}>
      <View style={styles.ImageBackgroundcontainer}>
        <Image
          style={styles.img}
          source={require('../assets/img/contact.png')}
        />
      </View>
      <Text style={styles.CONTACTText}>CONTACT US</Text>
      <Image
        style={[styles.img2]}
        source={require('../assets/img/images-removebg-preview.png')}
      />
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.containerFletList}
        nestedScrollEnabled={true}
        scrollEnabled={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
      />

      <View style={styles.containerInput}>
        <View style={styles.headerInputView}>
          <Text style={styles.headerInput}>FEEDBACK FORM</Text>
        </View>

        <Text style={styles.label}>Name *</Text>
        <InputField
          value={formData.name}
          onChangeText={text => handleInputChange('name', text)}
          placeholder="Please enter your name"
          inputStyle={StyleSheet.flatten([
            styles.input,
            errors.name ? styles.errorInput : undefined,
          ])}
        />
        {errors.name ? (
          <Text style={styles.errorText}>{errors.name}</Text>
        ) : null}

        <Text style={styles.label}>Email *</Text>
        <InputField
          value={formData.email}
          onChangeText={text => handleInputChange('email', text)}
          placeholder="Please enter your email"
          inputStyle={StyleSheet.flatten([
            styles.input,
            errors.email ? styles.errorInput : undefined,
          ])}
        />
        {errors.email ? (
          <Text style={styles.errorText}>{errors.email}</Text>
        ) : null}

        <Text style={styles.label}>Phone *</Text>

        <InputField
          value={formData.phone}
          onChangeText={text => handleInputChange('phone', text)}
          keyboardType="phone-pad"
          placeholder="Please enter your phone"
          inputStyle={StyleSheet.flatten([
            styles.input,
            errors.phone ? styles.errorInput : undefined,
          ])}
        />
        {errors.phone ? (
          <Text style={styles.errorText}>{errors.phone}</Text>
        ) : null}

        <Text style={styles.label}>Subject</Text>

        <InputField
          value={formData.subject}
          onChangeText={text => handleInputChange('subject', text)}
          placeholder="Please enter your Subject"
          inputStyle={StyleSheet.flatten([
            styles.input,
            errors.subject ? styles.errorInput : undefined,
          ])}
        />
        {errors.subject ? (
          <Text style={styles.errorText}>{errors.subject}</Text>
        ) : null}
        <Text style={styles.label}>Message *</Text>

        <TextInput
          style={StyleSheet.flatten([
            styles.input,
            styles.textArea,
            errors.message ? styles.errorInput : undefined,
          ])}
          placeholder="Message for me *"
          value={formData.message}
          onChangeText={text => handleInputChange('message', text)}
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity style={styles.SubmitButton} onPress={handleSubmit}>
          <Text style={styles.SubmitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ContactUs;

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
  CONTACTText: {
    fontSize: FontSizes.large1,
    fontFamily: Fonts.ExtraBold,
    color: Colors.primaryColor,
    textAlign: 'center',
    paddingTop: responsiveScreenHeight(1),
  },
  containerFletList: {
    padding: responsiveScreenHeight(1),
    backgroundColor: Colors.bgn,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    marginBottom: responsiveScreenHeight(1),
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: Colors.Yellow,
  },
  header: {
    backgroundColor: Colors.primaryColor,
    paddingVertical: responsiveScreenHeight(1.3),
    alignItems: 'center',
  },
  headerText: {
    color: Colors.white,
    fontSize: FontSizes.medium,
    fontFamily: Fonts.Medium,
    // fontWeight: 'bold',
  },
  content: {
    // flexDirection: 'row',
    padding: responsiveScreenHeight(1.5),
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    // marginRight: 10,
    tintColor: Colors.primaryColor,
    marginVertical: responsiveScreenHeight(1),
  },
  contentText: {
    color: Colors.black,
    fontSize: FontSizes.small,
    fontFamily: Fonts.Medium,
  },

  // ***************
  containerInput: {
    margin: responsiveScreenHeight(1),
    paddingTop: responsiveScreenHeight(1),
    backgroundColor: Colors.white,
    borderRadius: 10,
    marginTop: responsiveScreenHeight(1),
    borderWidth: 0.5,
    borderColor: Colors.Yellow,
  },

  headerInputView: {
    marginBottom: responsiveScreenHeight(2),
    backgroundColor: Colors.primaryColor,
    borderRadius: 5,
    paddingVertical: responsiveScreenHeight(1),
    marginLeft: responsiveScreenHeight(1),
  },
  headerInput: {
    fontSize: FontSizes.medium,
    fontFamily: Fonts.Medium,
    paddingLeft: responsiveScreenHeight(1),
    color: Colors.white,
  },
  label: {
    fontSize: FontSizes.medium,
    fontFamily: Fonts.Medium,
    marginBottom: responsiveScreenHeight(0.5),
    color: Colors.primaryColor,
    paddingLeft: responsiveScreenHeight(1),
  },
  input: {
    height: 40,
    borderColor: Colors.borderColor,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: responsiveScreenHeight(1),
    marginBottom: 15,
    backgroundColor: Colors.white,
  },
  textArea: {
    height: 80,
    marginHorizontal: responsiveScreenHeight(1),
    textAlignVertical: 'top',
  },
  errorInput: {
    borderColor: Colors.red,
  },
  SubmitButton: {
    backgroundColor: Colors.primaryColor,
    paddingVertical: responsiveScreenHeight(1),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: responsiveScreenWidth(50),
    borderRadius: 5,
  },
  SubmitButtonText: {
    fontSize: FontSizes.medium,
    fontFamily: Fonts.Medium,
    // paddingLeft: responsiveScreenHeight(1),
    color: Colors.white,
  },
  errorText: {
    color: Colors.black,
    marginVertical: responsiveScreenHeight(-1.3),
    textAlign: 'right',
  },
  img2: {
    height: responsiveScreenHeight(5),
    width: responsiveScreenWidth(50),
    alignSelf: 'center',
    transform: [{rotate: '180deg'}],
    marginBottom: responsiveScreenHeight(1),
  },
});
