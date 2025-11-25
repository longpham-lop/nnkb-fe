import axiosInstance from "./axiosInstance";

const API = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL;

export const createvnpay = (data) =>
  axiosInstance.post(`${API}/payment/create_payment_url`, data);


