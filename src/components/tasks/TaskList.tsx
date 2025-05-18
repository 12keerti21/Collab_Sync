import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Task, TaskFilter } from '../../types';
import { useTask } from '../../contexts/TaskContext';
import { useAuth } from '../../contexts/AuthContext';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import {
  Clock,
  Filter,
  Search,
  AlertTriangle,
  CheckCircle2,
  MoreVertical,
  Pencil,
  Trash2,
} from 'lucide-react';
import { format } from 'date-fns';

const TaskList: React.FC = () => {
  const { tasks, loading, deleteTask } = useTask();
  const { user } = useAuth();
  const [filters, setFilters] = useState<TaskFilter>({
    status: '',
    priority: '',
    search: '',
  });
  const [sortBy, setSortBy] = useState<'deadline' | 'priority' | 'status'>('deadline');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary-600"></div>
        <span className="ml-2">Loading tasks...</span>
      </div>
    );
  }

  const filteredTasks = tasks
    .filter((task) => {
      // Filter by user role
      if (user?.role === 'provider' && task.createdBy !== user.id) {
        return false;
      }
      if (user?.role === 'client' && task.assignedTo !== user.id) {
        return false;
      }

      // Filter by status
      if (filters.status && task.status !== filters.status) {
        return false;
      }

      // Filter by priority
      if (filters.priority && task.priority !== filters.priority) {
        return false;
      }

      // Filter by search term
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        return (
          task.title.toLowerCase().includes(searchTerm) ||
          task.description.toLowerCase().includes(searchTerm)
        );
      }

      return true;
    })
    .sort((a, b) => {
      // Sort by selected criteria
      if (sortBy === 'deadline') {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      } else if (sortBy === 'priority') {
        const priorityWeight = { low: 0, medium: 1, high: 2 };
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      } else if (sortBy === 'status') {
        const statusWeight = { completed: 0, 'in-progress': 1, pending: 2, cancelled: 3 };
        return statusWeight[a.status] - statusWeight[b.status];
      }
      return 0;
    });

  const getPriorityBadge = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return <Badge variant="error">High</Badge>;
      case 'medium':
        return <Badge variant="warning">Medium</Badge>;
      case 'low':
        return <Badge variant="info">Low</Badge>;
    }
  };

  const getStatusBadge = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'in-progress':
        return <Badge variant="info">In Progress</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'cancelled':
        return <Badge variant="default">Cancelled</Badge>;
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id);
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-4 sm:flex-row">
        <div className="relative w-full sm:max-w-xs">
          <Input
            placeholder="Search tasks..."
            value={filters.search || ''}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            leftElement={<Search size={16} className="text-gray-400" />}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Filter size={16} />}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filters
          </Button>
          <select
            className="form-input h-9 bg-white py-0 pl-3 pr-8 text-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'deadline' | 'priority' | 'status')}
          >
            <option value="deadline">Sort by Deadline</option>
            <option value="priority">Sort by Priority</option>
            <option value="status">Sort by Status</option>
          </select>
          {user?.role === 'provider' && (
            <Link to="/tasks/new">
              <Button size="sm">New Task</Button>
            </Link>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 sm:grid-cols-3">
          <div>
            <label className="form-label">Status</label>
            <select
              className="form-input"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="form-label">Priority</label>
            <select
              className="form-input"
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="flex items-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilters({ status: '', priority: '', search: '' })}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      )}

      {filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-8 text-center">
          <div className="mb-4 rounded-full bg-gray-100 p-3">
            <Search size={24} className="text-gray-400" />
          </div>
      <h3 className="text-lg font-medium">No tasks found</h3>
      <p className="mt-1 text-gray-500">
        {filters.status || filters.priority || filters.search
          ? 'Try adjusting your filters'
          : user?.role === 'client'
          ? 'No tasks are assigned'
          : 'Create a new task to get started'}
      </p>
      {user?.role === 'provider' && (
        <Link to="/tasks/new" className="mt-4">
          <Button>Create New Task</Button>
        </Link>
      )}
    </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Task
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Deadline
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTasks.map((task) => (
                <tr key={task.id} className="group hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <Link to={`/tasks/${task.id}`} className="block">
                      <div className="font-medium text-gray-900">{task.title}</div>
                      <div className="mt-1 text-sm text-gray-500 line-clamp-1">
                        {task.description}
                      </div>
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">{getStatusBadge(task.status)}</td>
                  <td className="whitespace-nowrap px-6 py-4">{getPriorityBadge(task.priority)}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <Clock size={16} className="mr-1 text-gray-400" />
                      <span
                        className={
                          new Date(task.deadline) < new Date() && task.status !== 'completed'
                            ? 'text-error-600'
                            : 'text-gray-500'
                        }
                      >
                        {format(new Date(task.deadline), 'MMM d, yyyy')}
                      </span>
                    </div>
                    {new Date(task.deadline) < new Date() && task.status !== 'completed' && (
                      <div className="mt-1 flex items-center text-xs text-error-600">
                        <AlertTriangle size={12} className="mr-1" />
                        Overdue
                      </div>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="relative">
                      <button
                        onClick={() => setSelectedTask(selectedTask === task.id ? null : task.id)}
                        className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                      >
                        <MoreVertical size={16} />
                      </button>
                      {selectedTask === task.id && (
                        <div className="absolute right-0 z-10 mt-1 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                          <Link
                            to={`/tasks/${task.id}`}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            View Details
                          </Link>
                          {user?.role === 'provider' && (
                            <>
                              <Link
                                to={`/tasks/${task.id}/edit`}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <Pencil size={16} className="mr-2" />
                                Edit Task
                              </Link>
                              <button
                                onClick={() => handleDeleteTask(task.id)}
                                className="flex w-full items-center px-4 py-2 text-sm text-error-600 hover:bg-gray-100"
                              >
                                <Trash2 size={16} className="mr-2" />
                                Delete
                              </button>
                            </>
                          )}
                          {user?.role === 'client' && task.status !== 'completed' && (
                            <button
                              onClick={() =>
                                handleUpdateStatus(task.id, 'completed')
                              }
                              className="flex w-full items-center px-4 py-2 text-sm text-success-600 hover:bg-gray-100"
                            >
                              <CheckCircle2 size={16} className="mr-2" />
                              Mark Complete
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Helper component for input in the TaskList component
const Input: React.FC<{
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  leftElement?: React.ReactNode;
}> = ({ placeholder, value, onChange, leftElement }) => {
  return (
    <div className="relative">
      {leftElement && (
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          {leftElement}
        </div>
      )}
      <input
        type="text"
        className={`form-input ${leftElement ? 'pl-10' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

// Helper function for updating task status
const handleUpdateStatus = async (taskId: string, status: Task['status']) => {
  const { updateTask } = useTask();
  try {
    await updateTask(taskId, { status });
  } catch (error) {
    console.error('Failed to update task status:', error);
  }
};

export default TaskList;