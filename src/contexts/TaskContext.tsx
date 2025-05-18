import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, Comment, TaskFilter } from '../types';
import { collection, doc, addDoc, updateDoc, deleteDoc, getDocs, query, where, onSnapshot, serverTimestamp, writeBatch } from 'firebase/firestore';
import { db, analytics } from '../firebase';
import { logEvent } from 'firebase/analytics';

interface TaskContextType {
  tasks: Task[];
  comments: Record<string, Comment[]>;
  loading: boolean;
  error: string | null;
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Task>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  getTaskById: (id: string) => Task | undefined;
  getTasksByFilter: (filter: TaskFilter) => Task[];
  addComment: (taskId: string, userId: string, text: string) => Promise<Comment>;
  getCommentsByTaskId: (taskId: string) => Comment[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const tasksCol = collection(db, 'tasks');
    const unsubscribeTasks = onSnapshot(tasksCol, (snapshot) => {
      const tasksData: Task[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          description: data.description,
          createdBy: data.createdBy,
          assignedTo: data.assignedTo,
          clientId: data.clientId,
          deadline: data.deadline ? data.deadline.toDate() : null,
          priority: data.priority,
          status: data.status,
          createdAt: data.createdAt ? data.createdAt.toDate() : null,
          updatedAt: data.updatedAt ? data.updatedAt.toDate() : null,
        };
      });
      setTasks(tasksData);
      setLoading(false);
    }, (err) => {
      setError('Failed to load tasks: ' + err.message);
      setLoading(false);
    });

    const commentsCol = collection(db, 'comments');
    const unsubscribeComments = onSnapshot(commentsCol, (snapshot) => {
      const commentsData: Record<string, Comment[]> = {};
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        const comment: Comment = {
          id: doc.id,
          taskId: data.taskId,
          userId: data.userId,
          text: data.text,
          createdAt: data.createdAt ? data.createdAt.toDate() : null,
        };
        if (!commentsData[comment.taskId]) {
          commentsData[comment.taskId] = [];
        }
        commentsData[comment.taskId].push(comment);
      });
      setComments(commentsData);
    }, (err) => {
      setError('Failed to load comments: ' + err.message);
    });

    return () => {
      unsubscribeTasks();
      unsubscribeComments();
    };
  }, []);

  const createTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, 'tasks'), {
        ...taskData,
        deadline: taskData.deadline || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      const newTask: Task = {
        id: docRef.id,
        ...taskData,
        deadline: taskData.deadline || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      logEvent(analytics, 'create_task', { taskId: docRef.id });
      setLoading(false);
      return newTask;
    } catch (err) {
      setError('Failed to create task');
      setLoading(false);
      throw err;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>): Promise<Task> => {
    setLoading(true);
    try {
      const taskRef = doc(db, 'tasks', id);
      await updateDoc(taskRef, {
        ...updates,
        deadline: updates.deadline || null,
        updatedAt: serverTimestamp(),
      });
      const updatedTask: Task = {
        id,
        ...updates,
        deadline: updates.deadline || null,
        updatedAt: new Date(),
      } as Task;
      logEvent(analytics, 'update_task', { taskId: id });
      setLoading(false);
      return updatedTask;
    } catch (err) {
      setError('Failed to update task');
      setLoading(false);
      throw err;
    }
  };

  const deleteTask = async (id: string): Promise<void> => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'tasks', id));
      const commentsQuery = query(collection(db, 'comments'), where('taskId', '==', id));
      const commentsSnapshot = await getDocs(commentsQuery);
      const batch = writeBatch(db);
      commentsSnapshot.forEach(doc => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      logEvent(analytics, 'delete_task', { taskId: id });
      setLoading(false);
    } catch (err) {
      setError('Failed to delete task');
      setLoading(false);
      throw err;
    }
  };

  const getTaskById = (id: string): Task | undefined => {
    return tasks.find(task => task.id === id);
  };

  const getTasksByFilter = (filter: TaskFilter): Task[] => {
    return tasks.filter(task => {
      if (filter.status && task.status !== filter.status) {
        return false;
      }
      if (filter.priority && task.priority !== filter.priority) {
        return false;
      }
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        if (!task.title.toLowerCase().includes(searchLower) &&
            !task.description.toLowerCase().includes(searchLower)) {
          return false;
        }
      }
      if (filter.dateRange) {
        const taskDate = new Date(task.deadline || '');
        if (taskDate < filter.dateRange.start || taskDate > filter.dateRange.end) {
          return false;
        }
      }
      if (filter.assignedTo && task.assignedTo !== filter.assignedTo) {
        return false;
      }
      if (filter.clientId && task.clientId !== filter.clientId) {
        return false;
      }
      return true;
    });
  };

  const addComment = async (taskId: string, userId: string, text: string): Promise<Comment> => {
    try {
      const docRef = await addDoc(collection(db, 'comments'), {
        taskId,
        userId,
        text,
        createdAt: serverTimestamp(),
      });
      const newComment: Comment = {
        id: docRef.id,
        taskId,
        userId,
        text,
        createdAt: new Date(),
      };
      logEvent(analytics, 'add_comment', { taskId, commentId: docRef.id });
      return newComment;
    } catch (err) {
      setError('Failed to add comment');
      throw err;
    }
  };

  const getCommentsByTaskId = (taskId: string): Comment[] => {
    return comments[taskId] || [];
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        comments,
        loading,
        error,
        createTask,
        updateTask,
        deleteTask,
        getTaskById,
        getTasksByFilter,
        addComment,
        getCommentsByTaskId,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};
