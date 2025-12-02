// PaymentPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PayTicket.css";
import Voucher from "../../components/Voucher/Voucher.jsx";
import { ethers } from "ethers"; 
import { createPayment } from "../../api/payment";
import { createvnpay } from "../../api/vnpay.js";

import VnPay from "../../assets/vnpay.png";
import ShopeePay from "../../assets/shoppe.png";
import ZaloPay from "../../assets/zalopay.png";
import Card from "../../assets/card.png";

const formatCurrency = (amount) => {
  if (amount < 0)
    return (
      "-" +
      new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
        Math.abs(amount)
      )
    );
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    amount
  );
};

/* --- Simple PageHeader --- */
function PageHeader() {
  return (
    <header className="payment-header">
      <h2>Thanh toán vé</h2>
    </header>
  );
}

/* --- CountdownTimer --- */
function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(15 * 60);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const intervalId = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="countdown-timer">
      Hoàn tất đặt vé trong
      <div className="timer-box">
        <span>{String(minutes).padStart(2, "0")}</span> :{" "}
        <span>{String(seconds).padStart(2, "0")}</span>
      </div>
    </div>
  );
}

/* ----------------------- PaymentPage (full) ----------------------- */
function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { summary, formData } = location.state || {};
  const [paymentMethod, setPaymentMethod] = useState("vnpay"); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentId, setPaymentId] = useState(null);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const { discountAmount, finalTotalPrice } = useMemo(() => {
  const basePrice = summary?.totalPrice || 0;
  const discount = appliedVoucher?.discount || 0;
    return { discountAmount: discount, finalTotalPrice: basePrice - discount };
  }, [summary, appliedVoucher]);

  useEffect(() => {
    if (!summary || !formData) navigate("/");
  }, [summary, formData, navigate]);

  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts && accounts.length > 0) setWalletAddress(accounts[0]);
      else setWalletAddress(null);
    };

    window.ethereum.request({ method: 'eth_accounts' }).then(handleAccountsChanged).catch(console.error);

    try {
      window.ethereum.on && window.ethereum.on("accountsChanged", handleAccountsChanged);
    } catch {
      // ignore
    }
    return () => {
      try {
        window.ethereum.removeListener &&
          window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      } catch {
        // ignore
      }
    };
  }, []);


  const connectWallet = async () => {
    navigate('/block-lo', {
        state: {
          summary: { ...summary, totalPrice: finalTotalPrice, discount: discountAmount },
          formData,
        }
    });
  };

  const handlePayment = async () => {
  if (!summary || !formData) {
    alert("Thông tin đơn hàng không hợp lệ.");
    return;
  }

  setIsProcessing(true);

  if (paymentMethod === "vnpay") {
        try {
      const paymentDa = { amount: finalTotalPrice, bankCode: "NCB", language: "vn" };
      const res = await createvnpay(paymentDa)
      
      if (res.data.url) {
        window.location.href = res.data.url;
      } else {
        console.error("Không nhận được link:", res.data);
      }
    } catch (err) {
      console.error(err);
      alert("Không thể tạo thanh toán");
    }
  }
    

  try {
    const paymentData = {
      order_id: summary.orderId,  
      method: paymentMethod.toUpperCase(),
      status: "pending",
      transaction_code: "TXN" + Date.now(),  
      paid_at: null,
      total_paid: finalTotalPrice
};

    const res = await createPayment(paymentData);

    if (res.data?.id) {
      setPaymentId(res.data.id);
    }

    if (paymentMethod === "metamask") {
      navigate("/block-lo", {
        state: {
          paymentId: res.data?.id,
          summary: { ...summary, totalPrice: finalTotalPrice, discount: discountAmount },
          formData,
          paymentMethod,
        },
      });
      setIsProcessing(false);
      return;
    }

   
    navigate("/Pay", {
      state: {
        paymentId: res.data?.id,
        summary: { ...summary, totalPrice: finalTotalPrice, discount: discountAmount },
        formData,
        paymentMethod,
      },
    });
  } catch (error) {
    console.error("Lỗi khi tạo thanh toán:", error);
    alert("Không thể tạo thanh toán. Vui lòng thử lại.");
  }

  setIsProcessing(false);
};


  if (!summary || !formData) return null;

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

          <div className="info">
            <h4>Thông tin nhận vé</h4>
            <p>
              Vé điện tử sẽ được gửi đến email: <strong>{user.email}</strong>
            </p>
           
          </div>

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
                <span className="voucher-discount">
                  -{formatCurrency(appliedVoucher.discount)}
                </span>
                <button className="remove-voucher-btn" onClick={() => setAppliedVoucher(null)}>
                  ×
                </button>
              </div>
            ) : (
              <p className="voucher-text" onClick={() => setIsModalOpen(true)}>
                + Thêm khuyến mãi
              </p>
            )}

            {/* --- Lựa chọn Thanh toán --- */}
            <div className="payment-options">
                
              {/* Option MetaMask */}
              
            </div>
          </div>

          <div className="info-section">
            <h4>Phương thức thanh toán khác</h4>
            <div className="payment-options">
              <label className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="vnpay"
                  checked={paymentMethod === "vnpay"}
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
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Mã QR </span>
                <div className="logos">
                  <img src={Card} alt="Card" />
                </div>
              </label>

              <label className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="shopeepay"
                  checked={paymentMethod === "shopeepay"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>ShopeePay (Sẽ sớm cập nhật)</span>
                <div className="logos">
                  <img src={ShopeePay} alt="ShopeePay" />
                </div>
              </label>

              <label className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="zalopay"
                  checked={paymentMethod === "zalopay"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>ZaloPay (Sẽ sớm cập nhật)</span>
                <div className="logos">
                  <img src={ZaloPay} alt="ZaloPay" />
                </div>
              </label>

              
            </div>
          </div>
        </main>

        <aside className="payment-sidebar">
          <div className="payment-summary-card">
            <div className="summary-header">
              <span>Thông tin đặt vé</span>
              <span className="change-ticket" onClick={() => navigate("/select-ticket")}>
                Chọn lại vé
              </span>
            </div>

            <div className="summary-section tickets">
              <div className="ticket-header">
                <span>Loại vé</span>
                <span>Số lượng</span>
              </div>

              {ticketsInCart.map((ticket) => (
                <div className="ticket-item-row" key={ticket.id}>
                  <span>{ticket.name}</span>
                  <span>{String(ticket.quantity).padStart(2, "0")}</span>
                </div>
              ))}
            </div>

            <div className="summary-section order">
              <h4>Thông tin đơn hàng</h4>
              <div className="order-row">
                <span>Tạm tính</span>
                <span>{formatCurrency(originalTotalPrice)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="order-row ">
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
              Bằng việc tiếp tục thanh toán, bạn đã đọc và đồng ý với các{" "}
              <a href="#">Điều khoản Dịch vụ</a>
            </p>
            
            <button
              className="pay-btn"
              onClick={handlePayment}
              disabled={isProcessing}
              style={{ opacity: isProcessing ? 0.7 : 1 }}
            >
              {isProcessing ? "Đang xử lý..." : paymentMethod === "metamask" ? "Tiếp tục tới Blockchain" : "Thanh toán"}
            </button>
          </div>
        </aside>
      </div>

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