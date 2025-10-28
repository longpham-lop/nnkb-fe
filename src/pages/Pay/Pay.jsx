import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Pay.css'; 


import Vnpay from '../../assets/vnpay.png';
import Qrcode from '../../assets/qrcode.png';
// import bankLogos from './path/to/bank-logos.png';


// const logoVnpay = 'https://vnpay.vn/s1/statics.vnpay.vn/logo-vnpay-s1.png';
// const qrCodeImage = 'https://upload.wikimedia.org/wikipedia/commons/d/d7/Commons_QR_code.png';

// Hàm format tiền tệ
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

function Pay() {
  const navigate = useNavigate();
  const location = useLocation();
  const { summary, formData } = location.state || {};

  const [timeLeft, setTimeLeft] = useState(15 * 60); 

  // Hẹn giờ
  useEffect(() => {
    if (timeLeft <= 0) return;
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;


  useEffect(() => {
    if (!summary || !formData) {
      navigate('/');
    }
  }, [summary, formData, navigate]);

  if (!summary) {
    return null; 
  }

  // Dữ liệu giả 
  const orderId = 'A6LTJC0PIM';
  const orderContent = 'PQR7807494661_06071151';

  return (
    
    <div className="gateway-wrapper">
      <button className="back-btn" onClick={() => navigate(-1)}>
              ← Trở về
            </button>
      <div className="gateway-container">
        {/* Header */}
        
        <header className="gateway-header">
          <img src={Vnpay} alt="VNPAY" className="vnpay-logo" />
          <div className="timer-gw">
            <span>{String(minutes).padStart(2, '0')}</span>:
            <span>{String(seconds).padStart(2, '0')}</span>
          </div>
         
        </header>

        {/* Warning */}
        <div className="warning-box">
          Để đảm bảo thanh toán thành công, quý khách vui lòng không đóng trình duyệt web và chờ thông báo từ website.
        </div>

        {/* Main Content */}
        <div className="main-payment-content-gw">
          {/* Cột trái: Thông tin */}
          <div className="order-info-gw">
            <h3>Thông tin đơn hàng</h3>
            <div className="info-row">
              <span>Số tiền thanh toán</span>
              <strong>{formatCurrency(summary.totalPrice)}</strong>
            </div>
            <div className="info-row">
              <span>Mã đơn hàng</span>
              <strong>{orderId}</strong>
            </div>
            <div className="info-row">
              <span>Thời gian</span>
              <strong>{new Date().toLocaleString('vi-VN')}</strong>
            </div>
            <div className="info-row">
              <span>Phí giao dịch</span>
              <strong>gộp</strong>
            </div>
            <div className="info-row">
              <span>Nội dung</span>
              <strong>{orderContent}</strong>
            </div>
            <div className="info-row provider">
              <span>Nhà cung cấp</span>
              <strong>CÔNG TY TNHH TOPTICKET</strong>
            </div>
          </div>
          
          {/* Cột phải: QR Code */}
          <div className="qr-info-gw">
            <h3>Quét mã qua App Ngân hàng<br/>để thanh toán</h3>
            <p>Quét mã để thanh toán</p>
            <img src={Qrcode} alt="QR Code" className="qr-code-img" />
            <a href="#" className="open-app-link">Mở App Bank</a>
          </div>
        </div>
        
        {/* Footer: Bank list */}
        <footer className="bank-list-gw">
          <p>Cảm ơn quý khách đã tin tưởng và sử dụng dịch vụ TOPTICKET, mọi chi tiết xin liên hệ 1900.6868 </p>
     
          <p>Công ty TNHH TOPTICKET</p>
         
        </footer>
      </div>
    </div>
  );
}

export default Pay;