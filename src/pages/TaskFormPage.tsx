import React from 'react';
import { useParams } from 'react-router-dom';
import TaskForm from '../components/tasks/TaskForm';

const TaskFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        {isEditMode ? 'Edit Task' : 'Create New Task'}
      </h1>
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <TaskForm />
      </div>
    </div>
  );
};

export default TaskFormPage;