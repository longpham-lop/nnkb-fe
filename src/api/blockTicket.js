import axiosInstance from "./axiosInstance";

const API = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL;

// Lấy tất cả vé
export const getAllBlockTickets = () =>
  axiosInstance.get(`${API}/api/block-tickets`);

// Lấy vé theo ID
export const getBlockTicketById = (id) =>
  axiosInstance.get(`${API}/api/block-tickets/${id}`);

// Lấy vé theo order
export const getBlockTicketsByOrder = (order_id) =>
  axiosInstance.get(`${API}/api/block-tickets/order/${order_id}`);

// Tạo vé (FE gửi 1 vé hoặc mảng nhiều vé)
export const createBlockTicket = (data) =>
  axiosInstance.post(`${API}/api/block-tickets`, data);

// Cập nhật check-in
export const updateCheckIn = (id, checked_in) =>
  axiosInstance.put(`${API}/api/block-tickets/checkin/${id}`, { checked_in });

// Xóa vé
export const deleteBlockTicket = (id) =>
  axiosInstance.delete(`${API}/api/block-tickets/${id}`);
