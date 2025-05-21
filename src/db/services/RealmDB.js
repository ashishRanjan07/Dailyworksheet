import Realm from 'realm';
import {TaskSchema} from '../models/TaskModel';

let realmInstance = null;

export const initializeRealm = async () => {
  realmInstance = await Realm.open({
    schema: [TaskSchema],
    schemaVersion: 3, // Incremented version
    migration: (oldRealm, newRealm) => {
      if (oldRealm.schemaVersion < 3) {
        const oldTasks = oldRealm.objects('Task');
        const newTasks = newRealm.objects('Task');

        for (let i = 0; i < oldTasks.length; i++) {
          // Add default status for existing tasks
          newTasks[i].status = 'inprogress';
          newTasks[i].completedAt = null;
        }
      }
    },
  });
  return realmInstance;
};

export const getRealm = () => {
  if (!realmInstance) {
    throw new Error('Realm is not initialized. Call initializeRealm first.');
  }
  return realmInstance;
};

export const closeRealm = () => {
  if (realmInstance) {
    realmInstance.close();
    realmInstance = null;
  }
};

// Create Task
export const addTask = taskData => {
  const realm = getRealm();
  let createdTask = null;
  realm.write(() => {
    createdTask = realm.create('Task', {
      id: new Realm.BSON.UUID().toString(),
      name: taskData.name,
      description: taskData.description || null,
      timer: taskData.timer || null,
      taskImage: taskData.taskImage || null,
      status: 'inprogress',
      createdAt: new Date(),
      completedAt: null,
    });
  });
  return createdTask; // Return the newly created task
};

// Get all tasks sorted by creation date (newest first)
export const getAllTaskList = () => {
  const realm = getRealm();
  return realm.objects('Task').sorted('createdAt', true);
};

// Delete a specific task by ID
export const deleteTask = taskId => {
  const realm = getRealm();
  const taskToDelete = realm.objectForPrimaryKey('Task', taskId);
  if (taskToDelete) {
    realm.write(() => {
      realm.delete(taskToDelete);
    });
    return true; // Return true if deletion was successful
  }
  return false; // Return false if task wasn't found
};

// Update Task details
export const updateTask = (updatedData) => {
  const realm = getRealm();
  const existingTask = realm.objectForPrimaryKey('Task', updatedData.id);
  if (!existingTask) return null;

  realm.write(() => {
    existingTask.name = updatedData.name || existingTask.name;
    existingTask.description = updatedData.description !== undefined 
      ? updatedData.description 
      : existingTask.description;
    existingTask.timer = updatedData.timer !== undefined 
      ? updatedData.timer 
      : existingTask.timer;
    existingTask.taskImage = updatedData.taskImage !== undefined 
      ? updatedData.taskImage 
      : existingTask.taskImage;
    existingTask.status = updatedData.status || existingTask.status;
    if (updatedData.status === 'completed' && !existingTask.completedAt) {
      existingTask.completedAt = new Date();
    } else if (updatedData.status === 'inprogress') {
      existingTask.completedAt = null;
    }
  });

  return existingTask;
};

// db/services/RealmDB.js
export const updateTaskStatus = (taskId, status) => {
  console.log(taskId, status, 'line 108');
  const realm = getRealm();
  const task = realm.objectForPrimaryKey('Task', taskId);
  if (!task) return false;

  realm.write(() => {
    task.status = status;
    task.completedAt = status === 'completed' ? new Date() : null;
  });
  return true;
};
