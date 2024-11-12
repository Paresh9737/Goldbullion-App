import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ListRenderItem,
  ScrollView,
  Image,
} from 'react-native';
import {Colors} from '../theme/Colors';
import {
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {Fonts} from '../assets/Fonts';
import {FontSizes} from '../theme/FontSizes';

interface ProductItem {
  id: string;
  product: string;
  premium: string;
}

const PRODUCT_DATA: ProductItem[] = [
  {
    id: '1',
    product: 'GOLD COIN (KUNDAN) 1 GRM 99.99',
    premium: '5531',
  },
  {
    id: '2',
    product: 'GOLD COIN (KUNDAN) 2 GRM 99.99',
    premium: '10841',
  },
  {
    id: '3',
    product: 'GOLD COIN (OTHER) 2 GRM 99.99',
    premium: '10621',
  },
  {
    id: '4',
    product: 'GOLD COIN (KUNDAN) 4 GRM 99.99',
    premium: '21492',
  },
  {
    id: '5',
    product: 'GOLD COIN (KUNDAN) 5 GRM 99.99',
    premium: '26803',
  },
  {
    id: '6',
    product: 'GOLD COIN (KUNDAN) 8 GRM 99.99',
    premium: '42785',
  },
  {
    id: '7',
    product: 'GOLD COIN (KUNDAN) 10 GRM 99.99',
    premium: '53606',
  },
  {
    id: '8',
    product: 'GOLD COIN (KUNDAN) 20 GRM 99.99',
    premium: '106662',
  },
];

const CoinRate: React.FC = () => {
  const renderProductHeader = () => (
    <View style={styles.headerContainerView}>
      <Text style={styles.headerContainerText}>COIN</Text>
      <Text
        style={[
          styles.headerContainerText,
          {paddingRight: responsiveScreenHeight(5)},
        ]}>
        PRICE
      </Text>
    </View>
  );

  const renderProductItem: ListRenderItem<ProductItem> = ({item}) => (
    <View style={styles.productItemContainer}>
      <View style={styles.productItemContainerSecond}>
        <Image
          style={styles.rupeeImg}
          source={require('../assets/png/rupee.png')}
        />
        <Text style={[styles.productItemText]}>{item.product}</Text>
      </View>

      <Text style={[styles.productPriceText]}>₹ {item.premium}</Text>
    </View>
  );

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <FlatList
        ListHeaderComponent={renderProductHeader}
        data={PRODUCT_DATA}
        renderItem={renderProductItem}
        keyExtractor={item => item.id}
        nestedScrollEnabled={true}
        scrollEnabled={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgn,
    padding: responsiveScreenHeight(1),
  },

  productItemContainer: {
    flexDirection: 'row',
    padding: responsiveScreenHeight(1),
    backgroundColor: Colors.primaryColor2,
    marginVertical: responsiveScreenHeight(0.3),
    borderWidth: 1,
    borderRadius: 5,
    borderColor: Colors.Yellow,
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  productItemContainerSecond: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '38%',
  },

  productItemText: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: Fonts.Bold,
    color: Colors.black,
  },
  productPriceText: {
    fontSize: responsiveFontSize(2),
    fontFamily: Fonts.Bold,
    color: Colors.black,
    width: '25%',
  },
  headerContainerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.primaryColor,
    paddingHorizontal: responsiveScreenHeight(2),
    paddingVertical: responsiveScreenHeight(1.5),
    borderRadius: 5,
    marginBottom: responsiveScreenHeight(0.5),
  },
  headerContainerText: {
    color: Colors.white,
    fontSize: responsiveFontSize(2),
    fontFamily: Fonts.Medium,
  },
  rupeeImg: {
    height: responsiveScreenHeight(3),
    width: responsiveScreenWidth(6.5),
    marginRight: responsiveScreenHeight(1),
  },
});

export default CoinRate;
