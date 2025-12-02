// src/utils/behavior.js
export const saveEventView = (event) => {
  let history = JSON.parse(localStorage.getItem("view_history")) || [];
  history = [event, ...history.filter(e => e.id !== event.id)].slice(0,20);
  localStorage.setItem("view_history", JSON.stringify(history));
};

export const getEventHistory = () => JSON.parse(localStorage.getItem("view_history")) || [];
