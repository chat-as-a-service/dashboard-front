import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_GENERAL_API_URL,
  timeout: 20000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (axiosInstance.defaults.headers.common['Authorization'] == null) {
      const accessToken = localStorage.getItem('accessToken');

      if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axiosInstance;
