import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ListRenderItem,
  ScrollView,
} from 'react-native';
import {Colors} from '../theme/Colors';
import {
  responsiveFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import {Fonts} from '../assets/Fonts';
import {FontSizes} from '../theme/FontSizes';

interface ProductItem {
  id: string;
  product: string;
  premium: string;
  sell: string;
  premiumKg: string;
  sellKg: string;
}

interface MarketItem {
  id: string;
  Title: string;
  Bid: string;
  Ask: string;
  L: string;
  H: string;
}

interface MarketItemSecond {
  id: string;
  Title: string;
  Bid: string;
  Ask: string;
  L: string;
  H: string;
}

const PRODUCT_DATA: ProductItem[] = [
  {
    id: '1',
    product: 'Gold 999 DUBAI with certi 27/08 DEl',
    premium: '77860',
    sell: '73860',
    premiumKg: '73845',
    sellKg: '73845',
  },
  {
    id: '2',
    product: 'Gold 999 DUBAI with certi 28/08 DEl',
    premium: '77870',
    sell: '73870',
    premiumKg: '73855',
    sellKg: '73855',
  },
  {
    id: '3',
    product: 'Gold 999 DUBAI with certi 29/08 DEl',
    premium: '77880',
    sell: '73880',
    premiumKg: '73865',
    sellKg: '73865',
  },
];

const MARKET_DATA: MarketItem[] = [
  {
    id: '1',
    Title: 'GOLD COMEX',
    Bid: '2512.1',
    Ask: '2512.81',
    L: '2484.19',
    H: '2518.88',
  },
  {
    id: '2',
    Title: 'SILVER COMEX',
    Bid: '29.80',
    Ask: '28.85',
    L: '85.85',
    H: '29.88',
  },
  {
    id: '3',
    Title: 'INR SPOT',
    Bid: '83.7900',
    Ask: '83.8400',
    L: '83.8080',
    H: '83.9300',
  },
];

const MARKETDATASecond: MarketItemSecond[] = [
  {
    id: '1',
    Title: 'GOLD FUTURE',
    Bid: '2512.1',
    Ask: '2512.81',
    L: '2484.19',
    H: '2518.88',
  },
  {
    id: '2',
    Title: 'SILVER FUTURE',
    Bid: '29.80',
    Ask: '28.85',
    L: '85.85',
    H: '29.88',
  },
  {
    id: '3',
    Title: 'GOLD NEXT',
    Bid: '83.7900',
    Ask: '83.8400',
    L: '83.8080',
    H: '83.9300',
  },

  {
    id: '4',
    Title: 'SILVER NEXT',
    Bid: '83.7900',
    Ask: '83.8400',
    L: '83.8080',
    H: '83.9300',
  },
];

const PRODUCT_HEADER_ITEMS = [
  {key: 'product', label: 'PRODUCT', flex: 0.8},
  {key: 'premium', label: 'PREMIUM', flex: 0.7},
  {key: 'sell', label: 'SELL', flex: 0.5},
  {key: 'premiumKg', label: 'PREMIUM 3KG+', flex: 0.6},
  {key: 'sellKg', label: 'Sell 3KG+', flex: 0.4},
];

const HomeScreen: React.FC = () => {
  const renderProductHeader = () => (
    <View style={styles.headerContainer}>
      {PRODUCT_HEADER_ITEMS.map(item => (
        <Text key={item.key} style={[styles.headerText, {flex: item.flex}]}>
          {item.label}
        </Text>
      ))}
    </View>
  );

  const renderProductItem: ListRenderItem<ProductItem> = ({item}) => (
    <View style={styles.productItemContainer}>
      {PRODUCT_HEADER_ITEMS.map(header => (
        <Text
          key={header.key}
          style={[styles.productItemText, {flex: header.flex}]}>
          {item[header.key as keyof ProductItem]}
        </Text>
      ))}
    </View>
  );
  // renderMarketItem
  const renderMarketItem: ListRenderItem<MarketItem> = ({item}) => (
    <View style={styles.marketItemContainer}>
      <View style={styles.marketItemHeader}>
        <Text style={styles.marketItemTitle}>{item.Title}</Text>
      </View>
      <View style={styles.marketItemBody}>
        <View style={styles.marketItemColumn}>
          <Text
            style={[
              styles.marketItemText,
              {paddingTop: responsiveScreenHeight(1.5)},
            ]}>
            BID - {item.Bid}
          </Text>
          <Text
            style={[
              styles.marketItemText,
              styles.lowText,
              {paddingBottom: responsiveScreenHeight(1.5)},
            ]}>
            L - {item.L}
          </Text>
        </View>
        <View style={styles.marketItemColumn}>
          <Text
            style={[
              styles.marketItemText,
              {paddingTop: responsiveScreenHeight(1.5)},
            ]}>
            ASK - {item.Ask}
          </Text>
          <Text
            style={[
              styles.marketItemText,
              styles.highText,
              {paddingBottom: responsiveScreenHeight(1.5)},
            ]}>
            H - {item.H}
          </Text>
        </View>
      </View>
    </View>
  );

  // renderMarketItemSecond

  const renderMarketItemSecond: ListRenderItem<MarketItemSecond> = ({item}) => (
    <View style={styles.marketItemContainer}>
      <View style={styles.marketItemHeader}>
        <Text style={styles.marketItemTitle}>{item.Title}</Text>
      </View>
      <View style={styles.marketItemBody}>
        <View style={styles.marketItemColumn}>
          <View style={styles.marketItemColumnWhite}>
            <Text style={styles.marketItemColumnWhiteText}>BUY</Text>
          </View>
          <Text
            style={[
              styles.marketItemText,
              {paddingTop: responsiveScreenHeight(1.5)},
            ]}>
            BID - {item.Bid}
          </Text>
          <Text
            style={[
              styles.marketItemText,
              styles.lowText,
              {paddingBottom: responsiveScreenHeight(1.5)},
            ]}>
            L - {item.L}
          </Text>
        </View>
        <View style={styles.marketItemColumn}>
          <View style={styles.marketItemColumnWhite}>
            <Text style={styles.marketItemColumnWhiteText}>SELL</Text>
          </View>
          <Text
            style={[
              styles.marketItemText,
              {paddingTop: responsiveScreenHeight(1.5)},
            ]}>
            ASK - {item.Ask}
          </Text>
          <Text
            style={[
              styles.marketItemText,
              styles.highText,
              {paddingBottom: responsiveScreenHeight(1.5)},
            ]}>
            H - {item.H}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <FlatList
        ListHeaderComponent={renderProductHeader}
        data={PRODUCT_DATA}
        renderItem={renderProductItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        nestedScrollEnabled={true}
        scrollEnabled={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
      />
      <FlatList
        ListHeaderComponent={renderProductHeader}
        data={MARKET_DATA}
        renderItem={renderMarketItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        nestedScrollEnabled={true}
        scrollEnabled={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
      />

      <FlatList
        data={MARKETDATASecond}
        renderItem={renderMarketItemSecond}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
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
    // marginBottom: responsiveScreenHeight(10),
    // paddingBottom: responsiveScreenHeight(10),
  },
  headerContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.primaryColor,
    alignItems: 'center',
    paddingHorizontal: responsiveScreenHeight(1),
    paddingVertical: responsiveScreenHeight(1),
    borderRadius: 5,
    marginBottom: responsiveScreenHeight(0.5),
  },
  headerText: {
    fontSize: responsiveFontSize(2),
    fontFamily: Fonts.Medium,
    color: Colors.white,
    textAlign: 'center',
  },
  listContent: {
    flexGrow: 1,
  },
  productItemContainer: {
    flexDirection: 'row',
    padding: responsiveScreenHeight(0.5),
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginVertical: responsiveScreenHeight(0.3),
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.Yellow,
  },
  productItemText: {
    fontSize: responsiveFontSize(2),
    fontFamily: Fonts.Bold,
    color: Colors.black,
    textAlign: 'center',
  },
  marketItemContainer: {
    marginTop: responsiveScreenHeight(0.5),
  },
  marketItemHeader: {
    backgroundColor: Colors.primaryColor,
    alignItems: 'center',
    paddingHorizontal: responsiveScreenHeight(1),
    paddingVertical: responsiveScreenHeight(1),
    borderRadius: 5,
  },
  marketItemTitle: {
    color: Colors.white,
    fontFamily: Fonts.Bold,
    fontSize: FontSizes.medium,
  },
  marketItemBody: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: Colors.primaryColor2,
    marginTop: responsiveScreenHeight(0.9),
    borderWidth: 1,
    borderRadius: 5,
    borderColor: Colors.Yellow,
  },
  marketItemColumn: {
    alignItems: 'center',
    width: '50%',
  },
  marketItemText: {
    fontSize: FontSizes.medium,
    fontFamily: Fonts.Medium,
    color: Colors.black,
    textAlign: 'center',
    paddingVertical: responsiveScreenHeight(0.6),
  },
  lowText: {
    color: Colors.Low,
  },
  highText: {
    color: Colors.High,
  },

  marketItemColumnWhite: {
    backgroundColor: Colors.white,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: responsiveScreenHeight(1),
  },
  marketItemColumnWhiteText: {
    fontSize: FontSizes.medium,
    fontFamily: Fonts.Medium,
    paddingVertical: responsiveScreenHeight(0.5),
    color: Colors.black,
  },
});

export default HomeScreen;
