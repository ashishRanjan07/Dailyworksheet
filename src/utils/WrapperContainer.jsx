import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import React from 'react';
import Colors from './Colors';
import Loader from './Loader';
import PropTypes from 'prop-types';

const WrapperContainer = ({children, isLoading = false}) => {
  return (
    <View style={styles.main}>
      <SafeAreaView style={{backgroundColor: Colors.primary}} />
      <StatusBar barStyle={'default'} backgroundColor={Colors.primary} />
      <Loader isLoading={isLoading} />
      {children}
    </View>
  );
};

WrapperContainer.propTypes = {
  children: PropTypes.node.isRequired,
  isLoading: PropTypes.bool,
};

export default WrapperContainer;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
