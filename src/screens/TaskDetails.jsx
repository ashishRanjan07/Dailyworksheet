import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Share,
  Alert,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../utils/responsiveSize';
import Colors from '../utils/Colors';
import {useNavigation, useRoute} from '@react-navigation/native';
import {updateTaskStatus} from '../db/services/RealmDB';
import {showMessage} from 'react-native-flash-message';

const TaskDetail = () => {
  const navigation = useNavigation();
  const {params} = useRoute();
  const task = params?.task;
  const handleShare = async () => {
    try {
      const message = `Check out this task: ${task.name}\n\n${
        task.description || ''
      }\n\nTime: ${task.timer || 'No'} seconds`;
      await Share.share({
        message,
        title: 'Task Details',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share task');
    }
  };

  const handleComplete = () => {
    Alert.alert('Complete Task', 'Mark this task as completed?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Complete',
        onPress: () => {
          updateTaskStatus(task.id, 'completed');
          showMessage({
            icon: 'success',
            type: 'success',
            message: 'You have succesfully completed this task',
          });
          navigation.goBack();
        },
      },
    ]);
  };

  const handleOpenImage = () => {
    if (task.taskImage) {
      // Check if the image URI is a web URL or local file path
      if (
        task.taskImage.startsWith('http') ||
        task.taskImage.startsWith('https')
      ) {
        // It's a web URL - try to open in browser
        Linking.openURL(task.taskImage).catch(() => {
          showMessage({
            type: 'danger',
            icon: 'danger',
            message: 'Could not open image in browser',
          });
        });
      } else if (task.taskImage.startsWith('file://')) {
        // It's a local file - handle differently (show in modal)
        navigation.navigate('ImagePreview', {imageUri: task.taskImage});
      } else {
        // Unknown format - show fallback
        navigation.navigate('ImagePreview', {imageUri: task.taskImage});
      }
    } else {
      showMessage({
        type: 'info',
        icon: 'info',
        message: 'No image available to view',
      });
    }
  };

  if (!task) {
    return (
      <View style={styles.container}>
        <Text style={styles.notFoundText}>Task not found</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Icon
            name="arrow-back"
            size={moderateScale(24)}
            color={Colors.textColor}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Task Details</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Task Image */}
      {task.taskImage && (
        <TouchableOpacity onPress={handleOpenImage} activeOpacity={0.9}>
          <Image
            source={{uri: task.taskImage}}
            style={styles.taskImage}
            resizeMode="cover"
          />
          <View style={styles.imageOverlay}>
            <Icon
              name="zoom-in"
              size={moderateScale(24)}
              color={Colors.white}
            />
          </View>
        </TouchableOpacity>
      )}

      {/* Task Content */}
      <View style={styles.content}>
        {/* Task Name */}
        <Text style={styles.taskName}>{task.name}</Text>

        {/* Description */}
        {task.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{task.description}</Text>
          </View>
        )}

        {/* Timer */}
        {task.timer && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Time Required</Text>
            <View style={styles.timerContainer}>
              <Icon
                name="timer"
                size={moderateScale(20)}
                color={Colors.primary}
              />
              <Text style={styles.timerText}>{task.timer} seconds</Text>
            </View>
          </View>
        )}

        {/* Created Date */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Created On</Text>
          <Text style={styles.dateText}>
            {new Date(task.createdAt).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>

        {/* Created Date */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Task Status</Text>
          <Text style={styles.dateText}>
            {task?.status}{' '}
            {new Date(
              task?.status === 'inprogress' ? task.createdAt : task.completedAt,
            ).toLocaleDateString()}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.shareButton]}
          onPress={handleShare}>
          <Icon name="share" size={moderateScale(20)} color={Colors.white} />
          <Text style={styles.actionButtonText}>Share Task</Text>
        </TouchableOpacity>
        {task?.status === 'inprogress' && (
          <TouchableOpacity
            style={[styles.actionButton, styles.completeButton]}
            onPress={handleComplete}>
            <Icon
              name="check-circle"
              size={moderateScale(20)}
              color={Colors.white}
            />
            <Text style={styles.actionButtonText}>Mark Complete</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: moderateScale(16),
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  backButton: {
    padding: moderateScale(8),
  },
  headerTitle: {
    fontSize: textScale(18),
    fontWeight: '600',
    color: Colors.textColor,
  },
  headerRight: {
    width: moderateScale(40),
  },
  taskImage: {
    width: '100%',
    height: moderateScaleVertical(200),
    backgroundColor: Colors.lightGray,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: moderateScale(16),
    right: moderateScale(16),
    backgroundColor: Colors.black + '80',
    borderRadius: moderateScale(20),
    padding: moderateScale(8),
  },
  content: {
    padding: moderateScale(20),
  },
  taskName: {
    fontSize: textScale(24),
    fontWeight: '700',
    color: Colors.textColor,
    marginBottom: moderateScaleVertical(20),
  },
  section: {
    marginBottom: moderateScaleVertical(24),
  },
  sectionTitle: {
    fontSize: textScale(16),
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: moderateScaleVertical(8),
  },
  descriptionText: {
    fontSize: textScale(16),
    color: Colors.textColor,
    lineHeight: moderateScaleVertical(24),
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerText: {
    fontSize: textScale(16),
    color: Colors.textColor,
    marginLeft: moderateScale(8),
  },
  dateText: {
    fontSize: textScale(14),
    color: Colors.gray,
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(20),
    marginTop: moderateScaleVertical(10),
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: moderateScaleVertical(12),
    paddingHorizontal: moderateScale(20),
    borderRadius: moderateScale(30),
    flex: 1,
    marginHorizontal: moderateScale(5),
  },
  shareButton: {
    backgroundColor: Colors.secondary,
  },
  completeButton: {
    backgroundColor: Colors.primary,
  },
  actionButtonText: {
    color: Colors.white,
    fontSize: textScale(14),
    fontWeight: '600',
    marginLeft: moderateScale(8),
  },
  notFoundText: {
    fontSize: textScale(18),
    color: Colors.textColor,
    textAlign: 'center',
    marginTop: moderateScaleVertical(40),
  },
  statusContainer: {
    padding: moderateScale(12),
    borderRadius: moderateScale(8),
    marginTop: moderateScaleVertical(8),
  },
  statusInProgress: {
    backgroundColor: Colors.primaryLight + '20',
    borderLeftWidth: moderateScale(4),
    borderLeftColor: Colors.primary,
  },
  statusCompleted: {
    backgroundColor: Colors.successLight + '20',
    borderLeftWidth: moderateScale(4),
    borderLeftColor: Colors.success,
  },
  statusText: {
    fontSize: textScale(16),
    fontWeight: '600',
  },
  completedDateText: {
    fontSize: textScale(12),
    color: Colors.gray,
    marginTop: moderateScaleVertical(4),
  },
  reopenButton: {
    backgroundColor: Colors.secondary,
  },
});

export default TaskDetail;
