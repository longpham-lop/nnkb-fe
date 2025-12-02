import React from 'react';
import './PaymentSelection.css'; 
import { FaCreditCard, FaBitcoin, FaArrowLeft } from 'react-icons/fa6'; 
import { createPayment } from "../../api/payment";

import { useNavigate } from 'react-router-dom';
import { createOrderItem } from '../../api/orderitem';
import { ti } from '../../api/ticket';

const PaymentSelection = () => {
  const navigate = useNavigate();
  const olderid = localStorage.getItem("oderid")
  const params = new URLSearchParams(window.location.search);

  const orderId = params.get("id");

  const ticketsInCart = JSON.parse(localStorage.getItem("ticketsInCart") || "[]");

  const totalPrice = ticketsInCart.reduce((sum, t) => {
    return sum + t.price * t.quantity;
  }, 0);

  const handleSelection = async (type) => {
    try {
      const paymentData = {
        order_id: olderid,
        method: "vnpay",
        status: "pending",
        transaction_code: "TXN" + Date.now() + orderId,
        paid_at: null,
        total_paid: totalPrice,
      };
      

      const res = await createPayment(paymentData);

      const createPromises = ticketsInCart.map((ticket) => {
          return ti({ ticket_id: ticket.id, quantity: ticket.quantity });
        });
        await Promise.all(createPromises);

      if (type === "traditional") {
        alert("Vé sẽ được gửi vào mail hoặc trong vé đã mua");

        const createPromises = ticketsInCart.map((ticket) => {
          const itemData = {
            order_id: Number(olderid),
            ticket_id: ticket.id,          
            quantity: ticket.quantity,    
            unit_price: ticket.price       
          };

          return createOrderItem(itemData);
        });

        await Promise.all(createPromises);

        navigate("/home");
      } 
      
      else {
        navigate("/block-lo");
      }

    } catch (err) {
      console.error("Lỗi khi thanh toán:", err);
      alert("Có lỗi xảy ra khi xử lý đơn hàng");
    }
  };

  return (
    <div className="payment-gateway-container">
      <div className="gateway-header">
        <h2>Chọn loại vé </h2>
        <p>Vui lòng chọn loại vé để hoàn tất đơn hàng</p>
      </div>

      <div className="payment-options-wrapper">
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

      <button className="btn-back" onClick={() => navigate('/block-lo')}>
        <span style={{ marginRight: '8px' }}><FaArrowLeft /></span> Quay lại
      </button>
    </div>
  );
};

export default PaymentSelection;