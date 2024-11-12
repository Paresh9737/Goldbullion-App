import React, {useEffect, useRef, useState} from 'react';
import {BackHandler, StyleSheet, View, ActivityIndicator} from 'react-native';
import {responsiveScreenHeight} from 'react-native-responsive-dimensions';
import {WebView} from 'react-native-webview';
import {Colors} from '../theme/Colors';

const EconomicScreen = () => {
  const webViewRef = useRef<WebView>(null); // Explicitly define the type for webViewRef
  const [canGoBack, setCanGoBack] = React.useState(false);
  const [loading, setLoading] = useState(true); // State to manage loading

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (canGoBack && webViewRef.current) {
          webViewRef.current.goBack();
          return true; // Prevent default back behavior (exit app)
        }
        return false; // Exit app if there's no web history to go back to
      },
    );

    return () => backHandler.remove();
  }, [canGoBack]);

  const injectedJavaScript = `
    document.querySelector('header').style.display = 'none'; // Hide header
    document.querySelector('.footer').style.display = 'none'; // Hide footer
    true;
  `;

  return (
    <View style={styles.container}>
      {loading && (
        <ActivityIndicator
          size="large"
          color={Colors.Yellow}
          style={styles.loader}
        />
      )}

      <WebView
        ref={webViewRef} // Attach the ref to WebView
        source={{uri: 'https://www.mql5.com/en/economic-calendar'}}
        style={styles.webview}
        injectedJavaScript={injectedJavaScript}
        scalesPageToFit={true}
        onLoadStart={() => setLoading(true)} // Show loader when loading starts
        onLoadEnd={() => setLoading(false)} // Hide loader when loading ends
        onNavigationStateChange={navState => setCanGoBack(navState.canGoBack)}
      />
    </View>
  );
};

export default EconomicScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgn,
  },
  webview: {
    flex: 1,
    marginTop: -responsiveScreenHeight(20),
    marginBottom: -responsiveScreenHeight(11),
    margin: responsiveScreenHeight(1),
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -25}, {translateY: -25}],
  },
});
