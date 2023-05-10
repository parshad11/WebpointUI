import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:8000/api/webpoint'

axios.interceptors.request.use(config => {
    const token = 'thisistherequiredtoken';
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, error => {
    return Promise.reject(error);
  });