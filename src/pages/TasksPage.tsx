import React from 'react';
import TaskList from '../components/tasks/TaskList';

const TasksPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Tasks</h1>
      <TaskList />
    </div>
  );
};

export default TasksPage;