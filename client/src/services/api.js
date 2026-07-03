import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  googleAuth: (credential) => api.post('/auth/google', { credential }),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post(`/auth/reset-password/${token}`, { password }),
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.post('/upload/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export const nasaAPI = {
  getAPOD: () => api.get('/nasa/apod'),
  getMarsPhotos: (params) => api.get('/nasa/mars-photos', { params }),
  getAsteroids: (params) => api.get('/nasa/asteroids', { params }),
  getEarthImagery: (params) => api.get('/nasa/earth-imagery', { params }),
  search: (params) => api.get('/nasa/search', { params }),
};

export const favoritesAPI = {
  getAll: () => api.get('/favorites'),
  add: (data) => api.post('/favorites', data),
  remove: (id) => api.delete(`/favorites/${id}`),
  check: (nasaId) => api.get(`/favorites/check/${nasaId}`),
};

export const journalAPI = {
  getAll: () => api.get('/journal'),
  create: (data) => api.post('/journal', data),
  update: (id, data) => api.put(`/journal/${id}`, data),
  delete: (id) => api.delete(`/journal/${id}`),
  search: (params) => api.get('/journal/search', { params }),
};

export const chatAPI = {
  sendMessage: (data) => api.post('/chat/message', data),
  explainImage: (data) => api.post('/chat/explain', data),
  getHistory: (sessionId) => api.get(`/chat/history/${sessionId}`),
  getSessions: () => api.get('/chat/sessions'),
};

export const moonAPI = {
  getPhase: (params) => api.get('/moon/phase', { params }),
};

export const issAPI = {
  getPosition: () => api.get('/iss/position'),
  getPositions: (params) => api.get('/iss/positions', { params }),
};

export const exoplanetAPI = {
  getAll: (params) => api.get('/exoplanets', { params }),
};

export const solarAPI = {
  getFlares: () => api.get('/solar/flares'),
  getCMEs: () => api.get('/solar/cmes'),
  getGSTs: () => api.get('/solar/gsts'),
};

export const newsAPI = {
  getAll: (params) => api.get('/news', { params }),
  getById: (id) => api.get(`/news/${id}`),
};

export default api;
