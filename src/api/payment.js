import axiosInstance from "./axiosInstance";

const API = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL;

export const getAllPayments = () =>
  axiosInstance.get(`${API}/api/payments`);

export const createPayment = (data) =>
  axiosInstance.post(`${API}/api/payments`, data);

export const updatePayment = (id, data) =>
  axiosInstance.put(`${API}/api/payments/${id}`, data);

export const deletePayment = (id) =>
  axiosInstance.delete(`${API}/api/payments/${id}`);
