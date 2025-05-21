export const TaskSchema = {
  name: 'Task',
  primaryKey: 'id',
  properties: {
    id: 'string',
    name: 'string',
    description: 'string?',
    timer: 'string?',
    taskImage: 'string?',
    status: 'string',
    createdAt: 'date',
    completedAt: 'date?',
  },
};
