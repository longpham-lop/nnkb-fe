import axios from "axios";

const API = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL;

const getToken = () => localStorage.getItem("token");

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


// (admin only)
export const getAllUsers = () => {
  return axios.get(`${API}/api/users`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${getToken()}`,
    }
  });
};

export const updateUser = (userId, data) => {
  return axios.put(`${API}/api/users/${userId}`, data, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${getToken()}`,
    }
  });
};

export const deleteUser = (userId) => {
  return axios.delete(`${API}/api/users/${userId}`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${getToken()}`,
    }
  });
};