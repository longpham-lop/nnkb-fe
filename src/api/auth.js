import axios from "axios";

const API = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL;

export const register = (data) => {
  return axios.post(`${API}/api/users/register`, data, { withCredentials: true });
};

export const login = (data) => {
  return axios.post(`${API}/api/users/login`, data, { withCredentials: true });
};

export const logout = () => {
  return axios.post(`${API}/api/users/logout`, {}, { withCredentials: true });
};

export const refresh = () => {
  return axios.post(`${API}/api/users/refresh`, {}, { withCredentials: true });
};
