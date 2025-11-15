import axiosInstance from "./axiosInstance";

const API = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL;

export const getAllTransactions = () =>
  axiosInstance.get(`${API}/api/transactions`);

export const getTransactionById = (id) =>
  axiosInstance.get(`${API}/api/transactions/${id}`);

export const createTransaction = (data) =>
  axiosInstance.post(`${API}/api/transactions`, data);

export const updateTransaction = (id, data) =>
  axiosInstance.put(`${API}/api/transactions/${id}`, data);

export const deleteTransaction = (id) =>
  axiosInstance.delete(`${API}/api/transactions/${id}`);
