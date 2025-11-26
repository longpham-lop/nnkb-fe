import React from 'react';
import './PaymentSelection.css'; 
import { FaCreditCard, FaBitcoin, FaArrowLeft } from 'react-icons/fa6'; 

import { useNavigate } from 'react-router-dom';

const PaymentSelection = () => {
  const navigate = useNavigate();

  const handleSelection = (type) => {
    if (type === 'traditional') {
      console.log('User selected Traditional Payment');
      // Logic điều hướng đến cổng VNPAY/Momo
      // navigate('/checkout/fiat');
      alert('Đang chuyển hướng sang cổng thanh toán Ngân hàng...');
    } else {
      console.log('User selected Blockchain Payment');
      // Logic điều hướng đến trang kết nối ví Metamask
      // navigate('/checkout/crypto');
      alert('Đang mở kết nối ví Web3...');
    }
  };

  return (
    <div className="payment-gateway-container">
      <div className="gateway-header">
        <h2>Chọn phương thức thanh toán</h2>
        <p>Vui lòng chọn cổng giao dịch để hoàn tất đơn hàng</p>
      </div>

      <div className="payment-options-wrapper">
        {/* Card 1: Thanh toán truyền thống */}
        <div 
          className="payment-card traditional"
          onClick={() => handleSelection('traditional')}
        >
          <div className="card-icon">
            <FaCreditCard />
          </div>
          <div className="card-title">Thanh toán Thường</div>
          <div className="card-desc">
            Thẻ ATM nội địa, Visa, Mastercard, VNPAY hoặc ví điện tử Momo.
          </div>
        </div>

        {/* Card 2: Blockchain */}
        <div 
          className="payment-card blockchain"
          onClick={() => handleSelection('blockchain')}
        >
          <div className="card-icon">
            <FaBitcoin />
          </div>
          <div className="card-title">Crypto / Blockchain</div>
          <div className="card-desc">
            Thanh toán ẩn danh, an toàn qua ví Web3 (Metamask). Hỗ trợ USDT, ETH.
          </div>
        </div>
      </div>

      <button className="btn-back" onClick={() => navigate(-1)}>
        <span style={{ marginRight: '8px' }}><FaArrowLeft /></span> Quay lại
      </button>
    </div>
  );
};

export default PaymentSelection;