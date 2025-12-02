import axiosInstance from "./axiosInstance";

const API = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL;

export const getAllOrderItems = () =>
  axiosInstance.get(`${API}/api/order-items`);

export const getOrderItemById = (id) =>
  axiosInstance.get(`${API}/api/order-items/${id}`);

export const createOrderItem = (data) =>
  axiosInstance.post(`${API}/api/order-items`, data);

export const updateOrderItem = (id, data) =>
  axiosInstance.put(`${API}/api/order-items/${id}`, data);

export const deleteOrderItem = (id) =>
  axiosInstance.delete(`${API}/api/order-items/${id}`);

export const getwhoOrderItems = () =>
  axiosInstance.get(`${API}/api/order-items/who`);

