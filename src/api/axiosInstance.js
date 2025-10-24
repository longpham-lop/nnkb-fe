import axios from "axios";

const API = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL;

const axiosInstance = axios.create({
  baseURL: API,
  withCredentials: true, 
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
