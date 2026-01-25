import { BASE_URL } from '../config/apiConfig';

// Get token from localStorage
export const getToken = () => {
  return localStorage.getItem('token');
};

// Get auth headers
export const getAuthHeaders = () => {
  const token = getToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Task API functions
export const taskAPI = {
  // Get all tasks with optional filters
  getTasks: async (searchTerm = '', timePeriod = 'week') => {
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (timePeriod) params.append('timePeriod', timePeriod);

    const response = await fetch(`${BASE_URL}/api/tasks?${params.toString()}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }

    return response.json();
  },

  // Create a new task
  createTask: async (taskData) => {
    const response = await fetch(`${BASE_URL}/api/tasks`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(taskData)
    });

    if (!response.ok) {
      throw new Error('Failed to create task');
    }

    return response.json();
  },

  // Update task status
  updateTaskStatus: async (taskId, status) => {
    const response = await fetch(`${BASE_URL}/api/tasks/${taskId}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      throw new Error('Failed to update task status');
    }

    return response.json();
  },

  // Update entire task
  updateTask: async (taskId, taskData) => {
    const response = await fetch(`${BASE_URL}/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(taskData)
    });

    if (!response.ok) {
      throw new Error('Failed to update task');
    }

    return response.json();
  },

  // Delete a task
  deleteTask: async (taskId) => {
    const response = await fetch(`${BASE_URL}/api/tasks/${taskId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to delete task');
    }

    return response.json();
  }
};
