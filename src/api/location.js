import axiosInstance from "./axiosInstance";

const API = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL;

export const getAllLocations = () =>
  axiosInstance.get(`${API}/api/locations`);

export const getLocationById = (id) =>
  axiosInstance.get(`${API}/api/locations/${id}`);

export const createLocation = (data) =>
  axiosInstance.post(`${API}/api/locations`, data);

export const updateLocation = (id, data) =>
  axiosInstance.put(`${API}/api/locations/${id}`, data);

export const deleteLocation = (id) =>
  axiosInstance.delete(`${API}/api/locations/${id}`);
