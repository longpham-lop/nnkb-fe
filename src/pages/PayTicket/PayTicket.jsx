import React, { useState, useEffect, useMemo } from 'react'; // <-- Thêm useMemo
import { useLocation, useNavigate } from 'react-router-dom';
import './PayTicket.css'; 
import Voucher from "../../components/Voucher/Voucher.jsx"; // <-- 1. IMPORT MODAL

// --- BẠN SẼ CẦN IMPORT CÁC LOGO NÀY ---
import VnPay from "../../assets/vnpay.png";
import ShopeePay from "../../assets/shoppe.png";
import ZaloPay from "../../assets/zalopay.png";
import Card from "../../assets/card.png";

// Hàm format tiền tệ (cập nhật để xử lý số âm)
const formatCurrency = (amount) => {
    if (amount < 0) {
       return '-' + new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Math.abs(amount));
    }
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};


function PageHeader() { /* ... */ }

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  useEffect(() => {
    if (timeLeft <= 0) return;
    const intervalId = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearInterval(intervalId);
  }, [timeLeft]);
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  return (
    <div className="countdown-timer">
      Hoàn tất đặt vé trong
      <div className="timer-box">
        <span>{String(minutes).padStart(2, '0')}</span> : <span>{String(seconds).padStart(2, '0')}</span>
      </div>
    </div>
  );
}

// Component chính
function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { summary, formData } = location.state || {};
  const [paymentMethod, setPaymentMethod] = useState('vnpay');
  
  // --- 2. THÊM STATE CHO MODAL VÀ VOUCHER ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  
  // Tính toán lại tổng tiền
  const { discountAmount, finalTotalPrice } = useMemo(() => {
    const basePrice = summary?.totalPrice || 0;
    const discount = appliedVoucher?.discount || 0;
    
    return {
      discountAmount: discount,
      finalTotalPrice: basePrice - discount,
    };
  }, [summary, appliedVoucher]);
  // --- KẾT THÚC THÊM STATE ---

  useEffect(() => {
    if (!summary || !formData) {
      navigate('/');
    }
  }, [summary, formData, navigate]);

  // Cập nhật hàm thanh toán để gửi đi giá cuối cùng
  const handlePayment = () => {
    if (paymentMethod === 'vnpay' || paymentMethod === 'zalopay' || paymentMethod === 'shopeepay') {
      navigate('/pay', { 
        state: { 
          summary: {
            ...summary,
            totalPrice: finalTotalPrice, // Gửi giá đã giảm
            discount: discountAmount,
          }, 
          formData, 
          paymentMethod 
        } 
      });
    } else if (paymentMethod === 'card') {
      alert("Chuyển đến trang nhập thông tin thẻ...");
    }
  };

  if (!summary || !formData) {
    return null; 
  }

  const { eventDetails, ticketsInCart } = summary;
  const originalTotalPrice = summary.totalPrice;

  return (
    
    <div className="payment-page">
      <PageHeader />
      <button className="back-btn" onClick={() => navigate(-1)}>
              ← Trở về
      </button>
      <section className="event-banner">
        <div className="event-banner-info">
          <h3>{eventDetails.title}</h3>
          <p>🕒 14:00 - 17:00, 02 Tháng 11, 2025</p>
          <p>📍 {eventDetails.location}</p>
        </div>
        <CountdownTimer />
      </section>

      <div className="payment-page-container">
        <main className="main-payment-content">
          <h3>THANH TOÁN</h3>
          
          <div className="info-section">
            <h4>Thông tin nhận vé</h4>
            <p>
              Vé điện tử sẽ được gửi đến địa chỉ email: <strong>{formData.email}</strong> của tài khoản
            </p>
          </div>

          {/* --- 3. CẬP NHẬT PHẦN KHUYẾN MÃI --- */}
          <div className="info-section">
            <div className="section-header">
              <h4>Mã khuyến mãi</h4>
              <button className="voucher-btn" onClick={() => setIsModalOpen(true)}>
                Chọn voucher
              </button>
            </div>
            
            {appliedVoucher ? (
              <div className="applied-voucher">
                <span className="voucher-name">{appliedVoucher.name}</span>
                <span className="voucher-discount">-{formatCurrency(appliedVoucher.discount)}</span>
                <button className="remove-voucher-btn" onClick={() => setAppliedVoucher(null)}>×</button>
              </div>
            ) : (
              <p className="voucher-text" onClick={() => setIsModalOpen(true)}>
                + Thêm khuyến mãi
              </p>
            )}
          </div>
          {/* --- KẾT THÚC CẬP NHẬT --- */}

          <div className="info-section">
            <h4>Phương thức thanh toán</h4>
            <div className="payment-options">
              {/* ... (Các lựa chọn thanh toán giữ nguyên) ... */}
              <label className="payment-option">
                <input 
                  type="radio" 
                  name="payment" 
                  value="vnpay"
                  checked={paymentMethod === 'vnpay'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>VNPAY/Ứng dụng ngân hàng</span>
                <div className="logos">
                  <img src={VnPay} alt="VNPAY" />
                </div>
              </label>
              <label className="payment-option">
                <input 
                  type="radio" 
                  name="payment" 
                  value="shopeepay"
                  checked={paymentMethod === 'shopeepay'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>ShopeePay</span>
                <div className="logos">
                  <img src={ShopeePay} alt="ShopeePay" />
                </div>
              </label>
              <label className="payment-option">
                <input 
                  type="radio" 
                  name="payment" 
                  value="zalopay"
                  checked={paymentMethod === 'zalopay'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>ZaloPay</span>
                <div className="logos">
                  <img src={ZaloPay} alt="ZaloPay" />
                </div>
              </label>
              <label className="payment-option">
                <input 
                  type="radio" 
                  name="payment" 
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Thẻ ghi nợ/Thẻ tín dụng</span>
                <div className="logos">
                  <img src={Card} alt="Card" />
                </div>
              </label>
            </div>
          </div>
        </main>

        {/* --- 4. CẬP NHẬT SIDEBAR TÓM TẮT --- */}
        <aside className="payment-sidebar">
          <div className="payment-summary-card">
            <div className="summary-header">
              <span>Thông tin đặt vé</span>
              <span className="change-ticket" onClick={() => navigate('/select-ticket')}>Chọn lại vé</span>
            </div>

            <div className="summary-section tickets">
              <div className="ticket-header">
                <span>Loại vé</span>
                <span>Số lượng</span>
              </div>
              {ticketsInCart.map(ticket => (
                <div className="ticket-item-row" key={ticket.id}>
                  <span>{ticket.name}</span>
                  <span>{String(ticket.quantity).padStart(2, '0')}</span>
                </div>
              ))}
            </div>

            <div className="summary-section order">
              <h4>Thông tin đơn hàng</h4>
              <div className="order-row">
                <span>Tạm tính</span>
                <span>{formatCurrency(originalTotalPrice)}</span>
              </div>
              
              {/* Hiển thị giảm giá nếu có */}
              {discountAmount > 0 && (
                <div className="order-row discount">
                  <span>Khuyến mãi</span>
                  <span className="discount-amount">{formatCurrency(-discountAmount)}</span>
                </div>
              )}

              <div className="order-row total">
                <span>Tổng tiền</span>
                <span>{formatCurrency(finalTotalPrice)}</span>
              </div>
            </div>
            
            <p className="legal-text">
              Bằng việc tiếp tục thanh toán, bạn đã đọc và đồng ý với các <a href="#">Điều khoản Dịch vụ</a>
            </p>

            <button className="pay-btn" onClick={handlePayment}>
              Thanh toán
            </button>
          </div>
        </aside>
      </div>

      {/* --- 5. RENDER MODAL (NẾU MỞ) --- */}
      {isModalOpen && (
        <Voucher 
          onClose={() => setIsModalOpen(false)}
          onApply={(voucher) => {
            setAppliedVoucher(voucher);
            setIsModalOpen(false);
          }}
          currentOrderTotal={originalTotalPrice}
        />
      )}
    </div>
  );
}

export default PaymentPage;
