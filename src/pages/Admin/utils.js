// src/pages/Admin/Utils.js

/**
 * Định dạng ngày tháng (VD: '2025-12-01' -> '01/12/2025')
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

/**
 * Định dạng tiền tệ (VD: 100000 -> '100.000 VND')
 */
export const formatCurrency = (amount, currency = 'VND') => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: currency 
  }).format(amount);
};