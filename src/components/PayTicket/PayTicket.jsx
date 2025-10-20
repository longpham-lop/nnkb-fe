import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PayTicket.css'; 

// --- BẠN SẼ CẦN IMPORT CÁC LOGO NÀY ---
// import logoVnPay from './path/to/vnpay.png';
// import logoVietQR from './path/to/vietqr.png';
// import logoShopeePay from './path/to/shopeepay.png';
// import logoZaloPay from './path/to/zalopay.png';
// import logoVisa from './path/to/visa.png';
// import logoMastercard from './path/to/mastercard.png';
// import logoJCB from './path/to/jcb.png';

// Hàm format tiền tệ
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

// Component Header (giống hệt trang trước)
function PageHeader() {
  return (
    <header className="page-header">
      <div className="logo">ticketbox</div>
      <nav className="nav-links">
        <a href="#">Về Của tôi</a>
        <a href="#">Tài khoản</a>
      </nav>
    </header>
  );
}

// Component Hẹn giờ (giống hệt trang trước)
function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(15* 60 ); 

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
function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy dữ liệu từ 2 trang trước
  const { summary, formData } = location.state || {};

  // State cho phương thức thanh toán
  const [paymentMethod, setPaymentMethod] = useState('vnpay');

  // Nếu không có dữ liệu, quay về trang chủ
  useEffect(() => {
    if (!summary || !formData) {
      navigate('/');
    }
  }, [summary, formData, navigate]);

  if (!summary || !formData) {
    return null; // Render rỗng trong khi chờ redirect
  }

  const { eventDetails, ticketsInCart, totalPrice } = summary;

  return (
    <div className="payment-page">
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
      <div className="payment-page-container">
        {/* Cột Form (Bên trái) */}
        <main className="main-payment-content">
          <h3>THANH TOÁN</h3>
          
          <div className="info-section">
            <h4>Thông tin nhận vé</h4>
            <p>
              Vé điện tử sẽ được gửi đến địa chỉ email: <strong>{formData.email}</strong> của tài khoản
            </p>
          </div>

          <div className="info-section">
            <div className="section-header">
              <h4>Mã khuyến mãi</h4>
              <button className="voucher-btn">Chọn voucher</button>
            </div>
            <p className="voucher-text">+ Thêm khuyến mãi</p>
          </div>

          <div className="info-section">
            <h4>Phương thức thanh toán</h4>
            <div className="payment-options">
              {/* Option 1 */}
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
                  {/* <img src={logoVnPay} alt="VNPAY" /> */}
                  {/* <img src={logoVietQR} alt="VietQR" /> */}
                </div>
              </label>
              {/* Option 2 */}
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
                  {/* <img src={logoShopeePay} alt="ShopeePay" /> */}
                </div>
              </label>
              {/* Option 3 */}
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
                  {/* <img src={logoZaloPay} alt="ZaloPay" /> */}
                </div>
              </label>
              {/* Option 4 */}
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
                  {/* <img src={logoVisa} alt="Visa" /> */}
                  {/* <img src={logoMastercard} alt="Mastercard" /> */}
                  {/* <img src={logoJCB} alt="JCB" /> */}
                </div>
              </label>
            </div>
          </div>
        </main>

        {/* Cột Sidebar (Bên phải) */}
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
                <span>{formatCurrency(totalPrice)}</span>
              </div>
              <div className="order-row total">
                <span>Tổng tiền</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
            </div>
            
            <p className="legal-text">
              Bằng việc tiếp tục thanh toán, bạn đã đọc và đồng ý với các <a href="#">Điều khoản Dịch vụ</a>
            </p>

            <button className="pay-btn">
              Thanh toán
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default PaymentPage;