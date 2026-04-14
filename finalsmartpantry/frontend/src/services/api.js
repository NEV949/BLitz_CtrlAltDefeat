import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('smartpantry-token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const registerUser = async (payload) => {
  const { data } = await api.post('/auth/register', payload);
  return data;
};

export const loginUser = async (payload) => {
  const { data } = await api.post('/auth/login', payload);
  return data;
};

export const fetchProfile = async () => {
  const { data } = await api.get('/auth/me');
  return data;
};

export const savePantry = async (pantry) => {
  const { data } = await api.put('/pantry', { pantry });
  return data;
};

export const recommendRecipes = async (ingredients) => {
  const { data } = await api.post('/recipes/recommend', { ingredients });
  return data;
};

export default api;
