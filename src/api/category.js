import axiosInstance from "./axiosInstance";

const API = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL;

export const getAllCategories = () =>
  axiosInstance.get(`${API}/api/categories`);

export const getCategoryById = (id) =>
  axiosInstance.get(`${API}/api/categories/${id}`);

export const searchCategories = (query) =>
  axiosInstance.get(`${API}/api/categories/search`, { params: { q: query } });

export const createCategory = (data) =>
  axiosInstance.post(`${API}/api/categories`, data);

export const updateCategory = (id, data) =>
  axiosInstance.put(`${API}/api/categories/${id}`, data);

export const deleteCategory = (id) =>
  axiosInstance.delete(`${API}/api/categories/${id}`);
