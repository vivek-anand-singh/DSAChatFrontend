import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth services
export const register = (username, email, password) => {
  return api.post('/auth/register', { username, email, password });
};

export const login = (email, password) => {
  return api.post('/auth/login', { email, password });
};

export const getCurrentUser = () => {
  return api.get('/auth/user');
};

// Chat services
export const sendMessage = (message, conversationId = null) => {
  return api.post('/gemini/message', { message, conversationId });
};

export const getConversations = () => {
  return api.get('/gemini/conversations');
};

export const getConversation = (id) => {
  return api.get(`/gemini/conversations/${id}`);
};

export const deleteConversation = (id) => {
  return api.delete(`/gemini/conversations/${id}`);
};

export default api; 