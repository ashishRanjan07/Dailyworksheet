import {LogBox, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigation from './src/navigation/AppNavigation';
import {closeRealm, initializeRealm} from './src/db/services/RealmDB';
import FlashMessage from 'react-native-flash-message';

const App = () => {
  LogBox.ignoreAllLogs();
  LogBox.ignoreLogs(['Remote debugger']);

  useEffect(() => {
    const initRealm = async () => {
      try {
        await initializeRealm();
      } catch (error) {
        console.error('Failed to initialize Realm:', error);
      }
    };
    initRealm();
    return () => {
      closeRealm();
    };
  }, []);

  return (
    <>
      <NavigationContainer>
        <AppNavigation />
      </NavigationContainer>
      <FlashMessage
        position={'top'}
        animated={true}
        titleStyle={{textTransform: 'capitalize'}}
      />
    </>
  );
};

export default App;

const styles = StyleSheet.create({});
