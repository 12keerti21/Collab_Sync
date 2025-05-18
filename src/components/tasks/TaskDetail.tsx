import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTask } from '../../contexts/TaskContext';
import { useAuth } from '../../contexts/AuthContext';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Avatar from '../ui/Avatar';
import { 
  Clock, 
  Calendar, 
  User, 
  MessageSquare, 
  Edit,
  ArrowLeft,
  Send
} from 'lucide-react';
import { format } from 'date-fns';
import { Task, Comment } from '../../types';

const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTaskById, getCommentsByTaskId, addComment, updateTask } = useTask();
  const { user } = useAuth();
  
  const [task, setTask] = useState<Task | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (id) {
      const taskData = getTaskById(id);
      if (taskData) {
        setTask(taskData);
        setComments(getCommentsByTaskId(id));
      } else {
        navigate('/tasks');
      }
    }
  }, [id, getTaskById, getCommentsByTaskId, navigate]);
  
  if (!task) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary-600"></div>
        <span className="ml-2">Loading task details...</span>
      </div>
    );
  }
  
  const handleStatusChange = async (newStatus: Task['status']) => {
    if (!id) return;
    
    try {
      const updatedTask = await updateTask(id, { status: newStatus });
      setTask(updatedTask);
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };
  
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim() || !user || !id) return;
    
    setIsLoading(true);
    try {
      const comment = await addComment(id, user.id, newComment);
      setComments((prev) => [...prev, comment]);
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const getPriorityBadge = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return <Badge variant="error">High Priority</Badge>;
      case 'medium':
        return <Badge variant="warning">Medium Priority</Badge>;
      case 'low':
        return <Badge variant="info">Low Priority</Badge>;
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
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <Link to="/tasks" className="mb-2 inline-flex items-center text-sm text-gray-500 hover:text-primary-600">
            <ArrowLeft size={16} className="mr-1" />
            Back to Tasks
          </Link>
          <h1 className="text-2xl font-bold">{task.title}</h1>
        </div>
        
        <div className="flex items-center gap-2">
          {user?.role === 'provider' && (
            <Link to={`/tasks/${id}/edit`}>
              <Button variant="outline" size="sm" leftIcon={<Edit size={16} />}>
                Edit Task
              </Button>
            </Link>
          )}
          {user?.role === 'client' && task.status !== 'completed' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleStatusChange('completed')}
            >
              Mark as Completed
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Description</h2>
            <p className="whitespace-pre-line text-gray-700">{task.description}</p>
          </div>
          
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                Comments ({comments.length})
              </h2>
            </div>
            
            {comments.length === 0 ? (
              <div className="py-4 text-center text-gray-500">
                No comments yet. Be the first to comment!
              </div>
            ) : (
              <div className="mb-6 space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="border-b border-gray-100 pb-4 last:border-0">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar
                          src={
                            comment.userId === '1'
                              ? 'https://randomuser.me/api/portraits/men/32.jpg'
                              : 'https://randomuser.me/api/portraits/women/44.jpg'
                          }
                          size="sm"
                        />
                        <div className="ml-2">
                          <p className="font-medium">
                            {comment.userId === '1' ? 'John Provider' : 'Jane Client'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {format(new Date(comment.createdAt), 'MMM d, yyyy • h:mm a')}
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700">{comment.text}</p>
                  </div>
                ))}
              </div>
            )}
            
            <form onSubmit={handleSubmitComment} className="mt-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="form-input flex-1"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  disabled={!newComment.trim() || isLoading}
                  isLoading={isLoading}
                  leftIcon={<Send size={16} />}
                >
                  Send
                </Button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-medium">Task Details</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                  <Calendar size={14} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Created</p>
                  <p>{format(new Date(task.createdAt), 'MMM d, yyyy')}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                  <Clock size={14} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Deadline</p>
                  <p>{format(new Date(task.deadline), 'MMM d, yyyy')}</p>
                  {new Date(task.deadline) < new Date() && task.status !== 'completed' && (
                    <span className="text-sm text-error-600">Overdue</span>
                  )}
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                  <User size={14} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Assigned To</p>
                  <p>Jane Client</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                  <MessageSquare size={14} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Comments</p>
                  <p>{comments.length}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-medium">Status</h3>
            <div className="mb-2">{getStatusBadge(task.status)}</div>
            
            {user?.role === 'client' && task.status !== 'completed' && (
              <div className="mt-4">
                <Button
                  variant="primary"
                  size="sm"
                  fullWidth
                  onClick={() => handleStatusChange('completed')}
                >
                  Mark as Completed
                </Button>
              </div>
            )}
            
            {user?.role === 'provider' && (
              <div className="mt-4 space-y-2">
                <p className="mb-2 text-sm font-medium">Update Status:</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={task.status === 'pending' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handleStatusChange('pending')}
                  >
                    Pending
                  </Button>
                  <Button
                    variant={task.status === 'in-progress' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handleStatusChange('in-progress')}
                  >
                    In Progress
                  </Button>
                  <Button
                    variant={task.status === 'completed' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handleStatusChange('completed')}
                  >
                    Completed
                  </Button>
                  <Button
                    variant={task.status === 'cancelled' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handleStatusChange('cancelled')}
                  >
                    Cancelled
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-medium">Priority</h3>
            <div>{getPriorityBadge(task.priority)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;