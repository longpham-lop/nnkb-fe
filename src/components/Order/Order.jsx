import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Order.css'; 

// Hàm format tiền tệ (có thể import từ file utils)
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

// Component Header (giống hệt trang trước)
function PageHeader() {
  
}

// Component Hẹn giờ
function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(13 * 60 + 30); // 13:30

  useEffect(() => {
    if (timeLeft <= 0) return;

    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

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

// Component chính của trang
function OrderFormPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy dữ liệu tóm tắt từ trang trước
  const { summary } = location.state || {};

  // State cho form
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
  });
  const [agreed, setAgreed] = useState(false);

  // Nếu không có dữ liệu (ví dụ: gõ URL trực tiếp), quay về trang chọn vé
  useEffect(() => {
    if (!summary) {
      navigate('/OrderTicket');
    }
  }, [summary, navigate]);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Kiểm tra form hợp lệ
  const isFormValid = formData.name && formData.phone && formData.email && agreed;

  const handleContinueToPayment = () => {
    // Gửi cả summary (từ bước 1) và formData (từ bước 2)
    navigate('/payticket', { 
      state: { 
        summary: summary, 
        formData: formData 
      } 
    });
  };

  // Nếu không có summary thì render rỗng để đợi redirect
  if (!summary) {
    return null; 
  }

  const { eventDetails, ticketsInCart, totalPrice } = summary;

  return (
    <div className="form-page">
      <PageHeader />
      
      {/* Banner thông tin sự kiện */}
      <section className="event-banner">
        <div className="event-banner-info">
          <h3>{eventDetails.title}</h3>
          <p>🕒 14:00 - 17:00, 02 Tháng 11, 2025</p>
          <p>📍 {eventDetails.location}</p>
        </div>
        <CountdownTimer />
      </section>

      {/* Nội dung chính */}
      <div className="form-page-container">
        {/* Cột Form (Bên trái) */}
        <main className="main-form-content">
          <h3>BẢNG CÂU HỎI</h3>
          <form className="info-form">
            <div className="form-group">
              <label>Họ và Tên (Dùng để xuất hóa đơn)</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name}
                onChange={handleChange}
                placeholder="Điền câu trả lời của bạn" 
              />
            </div>
            <div className="form-group">
              <label>Số điện thoại (Dùng để xuất hóa đơn)</label>
              <input 
                type="text" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Điền câu trả lời của bạn"
              />
            </div>
            <div className="form-group">
              <label>Email (Dùng để xuất hóa đơn)</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Điền câu trả lời của bạn"
              />
            </div>
            <div className="form-group-checkbox">
              <input 
                type="checkbox" 
                id="agree" 
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <label htmlFor="agree">
                Tôi đồng ý ticketbox & BTC sử dụng thông tin đặt vé nhằm mục đích vận hành sự kiện và xuất hóa đơn.
                <span>Tôi đồng ý</span>
              </label>
            </div>
          </form>
        </main>

        {/* Cột Sidebar (Bên phải) */}
        <aside className="form-sidebar">
          <div className="form-summary-card">
            <div className="summary-tabs">
              <span className="tab-active">Thông tin đặt vé</span>
              <span className="tab-inactive" onClick={() => navigate(-1)}>Chọn lại vé</span>
            </div>

            <div className="summary-section">
              {ticketsInCart.map(ticket => (
                <div className="summary-item" key={ticket.id}>
                  <span>{ticket.name} (x{ticket.quantity})</span>
                  <span>{formatCurrency(ticket.price * ticket.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="summary-section total">
              <span>Tạm tính {summary.totalItems} vé</span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>
            
            {!isFormValid && (
              <p className="form-note">
                Vui lòng trả lời câu hỏi để tiếp tục
              </p>
            )}

            <button className="continue-btn-form" disabled={!isFormValid} onClick={handleContinueToPayment}>
              Tiếp tục ❯
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default OrderFormPage;