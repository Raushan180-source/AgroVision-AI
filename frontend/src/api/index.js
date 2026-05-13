import axios from 'axios'

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL })
const ML_API = axios.create({ baseURL: import.meta.env.VITE_ML_API_URL })

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getProfile: () => API.get('/auth/profile'),
}

export const diseaseAPI = {
  detect: (formData) => ML_API.post('/predict', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getHistory: (page = 1, limit = 20) => API.get(`/predictions/history?page=${page}&limit=${limit}`),
  savePrediction: (data) => API.post('/predictions', data),
}

export const cropAPI = {
  suggest: (data) => API.post('/crops/suggest', data),
  getSoilAnalysis: (data) => API.post('/crops/soil-analysis', data),
}

export const chatAPI = {
  sendMessage: (message) => API.post('/chat', { message }),
}

export const weatherAPI = {
  getWeather: (location) => API.get(`/weather?location=${location}`),
}

export default API
