import axiosInstance from "./axiosInstance";

const API = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL;

export const getAllOrders = () =>
  axiosInstance.get(`${API}/api/orders`);

export const getOrderById = (id) =>
  axiosInstance.get(`${API}/api/orders/${id}`);

export const createOrder = (data) =>
  axiosInstance.post(`${API}/api/orders`, data);

export const updateOrder = (id, data) =>
  axiosInstance.put(`${API}/api/orders/${id}`, data);

export const deleteOrder = (id) =>
  axiosInstance.delete(`${API}/api/orders/${id}`);

