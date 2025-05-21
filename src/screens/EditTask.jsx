import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  scale,
} from '../utils/responsiveSize';
import Colors from '../utils/Colors';
import {useNavigation, useRoute} from '@react-navigation/native';
import {updateTask} from '../db/services/RealmDB';
import ImagePicker, {
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import WrapperContainer from '../utils/WrapperContainer';
import {showMessage} from 'react-native-flash-message';
import ImagePath from '../utils/ImagePath';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';

const EditTask = () => {
  const navigation = useNavigation();
  const {params} = useRoute();
  const taskToEdit = params?.taskToEdit;

  const [taskName, setTaskName] = useState(taskToEdit?.name || '');
  const [description, setDescription] = useState(taskToEdit?.description || '');
  const [timer, setTimer] = useState(taskToEdit?.timer?.toString() || '');
  const [taskImage, setTaskImage] = useState(taskToEdit?.taskImage || '');
  const [status, setStatus] = useState(taskToEdit?.status || 'inprogress');
  const [isLoading, setIsLoading] = useState(false);
  const [showModalForImage, setShowModalForImage] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: taskToEdit ? 'Edit Task' : 'Create Task',
    });
  }, [navigation, taskToEdit]);

  const handleImagePicker = () => {
    const options = {
      title: 'Select Task Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.uri) {
        setTaskImage(response.uri);
      }
    });
  };

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
          setTaskImage(imageUri);
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

          setTaskImage(imageUri);
          console.log(imageUri, 'line 83');
        }
      });
    } catch (error) {
      console.log('Error in Open Image Picker:', error.message);
    }
  };

  const handleSaveTask = () => {
    if (!taskName.trim()) {
      showMessage({
        type: 'danger',
        icon: 'danger',
        message: 'Error,Please enter a task name',
      });
      return;
    }

    if (timer && isNaN(Number(timer))) {
      showMessage({
        type: 'danger',
        icon: 'danger',
        message: 'Error,Please enter a valid number for timer',
      });
      return;
    }

    setIsLoading(true);

    const updatedTask = {
      id: taskToEdit?.id || new Realm.BSON.UUID().toString(),
      name: taskName.trim(),
      description: description.trim(),
      timer: timer.trim(),
      taskImage: taskImage.trim() || null,
      status: status,
      createdAt: taskToEdit?.createdAt || new Date(),
      ...(taskToEdit ? {} : {status: 'inprogress'}),
    };
    updateTask(updatedTask);
    setIsLoading(false);
    navigation.goBack();
  };

  const handleStatusToggle = () => {
    setStatus(prev => (prev === 'completed' ? 'inprogress' : 'completed'));
  };

  return (
    <WrapperContainer>
      <Text style={styles.headerText}>Edit Task</Text>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        {/* Task Image */}
        <View style={styles.imageSection}>
          {taskImage ? (
            <TouchableOpacity onPress={() => setShowModalForImage(true)}>
              <Image source={{uri: taskImage}} style={styles.taskImage} />
              <View style={styles.imageOverlay}>
                <Icon
                  name="edit"
                  size={moderateScale(20)}
                  color={Colors.white}
                />
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.addImageButton}
              onPress={() => setShowModalForImage(true)}>
              <Icon
                name="add-a-photo"
                size={moderateScale(30)}
                color={Colors.primary}
              />
              <Text style={styles.addImageText}>Add Image</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Task Name */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Task Name *</Text>
          <TextInput
            style={styles.input}
            value={taskName}
            onChangeText={setTaskName}
            placeholder="Enter task name"
            placeholderTextColor={Colors.gray}
          />
        </View>

        {/* Description */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter task description"
            placeholderTextColor={Colors.gray}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Timer */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Time Required (seconds)</Text>
          <TextInput
            style={styles.input}
            value={timer}
            onChangeText={setTimer}
            placeholder="Enter time in seconds"
            placeholderTextColor={Colors.gray}
            keyboardType="numeric"
          />
        </View>

        {/* Status Toggle */}
        {taskToEdit && (
          <View style={styles.statusContainer}>
            <Text style={styles.label}>Status</Text>
            <TouchableOpacity
              style={[
                styles.statusButton,
                status === 'completed'
                  ? styles.statusCompleted
                  : styles.statusInProgress,
              ]}
              onPress={handleStatusToggle}>
              <Icon
                name={
                  status === 'completed'
                    ? 'check-circle'
                    : 'radio-button-unchecked'
                }
                size={moderateScale(20)}
                color={Colors.white}
              />
              <Text style={styles.statusText}>
                {status === 'completed' ? 'Completed' : 'In Progress'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Save Button */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveTask}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <>
              <Icon name="save" size={moderateScale(20)} color={Colors.white} />
              <Text style={styles.saveButtonText}>Save Task</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: moderateScaleVertical(30),
  },
  imageSection: {
    alignItems: 'center',
    marginVertical: moderateScaleVertical(20),
  },
  taskImage: {
    width: moderateScale(150),
    height: moderateScale(150),
    borderRadius: moderateScale(75),
    backgroundColor: Colors.lightGray,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary + 'CC',
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageButton: {
    width: moderateScale(150),
    height: moderateScale(150),
    borderRadius: moderateScale(75),
    backgroundColor: Colors.lightGray + '40',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
  },
  addImageText: {
    marginTop: moderateScaleVertical(8),
    color: Colors.primary,
    fontSize: textScale(14),
  },
  inputContainer: {
    marginHorizontal: moderateScale(20),
    marginBottom: moderateScaleVertical(20),
  },
  label: {
    fontSize: textScale(14),
    color: Colors.textColor,
    marginBottom: moderateScaleVertical(8),
    fontWeight: '500',
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: moderateScale(8),
    padding: moderateScale(12),
    fontSize: textScale(16),
    color: Colors.textColor,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  multilineInput: {
    minHeight: moderateScaleVertical(100),
    textAlignVertical: 'top',
  },
  statusContainer: {
    marginHorizontal: moderateScale(20),
    marginBottom: moderateScaleVertical(20),
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(12),
    borderRadius: moderateScale(8),
    marginTop: moderateScaleVertical(8),
  },
  statusInProgress: {
    backgroundColor: Colors.primary,
  },
  statusCompleted: {
    backgroundColor: Colors.icon03,
  },
  statusText: {
    color: Colors.white,
    fontSize: textScale(16),
    marginLeft: moderateScale(10),
    fontWeight: '500',
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    borderRadius: moderateScale(30),
    padding: moderateScale(15),
    marginHorizontal: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: moderateScaleVertical(20),
    elevation: 3,
    shadowColor: Colors.primary,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  saveButtonText: {
    color: Colors.white,
    fontSize: textScale(16),
    fontWeight: '600',
    marginLeft: moderateScale(10),
  },
  headerText: {
    fontSize: textScale(22),
    fontWeight: '700',
    color: Colors.textColor,
    marginVertical: moderateScaleVertical(20),
    marginLeft: moderateScale(8),
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
});

export default EditTask;
