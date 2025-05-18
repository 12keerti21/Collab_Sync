import React, { useMemo } from 'react';
import { useTask } from '../../contexts/TaskContext';
import { Task } from '../../types';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  BarChart3
} from 'lucide-react';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AnalyticsDashboard: React.FC = () => {
  const { tasks } = useTask();
  
  // Calculate status counts
  const statusCounts = useMemo(() => {
    const counts = {
      pending: 0,
      'in-progress': 0,
      completed: 0,
      cancelled: 0,
    };
    
    tasks.forEach((task) => {
      counts[task.status]++;
    });
    
    return counts;
  }, [tasks]);
  
  // Calculate priority counts
  const priorityCounts = useMemo(() => {
    const counts = {
      low: 0,
      medium: 0,
      high: 0,
    };
    
    tasks.forEach((task) => {
      counts[task.priority]++;
    });
    
    return counts;
  }, [tasks]);
  
  // Calculate overdue tasks
  const overdueTasks = useMemo(() => {
    return tasks.filter(
      (task) => new Date(task.deadline) < new Date() && task.status !== 'completed'
    );
  }, [tasks]);
  
  // Calculate completion rate
  const completionRate = useMemo(() => {
    if (tasks.length === 0) return 0;
    return Math.round((statusCounts.completed / tasks.length) * 100);
  }, [tasks, statusCounts.completed]);
  
  // Data for status distribution chart
  const statusChartData = {
    labels: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
    datasets: [
      {
        data: [
          statusCounts.pending,
          statusCounts['in-progress'],
          statusCounts.completed,
          statusCounts.cancelled,
        ],
        backgroundColor: ['#F59E0B', '#3B82F6', '#10B981', '#6B7280'],
        borderWidth: 0,
      },
    ],
  };
  
  // Data for priority distribution chart
  const priorityChartData = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [
      {
        label: 'Tasks by Priority',
        data: [priorityCounts.high, priorityCounts.medium, priorityCounts.low],
        backgroundColor: ['#EF4444', '#F59E0B', '#3B82F6'],
      },
    ],
  };
  
  // Chart options
  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
    cutout: '70%',
  };
  
  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Completion Rate</p>
              <p className="text-2xl font-bold">{completionRate}%</p>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-success-100 text-success-600">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Completed Tasks</p>
              <p className="text-2xl font-bold">{statusCounts.completed}</p>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-warning-100 text-warning-600">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">In Progress</p>
              <p className="text-2xl font-bold">{statusCounts['in-progress']}</p>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-error-100 text-error-600">
              <AlertTriangle size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Overdue Tasks</p>
              <p className="text-2xl font-bold">{overdueTasks.length}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Task Status Distribution</h2>
          <div className="mx-auto h-64 w-64">
            <Doughnut data={statusChartData} options={doughnutOptions} />
          </div>
        </div>
        
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Tasks by Priority</h2>
          <div className="h-64">
            <Bar data={priorityChartData} options={barOptions} />
          </div>
        </div>
      </div>
      
      {/* Recent Activity Section */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          <BarChart3 size={20} className="text-gray-400" />
        </div>
        
        <div className="space-y-4">
          {tasks
            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            .slice(0, 5)
            .map((task) => (
              <div key={task.id} className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <p className="font-medium">{task.title}</p>
                  <p className="text-sm text-gray-500">
                    {getActivityText(task)}
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
            ))}
        </div>
      </div>
    </div>
  );
};

// Helper function to generate activity text
const getActivityText = (task: Task): string => {
  const actionMap = {
    completed: 'was completed',
    'in-progress': 'is in progress',
    pending: 'is pending',
    cancelled: 'was cancelled',
  };
  
  return `Task ${actionMap[task.status]} on ${new Date(task.updatedAt).toLocaleDateString()}`;
};

const Badge: React.FC<{
  variant: 'success' | 'info' | 'warning' | 'error' | 'default';
  children: React.ReactNode;
}> = ({ variant, children }) => {
  const variantStyles = {
    success: 'bg-success-100 text-success-800',
    info: 'bg-primary-100 text-primary-800',
    warning: 'bg-warning-100 text-warning-800',
    error: 'bg-error-100 text-error-800',
    default: 'bg-gray-100 text-gray-800',
  };
  
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantStyles[variant]}`}
    >
      {children}
    </span>
  );
};

export default AnalyticsDashboard;