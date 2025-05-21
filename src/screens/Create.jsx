import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Modal,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import WrapperContainer from '../utils/WrapperContainer';
import {
  moderateScale,
  moderateScaleVertical,
  scale,
  textScale,
} from '../utils/responsiveSize';
import Colors from '../utils/Colors';
import CustomButton from '../components/CustomButton';
import {addTask} from '../db/services/RealmDB';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import ImagePath from '../utils/ImagePath';
import {showMessage} from 'react-native-flash-message';

const Create = () => {
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [timer, setTimer] = useState('');
  const [image, setImage] = useState(null);
  const [showModalForImage, setShowModalForImage] = useState(false);
  const [errors, setErrors] = useState({
    taskName: '',
    timer: '',
  });

  const openCamera = async () => {
    setShowModalForImage(false);
    try {
      const options = {
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 2000,
        maxWidth: 2000,
        cameraType: 'front',
        saveToPhotos: true,
        quality: 0.7,
      };
      launchCamera(options, async response => {
        if (response.didCancel) {
          console.log('User cancel Camera');
        } else if (response.error) {
          console.log('Camera Error:', response.error);
        } else {
          let imageUri = response.uri || response.assets[0]?.uri;
          setImage(imageUri);
        }
      });
    } catch (error) {
      console.log('Error in Opening camera', error.message);
    }
  };

  const openGallery = async () => {
    setShowModalForImage(false);
    try {
      const options = {
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 2000,
        maxWidth: 2000,
      };

      launchImageLibrary(options, async response => {
        if (response.didCancel) {
          console.log('User cancel Camera');
        } else if (response.error) {
          console.log('error');
        } else {
          let imageUri = response.uri || response.assets[0]?.uri;

          setImage(imageUri);
          console.log(imageUri, 'line 83');
        }
      });
    } catch (error) {
      console.log('Error in Open Image Picker:', error.message);
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      taskName: '',
      timer: '',
    };

    if (!taskName.trim()) {
      newErrors.taskName = 'Task name is required';
      isValid = false;
    }

    if (timer && isNaN(Number(timer))) {
      newErrors.timer = 'Please enter a valid number for timer';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleAddTask = () => {
    if (!validateForm()) return;

    const data = {
      name: taskName.trim(),
      description: description.trim(),
      timer: timer.trim(),
      taskImage: image?.trim() || null,
      status: 'inprogress',
    };

    addTask(data);
    showMessage({
      type: 'success',
      icon: 'success',
      message: 'Success,Task added successfully!',
    });
    setTaskName('');
    setDescription('');
    setTimer('');
    setImage('');
  };

  return (
    <WrapperContainer>
      <View style={{marginVertical: moderateScaleVertical(25), flex: 1}}>
        <ScrollView
          style={{flex: 1}}
          contentContainerStyle={{alignItems: 'center'}}
          keyboardShouldPersistTaps="handled">
          <Text style={styles.headerText}>Add Your daily routine task</Text>
          <View style={styles.inputField}>
            <Text style={styles.label}>Task Name *</Text>
            <TextInput
              style={[styles.input, errors.taskName && styles.errorInput]}
              value={taskName}
              onChangeText={text => {
                setTaskName(text);
                setErrors({...errors, taskName: ''});
              }}
              placeholder="Enter task name"
              placeholderTextColor={Colors.gray}
              maxLength={40}
            />
            {errors.taskName ? (
              <Text style={styles.errorText}>{errors.taskName}</Text>
            ) : null}
          </View>
          <View style={styles.inputField}>
            <Text style={styles.label}>Task Description</Text>
            <TextInput
              style={styles.input}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter task description"
              placeholderTextColor={Colors.gray}
              multiline
              maxLength={400}
            />
          </View>
          <View style={styles.inputField}>
            <Text style={styles.label}>Set Task time in Seconds</Text>
            <TextInput
              style={[styles.input, errors.timer && styles.errorInput]}
              value={timer}
              onChangeText={text => {
                setTimer(text);
                setErrors({...errors, timer: ''});
              }}
              placeholder="Enter task time in seconds"
              placeholderTextColor={Colors.gray}
              keyboardType="numeric"
              maxLength={5}
            />
            {errors.timer ? (
              <Text style={styles.errorText}>{errors.timer}</Text>
            ) : null}
          </View>
          <View style={[styles.inputField, styles.otherFiled]}>
            <Text style={styles.label}>Attached Image Optional</Text>
            <TouchableOpacity
              style={styles.cameraIcon}
              onPress={() => {
                setShowModalForImage(true);
              }}>
              <Feather
                name="camera"
                color={Colors.white}
                size={moderateScale(25)}
              />
            </TouchableOpacity>
          </View>
          {image && (
            <View style={{marginTop: moderateScaleVertical(10)}}>
              <Image
                source={{uri: image}}
                resizeMode="cover"
                style={styles.imageStyle}
              />
              <TouchableOpacity
                onPress={() => setImage(null)}
                style={styles.closeIcon}>
                <AntDesign
                  name="close"
                  size={moderateScale(25)}
                  color={Colors.white}
                />
              </TouchableOpacity>
            </View>
          )}
          <CustomButton
            text={'Add Task'}
            buttonStyle={styles.buttonStyle}
            handleAction={handleAddTask}
          />
        </ScrollView>
      </View>
      <Modal
        visible={showModalForImage}
        animationType="slide"
        transparent={true}
        statusBarTranslucent={true}
        onRequestClose={() => setShowModalForImage(false)}>
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <View style={styles.headerHolder}>
              <Text style={styles.modalHeaderText}>Select Photo</Text>
              <TouchableOpacity onPress={() => setShowModalForImage(false)}>
                <Ionicons
                  name="close"
                  size={moderateScale(35)}
                  color={Colors.black}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.listHolder}>
              <TouchableOpacity
                style={styles.iconHolder}
                onPress={() => openGallery()}>
                <Image
                  source={ImagePath.googlePhoto}
                  resizeMode="contain"
                  style={{
                    width: moderateScale(40),
                    height: moderateScale(40),
                  }}
                />
                <Text style={styles.text}>Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconHolder}
                onPress={() => openCamera()}>
                <Entypo
                  name="camera"
                  size={moderateScale(40)}
                  color={Colors.black}
                />
                <Text style={styles.text}>Camera</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </WrapperContainer>
  );
};

export default Create;

const styles = StyleSheet.create({
  headerText: {
    fontSize: textScale(15),
    fontWeight: '500',
    color: Colors.textColor,
    letterSpacing: scale(0.2),
    textAlign: 'center',
    marginBottom: moderateScaleVertical(20),
  },
  inputField: {
    marginBottom: moderateScaleVertical(15),
    width: '95%',
    borderRadius: moderateScale(10),
    padding: moderateScale(5),
  },
  label: {
    color: Colors.gray,
    fontSize: textScale(14),
    marginBottom: moderateScaleVertical(5),
  },
  input: {
    color: Colors.textColor,
    fontSize: textScale(14),
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    paddingBottom: moderateScaleVertical(5),
    paddingVertical: moderateScaleVertical(8),
  },
  errorInput: {
    borderBottomColor: Colors.error,
  },
  errorText: {
    color: Colors.error,
    fontSize: textScale(12),
    marginTop: moderateScaleVertical(5),
  },
  buttonStyle: {
    borderWidth: 2,
    width: '80%',
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    marginTop: moderateScaleVertical(20),
  },
  cameraIcon: {
    borderWidth: 2,
    width: moderateScale(100),
    padding: moderateScale(5),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: moderateScale(10),
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: moderateScale(10),
  },
  headerHolder: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: moderateScale(10),
  },
  modalHeaderText: {
    color: Colors.red,
    fontSize: textScale(14),
    lineHeight: scale(22),
  },
  text: {
    color: Colors.textColor,
    fontSize: textScale(14),
    textAlign: 'center',
  },
  iconHolder: {
    gap: moderateScale(5),
    alignItems: 'center',
  },
  listHolder: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(40),
    padding: moderateScale(10),
  },
  closeIcon: {
    position: 'absolute',
    backgroundColor: Colors.primary,
    borderRadius: moderateScale(100),
    width: moderateScale(50),
    height: moderateScale(50),
    alignItems: 'center',
    justifyContent: 'center',
    right: -25,
    top: -10,
  },
  imageStyle: {
    width: moderateScale(250),
    height: moderateScale(150),
  },
  otherFiled: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
