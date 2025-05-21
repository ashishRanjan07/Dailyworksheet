import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import WrapperContainer from '../utils/WrapperContainer';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {getAllTaskList, deleteTask} from '../db/services/RealmDB';
import Colors from '../utils/Colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../utils/responsiveSize';
import Icon from 'react-native-vector-icons/MaterialIcons';

const TaskList = () => {
  const navigation = useNavigation();
  const [tasks, setTasks] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    fetchTaskList();
  }, [isFocused]);

  const fetchTaskList = () => {
    const taskList = getAllTaskList();
    setTasks(taskList);
  };

  const handleDeleteTask = taskId => {
    deleteTask(taskId);
    fetchTaskList();
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={[
        styles.taskItem,
        {
          borderColor:
            item?.status === 'completed'
              ? Colors.greenThemeColor
              : Colors.orangeThemeColor,
          borderWidth: moderateScale(1.5),
        },
      ]}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('Task Details', {task: item})}>
      <View style={styles.taskContent}>
        {item.taskImage && (
          <Image
            source={{uri: item.taskImage}}
            style={styles.taskImage}
            resizeMode="cover"
          />
        )}
        <View style={styles.taskInfo}>
          <View style={styles.taskHeader}>
            <Text style={styles.taskName} numberOfLines={1}>
              {item.name}
            </Text>
            <View style={styles.taskActions}>
              <TouchableOpacity
                onPress={e => {
                  e.stopPropagation();
                  navigation.navigate('Edit Task', {taskToEdit: item});
                }}
                style={styles.actionButton}>
                <Icon
                  name="edit"
                  size={moderateScale(20)}
                  color={Colors.primary}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={e => {
                  e.stopPropagation();
                  handleDeleteTask(item.id);
                }}
                style={styles.actionButton}>
                <Icon
                  name="delete"
                  size={moderateScale(20)}
                  color={Colors.error}
                />
              </TouchableOpacity>
            </View>
          </View>

          {item.description && (
            <Text style={styles.taskDescription} numberOfLines={2}>
              {item.description}
            </Text>
          )}

          <View style={styles.taskFooter}>
            {item.timer && (
              <View style={styles.taskTimerContainer}>
                <Icon
                  name="timer"
                  size={moderateScale(14)}
                  color={Colors.primary}
                />
                <Text style={styles.taskTimer}>{item.timer} seconds</Text>
              </View>
            )}
            <Text style={styles.taskDate}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <WrapperContainer>
      <View style={styles.container}>
        <Text style={styles.headerText}>Your Tasks</Text>

        {tasks.length > 0 ? (
          <FlatList
            data={tasks}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIllustration}>
              <Icon
                name="check-circle"
                size={moderateScale(80)}
                color={Colors.primaryLight}
              />
            </View>
            <Text style={styles.emptyTitle}>No Tasks Yet</Text>
            <Text style={styles.emptySubtitle}>
              Add your first task to get started
            </Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('Create')}>
              <Icon name="add" size={moderateScale(24)} color={Colors.white} />
              <Text style={styles.addButtonText}>Add Task</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </WrapperContainer>
  );
};

export default TaskList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: moderateScale(16),
  },
  headerText: {
    fontSize: textScale(22),
    fontWeight: '700',
    color: Colors.textColor,
    marginVertical: moderateScaleVertical(20),
    marginLeft: moderateScale(8),
  },
  listContent: {
    paddingBottom: moderateScaleVertical(30),
  },
  taskItem: {
    backgroundColor: Colors.white,
    borderRadius: moderateScale(12),
    marginBottom: moderateScaleVertical(16),
    overflow: 'hidden',
    elevation: 3,
    shadowColor: Colors.primary,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  taskContent: {
    flexDirection: 'row',
  },
  taskImage: {
    width: moderateScale(100),
    height: '100%',
    backgroundColor: Colors.lightGray,
  },
  taskInfo: {
    flex: 1,
    padding: moderateScale(16),
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: moderateScaleVertical(8),
  },
  taskName: {
    fontSize: textScale(16),
    fontWeight: '600',
    color: Colors.textColor,
    flex: 1,
    marginRight: moderateScale(8),
  },
  taskDescription: {
    fontSize: textScale(14),
    color: Colors.gray,
    marginBottom: moderateScaleVertical(12),
    lineHeight: moderateScaleVertical(20),
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskTimerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskTimer: {
    fontSize: textScale(12),
    color: Colors.primary,
    marginLeft: moderateScale(4),
  },
  taskDate: {
    fontSize: textScale(12),
    color: Colors.lightGray,
  },
  taskActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: moderateScale(12),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: moderateScale(40),
  },
  emptyIllustration: {
    backgroundColor: Colors.primaryLight + '20',
    width: moderateScale(120),
    height: moderateScale(120),
    borderRadius: moderateScale(60),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: moderateScaleVertical(24),
  },
  emptyTitle: {
    fontSize: textScale(20),
    fontWeight: '600',
    color: Colors.textColor,
    marginBottom: moderateScaleVertical(8),
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: textScale(14),
    color: Colors.gray,
    textAlign: 'center',
    marginBottom: moderateScaleVertical(24),
    lineHeight: moderateScaleVertical(20),
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    paddingHorizontal: moderateScale(24),
    paddingVertical: moderateScaleVertical(12),
    borderRadius: moderateScale(30),
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  addButtonText: {
    color: Colors.white,
    fontSize: textScale(16),
    fontWeight: '600',
    marginLeft: moderateScale(8),
  },
});
