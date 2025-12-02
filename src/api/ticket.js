import axiosInstance from "./axiosInstance";

const API = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL;

export const getAllTickets = () =>
  axiosInstance.get(`${API}/api/tickets`);

export const getTicketById = (id) =>
  axiosInstance.get(`${API}/api/tickets/${id}`);

export const createTicket = (data) =>
  axiosInstance.post(`${API}/api/tickets`, data);

export const updateTicket = (id, data) =>
  axiosInstance.put(`${API}/api/tickets/${id}`, data);

export const deleteTicket = (id) =>
  axiosInstance.delete(`${API}/api/tickets/${id}`);

export const ti = ({ ticket_id, quantity }) =>
  axiosInstance.put(`${API}/api/tickets/buy`, { ticketId: ticket_id, amount: quantity });


export const buyTicket = async (ticketId, amount) => {
  try {
    const res = await axiosInstance.put(
      `${API}/api/tickets/buy`,
      { ticketId, amount }
    );
    console.log(res.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
  }
};
