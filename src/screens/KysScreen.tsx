import {
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
import DocumentPicker from 'react-native-document-picker';
import {useFocusEffect} from '@react-navigation/native';

type FormData = {
  companyName: string;
  address: string;
  name1: string;
  mobile1: string;
  name2: string;
  mobile2: string;
  office1: string;
  office2: string;
  residence: string;
  email: string;
  bankname: string;
  branch: string;
  accountNo: string;
  ifscCode: string;
  gstNo: string;
  panNo: string;
  reference: string;
};
type Errors = {
  [K in keyof FormData]?: string;
};
// Phone number ની લંબાઈ નક્કી કરવા માટે કૉન્સ્ટન્ટ્સ
const MIN_LENGTH = 10;
const MAX_LENGTH = 13;

const KysScreen = () => {
  const scrollViewRef = useRef<ScrollView>(null);

  useFocusEffect(
    React.useCallback(() => {
      // Scroll to top when the screen comes into focus
      scrollViewRef.current?.scrollTo({y: 0, animated: true});
    }, []),
  );
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    address: '',
    name1: '',
    mobile1: '',
    name2: '',
    mobile2: '',
    office1: '',
    office2: '',
    residence: '',
    email: '',
    bankname: '',
    branch: '',
    accountNo: '',
    ifscCode: '',
    gstNo: '',
    panNo: '',
    reference: '',
  });
  const [errors, setErrors] = useState<Errors>({});

  // Reset input fields and errors when screen is focused
  useFocusEffect(
    useCallback(() => {
      setFormData({
        companyName: '',
        address: '',
        name1: '',
        mobile1: '',
        name2: '',
        mobile2: '',
        office1: '',
        office2: '',
        residence: '',
        email: '',
        bankname: '',
        branch: '',
        accountNo: '',
        ifscCode: '',
        gstNo: '',
        panNo: '',
        reference: '',
      });
      setErrors({});
    }, []),
  );

  const [resultDocument, setResultDocument] = useState<any>(null);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({...prev, [field]: value}));
    if (errors[field]) {
      setErrors(prev => ({...prev, [field]: ''}));
    }
  };

  const handleSubmit = () => {
    let newErrors: Errors = {};
    let isValid = true;

    if (!formData.name1 || formData.name1.length < 4) {
      newErrors.name1 = 'name must be at least 4 characters';
      isValid = false;
    }

    if (!formData.mobile1) {
      newErrors.mobile1 = 'phone is required';
      isValid = false;
    } else if (
      formData.mobile1.length < MIN_LENGTH ||
      formData.mobile1.length > MAX_LENGTH
    ) {
      newErrors.mobile1 = `phone must be between ${MIN_LENGTH} and ${MAX_LENGTH} digits`;
      isValid = false;
    }

    if (!formData.office1 || formData.office1.length < 2) {
      newErrors.office1 = 'name must be at least 4 characters';
      isValid = false;
    }
    if (!formData.residence || formData.residence.length < 2) {
      newErrors.residence = 'name must be at least 4 characters';
      isValid = false;
    }

    setErrors(newErrors);
    if (isValid) {
      console.log('done');
      ToastAndroid.show('KYC Form submit', ToastAndroid.LONG);
    }
    return isValid;
  };
  const openDocument = async () => {
    try {
      // DocumentPicker દ્વારા દસ્તાવેજ પસંદ કરો
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles], // તમામ પ્રકારના ફાઇલો પસંદ કરી શકો છો
      });
      setResultDocument(result[0]);
      // પસંદ કરેલા દસ્તાવેજનું પરિણામ કન્સોલમાં દર્શાવો
      console.log(result);
    } catch (error) {
      // જો યુઝરે દસ્તાવેજ પસંદ કરવો રદ કરી દીધો હોય
      if (DocumentPicker.isCancel(error)) {
        console.log('User cancelled the picker');
      } else {
        // જો કશુંક અન્ય ભૂલ થઈ હોય
        console.error('Error opening document:', error);
      }
    }
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      showsVerticalScrollIndicator={false}
      style={styles.container}>
      <Text style={styles.CONTACTText}>KYC</Text>
      <Image
        style={[styles.img2]}
        source={require('../assets/img/images-removebg-preview.png')}
      />

      {/* Company Details */}
      <View style={styles.headerInputView}>
        <Text style={styles.headerInput}>Company Details</Text>
      </View>

      <View style={styles.containerInput}>
        <Text style={styles.label}>Company Name :</Text>
        <InputField
          value={formData.companyName}
          onChangeText={text => handleInputChange('companyName', text)}
          placeholder="Company Name"
          inputStyle={styles.input}
        />

        <Text style={styles.label}>Address :</Text>

        <TextInput
          style={StyleSheet.flatten([
            styles.input,
            styles.textArea,
            errors.address ? styles.errorInput : undefined,
          ])}
          placeholder="Company Address :"
          value={formData.address}
          onChangeText={text => handleInputChange('address', text)}
          multiline
          numberOfLines={4}
        />
      </View>

      {/* Proprietor Details */}
      <View style={styles.headerInputView}>
        <Text style={styles.headerInput}>Proprietor/Partners</Text>
      </View>

      <View style={styles.containerInput}>
        <Text style={styles.label}>Name 1*:</Text>
        <InputField
          value={formData.name1}
          onChangeText={text => handleInputChange('name1', text)}
          placeholder="Enter Name"
          inputStyle={StyleSheet.flatten([
            styles.input,
            errors.name1 ? styles.errorInput : undefined,
          ])}
        />
        {errors.name1 ? (
          <Text style={styles.errorText}>{errors.name1}</Text>
        ) : null}

        <Text style={styles.label}>Mobile 1*:</Text>
        <InputField
          value={formData.mobile1}
          onChangeText={text => handleInputChange('mobile1', text)}
          placeholder="Enter Mobile"
          keyboardType="number-pad"
          inputStyle={StyleSheet.flatten([
            styles.input,
            errors.mobile1 ? styles.errorInput : undefined,
          ])}
        />
        {errors.mobile1 ? (
          <Text style={styles.errorText}>{errors.mobile1}</Text>
        ) : null}

        <Text style={styles.label}>Name 2:</Text>
        <InputField
          value={formData.name2}
          onChangeText={text => handleInputChange('name2', text)}
          placeholder="Enter Name"
          inputStyle={styles.input}
        />

        <Text style={styles.label}>Mobile 2:</Text>
        <InputField
          value={formData.mobile2}
          onChangeText={text => handleInputChange('mobile2', text)}
          placeholder="Enter Mobile"
          keyboardType="number-pad"
          inputStyle={styles.input}
        />
      </View>

      {/* Phone No */}
      <View style={styles.headerInputView}>
        <Text style={styles.headerInput}>Phone No</Text>
      </View>

      <View style={styles.containerInput}>
        <Text style={styles.label}>office 1*:</Text>
        <InputField
          value={formData.office1}
          onChangeText={text => handleInputChange('office1', text)}
          placeholder="Enter office Number"
          inputStyle={StyleSheet.flatten([
            styles.input,
            errors.office1 ? styles.errorInput : undefined,
          ])}
        />

        <Text style={styles.label}>office 2:</Text>

        <InputField
          value={formData.office2}
          onChangeText={text => handleInputChange('office2', text)}
          placeholder="Enter office Number"
          inputStyle={styles.input}
        />

        <Text style={styles.label}>Residence *:</Text>
        <InputField
          value={formData.residence}
          onChangeText={text => handleInputChange('residence', text)}
          placeholder="Enter Residence"
          inputStyle={StyleSheet.flatten([
            styles.input,
            errors.residence ? styles.errorInput : undefined,
          ])}
        />

        <Text style={styles.label}>Email:</Text>
        <InputField
          value={formData.email}
          onChangeText={text => handleInputChange('email', text)}
          placeholder="Enter Email"
          inputStyle={styles.input}
        />
      </View>

      {/* Banck Detailas */}
      <View style={styles.headerInputView}>
        <Text style={styles.headerInput}>Bank Details</Text>
      </View>

      <View style={styles.containerInput}>
        <Text style={styles.label}>Name:</Text>
        <InputField
          value={formData.bankname}
          onChangeText={text => handleInputChange('bankname', text)}
          placeholder="Enter Name"
          inputStyle={styles.input}
        />
        <Text style={styles.label}>Branch:</Text>
        <InputField
          value={formData.branch}
          onChangeText={text => handleInputChange('branch', text)}
          placeholder="Enter Branch"
          inputStyle={styles.input}
        />

        <Text style={styles.label}>Account Number:</Text>
        <InputField
          value={formData.accountNo}
          onChangeText={text => handleInputChange('accountNo', text)}
          placeholder="Enter Account Number"
          inputStyle={styles.input}
        />

        <Text style={styles.label}>IFSC Code:</Text>
        <InputField
          value={formData.ifscCode}
          onChangeText={text => handleInputChange('ifscCode', text)}
          placeholder="Enter IFSC Code"
          inputStyle={styles.input}
        />

        <Text style={styles.label}>GST No:</Text>
        <InputField
          value={formData.gstNo}
          onChangeText={text => handleInputChange('gstNo', text)}
          placeholder="Enter GST No"
          inputStyle={styles.input}
        />

        <Text style={styles.label}>PAN No:</Text>
        <InputField
          value={formData.panNo}
          onChangeText={text => handleInputChange('panNo', text)}
          placeholder="Enter PAN No"
          inputStyle={styles.input}
        />

        <Text style={styles.label}>Reference:</Text>
        <InputField
          value={formData.reference}
          onChangeText={text => handleInputChange('reference', text)}
          placeholder="Enter Reference"
          inputStyle={styles.input}
        />
      </View>

      {/* Documents Required No */}
      <View style={styles.headerInputView}>
        <Text style={styles.headerInput}>Documents Required</Text>
      </View>

      <View style={styles.containerInput}>
        <Text style={styles.label}>1 Address Proof Scan Copy:</Text>
        <View style={styles.labelRowView}>
          <TouchableOpacity onPress={openDocument} style={styles.chooseButtton}>
            <Text style={styles.chooseButttonText}>Choose File</Text>
          </TouchableOpacity>
          {resultDocument === null ? (
            <Text style={[styles.chooseButttonText, {marginLeft: 10}]}>
              No File Choose
            </Text>
          ) : (
            <Text style={[styles.chooseButttonText, {marginLeft: 10}]}>
              {resultDocument.name.slice(0, 25)}
            </Text>
          )}
        </View>

        <Text style={styles.label}>2. Pan No Scan Copy:</Text>
        <View style={styles.labelRowView}>
          <TouchableOpacity onPress={openDocument} style={styles.chooseButtton}>
            <Text style={styles.chooseButttonText}>Choose File</Text>
          </TouchableOpacity>
          {resultDocument === null ? (
            <Text style={[styles.chooseButttonText, {marginLeft: 10}]}>
              No File Choose
            </Text>
          ) : (
            <Text style={[styles.chooseButttonText, {marginLeft: 10}]}>
              {resultDocument.name.slice(0, 25)}
            </Text>
          )}
        </View>

        <Text style={styles.label}>3. GST No Scan Copy:</Text>
        <View style={styles.labelRowView}>
          <TouchableOpacity onPress={openDocument} style={styles.chooseButtton}>
            <Text style={styles.chooseButttonText}>Choose File</Text>
          </TouchableOpacity>
          {resultDocument === null ? (
            <Text style={[styles.chooseButttonText, {marginLeft: 10}]}>
              No File Choose
            </Text>
          ) : (
            <Text style={[styles.chooseButttonText, {marginLeft: 10}]}>
              {resultDocument.name.slice(0, 25)}
            </Text>
          )}
        </View>

        <Text style={styles.label}>4. Partnership Deed Copy:</Text>
        <View style={styles.labelRowView}>
          <TouchableOpacity onPress={openDocument} style={styles.chooseButtton}>
            <Text style={styles.chooseButttonText}>Choose File</Text>
          </TouchableOpacity>
          {resultDocument === null ? (
            <Text style={[styles.chooseButttonText, {marginLeft: 10}]}>
              No File Choose
            </Text>
          ) : (
            <Text style={[styles.chooseButttonText, {marginLeft: 10}]}>
              {resultDocument.name.slice(0, 25)}
            </Text>
          )}
        </View>
      </View>

      <TouchableOpacity style={styles.SubmitButton} onPress={handleSubmit}>
        <Text style={styles.SubmitButtonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default KysScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgn2,
  },

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

  // ***************
  containerInput: {
    margin: responsiveScreenHeight(1),
    backgroundColor: Colors.white,
    borderRadius: 5,
    borderColor: Colors.Yellow,
    borderWidth: 0.5,
    paddingVertical: responsiveScreenHeight(1),
  },

  headerInputView: {
    marginBottom: responsiveScreenHeight(0.2),
    backgroundColor: Colors.primaryColor,
    borderRadius: 5,
    paddingVertical: responsiveScreenHeight(1),
    marginHorizontal: responsiveScreenHeight(1),
  },
  headerInput: {
    fontSize: FontSizes.medium,
    fontFamily: Fonts.Regular,
    paddingLeft: responsiveScreenHeight(1),
    color: Colors.white,
  },
  label: {
    fontSize: FontSizes.medium,
    fontFamily: Fonts.Medium,
    marginBottom: responsiveScreenHeight(0.8),
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
    marginBottom: responsiveScreenWidth(10),
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
  chooseButttonText: {
    fontSize: FontSizes.medium,
    fontFamily: Fonts.Medium,
    color: Colors.black,
  },
  chooseButtton: {
    borderWidth: 0.5,
    width: '30%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    marginLeft: responsiveScreenHeight(3),
    marginVertical: responsiveScreenHeight(0.5),
  },
  labelRowView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
