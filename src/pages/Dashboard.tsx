import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTask } from '../contexts/TaskContext';
import TaskList from '../components/tasks/TaskList';
import AnalyticsDashboard from '../components/analytics/AnalyticsDashboard';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import {
  Clock,
  AlertTriangle,
  CheckCircle,
  Plus,
  BarChart3,
  Users,
  MessageSquare,
} from 'lucide-react';
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { tasks, loading } = useTask();
  
  if (loading) {
    return (
      <div className="flex h-24 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary-600"></div>
        <span className="ml-2">Loading dashboard...</span>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">
            {user?.role === 'provider' ? 'Service Provider Dashboard' : 'Client Dashboard'}
          </h1>
          <p className="text-gray-600">
            Welcome back, {user?.name}
          </p>
        </div>
        {user?.role === 'provider' && (
          <Link to="/tasks/new">
            <Button leftIcon={<Plus size={16} />}>
              New Task
            </Button>
          </Link>
        )}
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <DashboardSummary />
        
        <div className="md:col-span-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Recent Tasks</h2>
              <Link to="/tasks" className="text-sm text-primary-600 hover:text-primary-700">
                View all
              </Link>
            </div>
            
            <div className="space-y-4">
              {tasks
                .filter(task => 
                  user?.role === 'provider' || 
                  (user?.role === 'client' && task.assignedTo === user?.id)
                )
                .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                .slice(0, 5)
                .map(task => (
                  <Link key={task.id} to={`/tasks/${task.id}`}>
                    <div className="group rounded-md border border-gray-200 p-4 transition-all hover:border-primary-200 hover:bg-primary-50">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium group-hover:text-primary-700">
                            {task.title}
                          </h3>
                          <p className="mt-1 text-sm text-gray-600 line-clamp-1">
                            {task.description}
                          </p>
                        </div>
                        <div>
                          {task.status === 'completed' && (
                            <Badge variant="success">Completed</Badge>
                          )}
                          {task.status === 'in-progress' && (
                            <Badge variant="info">In Progress</Badge>
                          )}
                          {task.status === 'pending' && (
                            <Badge variant="warning">Pending</Badge>
                          )}
                          {task.status === 'cancelled' && (
                            <Badge variant="default">Cancelled</Badge>
                          )}
                        </div>
                      </div>
                      <div className="mt-2 flex items-center text-xs text-gray-500">
                        <Clock size={14} className="mr-1" />
                        <span>Due: {format(new Date(task.deadline), 'MMM d, yyyy')}</span>
                        
                        {task.priority === 'high' && (
                          <span className="ml-3 text-error-600">High Priority</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              
              {tasks.length === 0 && (
                <div className="rounded-md bg-gray-50 p-4 text-center">
                  <p className="text-gray-500">No tasks found.</p>
                  {user?.role === 'provider' && (
                    <Link to="/tasks/new" className="mt-2 inline-block text-sm text-primary-600 hover:text-primary-700">
                      Create your first task
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {user?.role === 'provider' && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Recent Clients</h2>
              <Link to="/clients" className="text-sm text-primary-600 hover:text-primary-700">
                View all
              </Link>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center">
                  <img
                    src="https://randomuser.me/api/portraits/women/44.jpg"
                    alt="Jane Client"
                    className="h-10 w-10 rounded-full"
                  />
                  <div className="ml-3">
                    <p className="font-medium">Jane Client</p>
                    <p className="text-xs text-gray-500">client@example.com</p>
                  </div>
                </div>
                <div>
                  <Badge variant="info">3 Active Tasks</Badge>
                </div>
              </div>
              
              <Link to="/clients/new" className="inline-block text-sm text-primary-600 hover:text-primary-700">
                Add new client
              </Link>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Quick Analytics</h2>
                <Link to="/analytics" className="text-sm text-primary-600 hover:text-primary-700">
                  View full analytics
                </Link>
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-md bg-primary-50 p-4">
                  <div className="flex items-center">
                    <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                      <CheckCircle size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Completion Rate</p>
                      <p className="text-lg font-semibold">
                        {tasks.length > 0
                          ? Math.round(
                              (tasks.filter(t => t.status === 'completed').length / tasks.length) * 100
                            )
                          : 0}
                        %
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-md bg-warning-50 p-4">
                  <div className="flex items-center">
                    <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-warning-100 text-warning-600">
                      <Clock size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">In Progress</p>
                      <p className="text-lg font-semibold">
                        {tasks.filter(t => t.status === 'in-progress').length}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-md bg-error-50 p-4">
                  <div className="flex items-center">
                    <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-error-100 text-error-600">
                      <AlertTriangle size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Overdue</p>
                      <p className="text-lg font-semibold">
                        {tasks.filter(
                          t => 
                            new Date(t.deadline) < new Date() && 
                            t.status !== 'completed' &&
                            t.status !== 'cancelled'
                        ).length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DashboardSummary: React.FC = () => {
  const { user } = useAuth();
  const { tasks } = useTask();
  
  // Filter tasks based on user role
  const userTasks = tasks.filter(task => 
    user?.role === 'provider' || 
    (user?.role === 'client' && task.assignedTo === user?.id)
  );
  
  // Calculate task statistics
  const stats = {
    total: userTasks.length,
    completed: userTasks.filter(t => t.status === 'completed').length,
    pending: userTasks.filter(t => t.status === 'pending').length,
    inProgress: userTasks.filter(t => t.status === 'in-progress').length,
    overdue: userTasks.filter(
      t => 
        new Date(t.deadline) < new Date() && 
        t.status !== 'completed' &&
        t.status !== 'cancelled'
    ).length,
  };
  
  // Quick access links
  const quickLinks = user?.role === 'provider'
    ? [
        { icon: <Plus size={16} />, text: 'New Task', path: '/tasks/new' },
        { icon: <Users size={16} />, text: 'View Clients', path: '/clients' },
        { icon: <BarChart3 size={16} />, text: 'Analytics', path: '/analytics' },
        { icon: <MessageSquare size={16} />, text: 'Messages', path: '/messages' },
      ]
    : [
        { icon: <CheckCircle size={16} />, text: 'My Tasks', path: '/tasks' },
        { icon: <MessageSquare size={16} />, text: 'Messages', path: '/messages' },
      ];
  
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">Summary</h2>
      
      <div className="mb-6 space-y-3">
        <div className="flex items-center justify-between rounded-md bg-gray-50 p-3">
          <span className="text-sm font-medium">Total Tasks</span>
          <span className="font-semibold">{stats.total}</span>
        </div>
        <div className="flex items-center justify-between rounded-md bg-success-50 p-3">
          <span className="text-sm font-medium text-success-700">Completed</span>
          <span className="font-semibold text-success-700">{stats.completed}</span>
        </div>
        <div className="flex items-center justify-between rounded-md bg-primary-50 p-3">
          <span className="text-sm font-medium text-primary-700">In Progress</span>
          <span className="font-semibold text-primary-700">{stats.inProgress}</span>
        </div>
        <div className="flex items-center justify-between rounded-md bg-warning-50 p-3">
          <span className="text-sm font-medium text-warning-700">Pending</span>
          <span className="font-semibold text-warning-700">{stats.pending}</span>
        </div>
        <div className="flex items-center justify-between rounded-md bg-error-50 p-3">
          <span className="text-sm font-medium text-error-700">Overdue</span>
          <span className="font-semibold text-error-700">{stats.overdue}</span>
        </div>
      </div>
      
      <div>
        <h3 className="mb-3 text-sm font-medium text-gray-500">Quick Access</h3>
        <div className="space-y-2">
          {quickLinks.map((link, index) => (
            <Link
              key={index}
              to={link.path}
              className="flex items-center rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary-600"
            >
              <span className="mr-2">{link.icon}</span>
              {link.text}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;