import React, { useState, useEffect } from 'react';
import { Task } from '@/lib/mockDb';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | Task['status']>('all');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending' as Task['status'],
  });

  // Edit mode
  const [editingId, setEditingId] = useState<string | null>(null);

  // Fetch tasks
  const fetchTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const url = filter === 'all' 
        ? '/api/tasks' 
        : `/api/tasks?status=${filter}`;
      
      const response = await fetch(url);
      const result = await response.json();

      if (result.success) {
        setTasks(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  // Create task
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setFormData({ title: '', description: '', status: 'pending' });
        fetchTasks();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to create task');
    }
  };

  // Update task
  const handleUpdate = async (id: string, updates: Partial<Task>) => {
    setError('');

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      const result = await response.json();

      if (result.success) {
        fetchTasks();
        setEditingId(null);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to update task');
    }
  };

  // Delete task
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    setError('');

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        fetchTasks();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  // Get status badge color
  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Task Management System
        </h1>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Create Task Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Create New Task</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as Task['status'],
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Create Task
            </button>
          </form>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            All Tasks
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'pending'
                ? 'bg-yellow-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('in-progress')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'in-progress'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'completed'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Completed
          </button>
        </div>

        {/* Tasks List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">
              Tasks ({tasks.length})
            </h2>
            <button
              onClick={fetchTasks}
              className="text-blue-600 hover:text-blue-800 font-medium"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>

          {tasks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No tasks found. Create one to get started!
            </p>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {task.title}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        task.status
                      )}`}
                    >
                      {task.status}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-3">{task.description}</p>

                  <div className="text-sm text-gray-500 mb-3">
                    Created: {new Date(task.createdAt).toLocaleDateString()} •
                    Updated: {new Date(task.updatedAt).toLocaleDateString()}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {task.status !== 'in-progress' && (
                      <button
                        onClick={() =>
                          handleUpdate(task.id, { status: 'in-progress' })
                        }
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm font-medium"
                      >
                        Start
                      </button>
                    )}
                    {task.status !== 'completed' && (
                      <button
                        onClick={() =>
                          handleUpdate(task.id, { status: 'completed' })
                        }
                        className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-sm font-medium"
                      >
                        Complete
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
