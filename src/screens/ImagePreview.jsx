// screens/ImagePreview.js
import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { moderateScale } from '../utils/responsiveSize';
import Colors from '../utils/Colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const ImagePreview = ({ route }) => {
  const { imageUri } = route.params;
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="close" size={moderateScale(30)} color={Colors.white} />
      </TouchableOpacity>
      <Image 
        source={{ uri: imageUri }} 
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: moderateScale(40),
    right: moderateScale(20),
    zIndex: 1,
    backgroundColor: Colors.black + '80',
    borderRadius: moderateScale(15),
    padding: moderateScale(5),
  },
});

export default ImagePreview;