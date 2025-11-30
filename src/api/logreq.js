import axiosInstance from "./axiosInstance";

const API = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL;

export const getAllLog = () =>
  axiosInstance.get(`${API}/api/request-logs`);


