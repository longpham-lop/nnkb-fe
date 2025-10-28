import axiosInstance from "./axiosInstance";

const API = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL;

export const getAllEvents = () => 
  axiosInstance.get(`${API}/api/events`);

export const getEventById = (id) => 
  axiosInstance.get(`${API}/api/events/${id}`);

export const searchEvents = (query) => 
  axiosInstance.get(`${API}/api/events/search`, { params: { q: query } });

export const createEvent = (data) => 
  axiosInstance.post(`${API}/api/events`, data);

export const updateEvent = (id, data) => 
  axiosInstance.put(`${API}/api/events/${id}`, data);

export const deleteEvent = (id) => 
  axiosInstance.delete(`${API}/api/events/${id}`);