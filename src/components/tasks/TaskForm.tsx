import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTask } from '../../contexts/TaskContext';
import { useAuth } from '../../contexts/AuthContext';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Task } from '../../types';
import { format } from 'date-fns';

type FormValues = {
  title: string;
  description: string;
  deadline: string;
  priority: Task['priority'];
  status: Task['status'];
  assignedTo: string;
  clientId: string;
};

type Client = {
  id: string;
  name: string;
};

const TaskForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getTaskById, createTask, updateTask, loading } = useTask();
  const { user } = useAuth();

  const isEditMode = !!id;

  const [formValues, setFormValues] = useState<FormValues>({
    title: '',
    description: '',
    deadline: format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    priority: 'medium',
    status: 'pending',
    assignedTo: '',
    clientId: '',
  });

  const [clients, setClients] = useState<Client[]>([]);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormValues, string>>>({});

  useEffect(() => {
    if (isEditMode) {
      const task = getTaskById(id);
      if (task) {
        setFormValues({
          title: task.title,
          description: task.description,
          deadline: format(new Date(task.deadline), 'yyyy-MM-dd'),
          priority: task.priority,
          status: task.status,
          assignedTo: task.assignedTo,
          clientId: task.clientId,
        });
      } else {
        navigate('/tasks');
      }
    }
  }, [isEditMode, id, getTaskById, navigate]);

  useEffect(() => {
    // Fetch clients from Firestore if user is provider
    const fetchClients = async () => {
      if (user?.role === 'provider') {
        try {
          const q = query(collection(db, 'users'), where('role', '==', 'client'));
          const querySnapshot = await getDocs(q);
          const clientsList: Client[] = [];
          querySnapshot.forEach((doc) => {
            clientsList.push({ id: doc.id, name: doc.data().name });
          });
          setClients(clientsList);
        } catch (error) {
          console.error('Failed to fetch clients:', error);
        }
      }
    };
    fetchClients();
  }, [user]);

  const validateForm = () => {
    const errors: Partial<Record<keyof FormValues, string>> = {};

    if (!formValues.title.trim()) {
      errors.title = 'Title is required';
    }

    if (!formValues.description.trim()) {
      errors.description = 'Description is required';
    }

    if (!formValues.deadline) {
      errors.deadline = 'Deadline is required';
    } else if (new Date(formValues.deadline) < new Date()) {
      errors.deadline = 'Deadline cannot be in the past';
    }

    if (user?.role === 'provider' && !formValues.clientId) {
      errors.clientId = 'Please select a client to assign the task';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (isEditMode) {
        await updateTask(id, {
          title: formValues.title,
          description: formValues.description,
          deadline: new Date(formValues.deadline),
          priority: formValues.priority,
          status: formValues.status,
          assignedTo: formValues.clientId,
          clientId: formValues.clientId,
        });
      } else {
        await createTask({
          title: formValues.title,
          description: formValues.description,
          deadline: new Date(formValues.deadline),
          priority: formValues.priority,
          status: formValues.status,
          createdBy: user?.id || '',
          assignedTo: formValues.clientId,
          clientId: formValues.clientId,
        });
      }
      navigate('/tasks');
    } catch (error) {
      console.error('Failed to save task:', error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 md:col-span-2">
          <Input
            label="Task Title"
            id="title"
            name="title"
            value={formValues.title}
            onChange={handleChange}
            placeholder="Enter task title"
            error={formErrors.title}
            required
          />

          <div>
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formValues.description}
              onChange={handleChange}
              placeholder="Enter task description"
              className={`form-input ${
                formErrors.description ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''
              }`}
              required
            />
            {formErrors.description && <p className="form-error">{formErrors.description}</p>}
          </div>
        </div>

        <div>
          <Input
            label="Deadline"
            type="date"
            id="deadline"
            name="deadline"
            value={formValues.deadline}
            onChange={handleChange}
            error={formErrors.deadline}
            required
          />
        </div>

        <div>
          <label htmlFor="priority" className="form-label">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formValues.priority}
            onChange={handleChange}
            className="form-input"
            required
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {user?.role === 'provider' && (
          <div>
            <label htmlFor="clientId" className="form-label">
              Assign to Client
            </label>
            <select
              id="clientId"
              name="clientId"
              value={formValues.clientId}
              onChange={handleChange}
              className={`form-input ${formErrors.clientId ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
              required
            >
              <option value="">Select a client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
            {formErrors.clientId && <p className="form-error">{formErrors.clientId}</p>}
          </div>
        )}

        {isEditMode && (
          <div>
            <label htmlFor="status" className="form-label">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formValues.status}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/tasks')}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={loading}
        >
          {isEditMode ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
