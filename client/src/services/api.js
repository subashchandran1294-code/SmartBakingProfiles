import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// Add token to requests
API.interceptors.request.use((req) => {
  if (localStorage.getItem('user')) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('user')).token}`;
  }
  return req;
});

// Auth API calls
export const login = (formData) => API.post('/auth/login', formData);
export const register = (formData) => API.post('/auth/register', formData);

// Profile API calls
export const getPublicProfile = (username) => API.get(`/profile/${username}`);
export const getPublicCategory = (username, categorySlug) => API.get(`/profile/${username}/${categorySlug}`);

// Categories API calls
export const createCategory = (categoryData) => API.post('/categories', categoryData);
export const getUserCategories = () => API.get('/categories');

// Posts API calls
export const createPost = (postData) => API.post('/posts', postData);
export const getUserPosts = () => API.get('/posts');

export default API;
