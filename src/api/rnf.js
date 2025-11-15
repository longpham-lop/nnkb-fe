import axiosInstance from "./axiosInstance";

const API = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL;

/* -------------------- Reviews -------------------- */

export const getAllReviews = () =>
  axiosInstance.get(`${API}/api/rnf/reviews`);

export const createReview = (data) =>
  axiosInstance.post(`${API}/api/rnf/reviews`, data);

export const updateReview = (id, data) =>
  axiosInstance.put(`${API}/api/rnf/reviews/${id}`, data);

export const deleteReview = (id) =>
  axiosInstance.delete(`${API}/api/rnf/reviews/${id}`);

/* ----------------- Notifications ----------------- */

export const getAllNotifications = () =>
  axiosInstance.get(`${API}/api/rnf/notifications`);

export const createNotification = (data) =>
  axiosInstance.post(`${API}/api/rnf/notifications`, data);

export const markNotificationAsRead = (id) =>
  axiosInstance.put(`${API}/api/rnf/notifications/${id}/read`);

export const deleteNotification = (id) =>
  axiosInstance.delete(`${API}/api/rnf/notifications/${id}`);

/* -------------------- Favorites -------------------- */

export const getFavoritesByUser = (userId) =>
  axiosInstance.get(`${API}/api/rnf/favorites/${userId}`);

export const addFavorite = (data) =>
  axiosInstance.post(`${API}/api/rnf/favorites`, data);

export const removeFavorite = (id) =>
  axiosInstance.delete(`${API}/api/rnf/favorites/${id}`);
