import axiosInstance from "./axiosInstance";

const API = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL;

export const getAllipblock = () =>
  axiosInstance.get(`${API}/api/blocked-ips`);


export const blocknow = (data) =>
  axiosInstance.post(`${API}/api/blocked-ips`, data);


