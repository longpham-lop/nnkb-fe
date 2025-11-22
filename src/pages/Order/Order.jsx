import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./Order.css";

import { createOrder } from "../../api/order"; // ✅ Nối API Order

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

function PageHeader() {}

const eventDetails = JSON.parse(localStorage.getItem("eventDetails") || "{}");
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
};

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(15 * 60);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const m = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const s = String(timeLeft % 60).padStart(2, "0");

  return (
    <div className="countdown-timer">
      Hoàn tất đặt vé trong
      <div className="timer-box">
        <span>{m}</span> : <span>{s}</span>
      </div>
    </div>
  );
}

function OrderFormPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { summary } = location.state || {};

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const totalItems = summary ? summary.totalItems : 0;
  useEffect(() => {
    if (!summary) {
      navigate("/OrderTicket");
    }
  }, [summary, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid =
    formData.name !== "" &&
    formData.phone !== "" &&
    formData.email !== "" &&
    agreed;

  const handleContinueToPayment = async () => {
    try {
      setLoading(true);

      // ===========================
      // ⭐ Gửi ORDER lên Backend
      // ===========================
      const idd =JSON.parse(localStorage.getItem("user")) ;
      const orderPayload = {
        user_id: idd.id, 
        event_id: eventDetails.id, 
        total_amount: totalPrice,
        status: "pending",
        payment_id: null,
      };
      console.log("PAYLOAD SENT:", orderPayload);
        
      const response = await createOrder(orderPayload);
      const createdOrder = response.data;

      console.log("Order Created:", createdOrder);
         // Khi tạo Order thành công → Điều hướng sang thanh toán
      navigate("/payticket", {
        state: {
          summary: summary,
          formData: formData,
          order: createdOrder,
        },
      });
    } catch (error) {
      console.error("Lỗi tạo Order:", error);
      alert("Không thể tạo đơn hàng. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (!summary) return null;

  const {  eventDetails,ticketsInCart, totalPrice } = summary;

  

  return (
    <div className="form-page">
      <PageHeader />
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Trở về
      </button>

      {/* Banner thông tin sự kiện */}
      <section className="event-banner">
        <div className="event-banner-info">
          <h3>{eventDetails.name}</h3>
          <p>🕒 {formatDate(eventDetails.start_date)} → {formatDate(eventDetails.end_date)}</p>
          <p>📍 {eventDetails.location_id}</p>
        </div>
        <CountdownTimer />
      </section>

      <div className="form-page-container">
        {/* Form */}
        <main className="main-form-content">
          <h3>BẢNG CÂU HỎI</h3>

          <form className="info-form">
            <div className="form-group">
              <label>Họ và Tên</label>
              <input
                type="text"
                name="name"
                placeholder="Nhập họ tên"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Số điện thoại</label>
              <input
                type="text"
                name="phone"
                placeholder="Nhập số điện thoại"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Nhập email"
                value={formData.email}
                onChange={handleChange}
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
                Tôi đồng ý ticketbox & BTC sử dụng thông tin đặt vé nhằm mục đích
                vận hành sự kiện và xuất hóa đơn.
              </label>
            </div>
          </form>
        </main>

        {/* Sidebar */}
        <aside className="form-sidebar">
          <div className="form-summary-card">
            <div className="summary-tabs">
              <span className="tab-active">Thông tin đặt vé</span>
              <span className="tab-inactive" onClick={() => navigate(-1)}>
                Chọn lại vé
              </span>
            </div>

            <div className="summary-section">
              {ticketsInCart.map((ticket) => (
                <div className="summary-item" key={ticket.id}>
                  <span>
                    {ticket.name} (x{ticket.quantity})
                  </span>
                  <span>
                    {formatCurrency(ticket.price * ticket.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="summary-section total">
              <span>Tạm tính {summary.totalItems} vé</span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>

            {!isFormValid && (
              <p className="form-note">Vui lòng trả lời đầy đủ để tiếp tục</p>
            )}

            <button
              className="continue-btn-form"
              disabled={!isFormValid || loading}
              onClick={handleContinueToPayment}
            >
              {loading ? "Đang xử lý..." : "Tiếp tục ❯"}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default OrderFormPage;
