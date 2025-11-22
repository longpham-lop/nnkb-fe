import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './OrderTicket.css';
import eventCover from '../../assets/banner2.png'


const availableTickets = JSON.parse(localStorage.getItem("availableTickets") || "[]")

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


// Hàm format tiền tệ
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

// Component chọn số lượng
function QuantitySelector({ quantity, onIncrement, onDecrement }) {
  return (
    <div className="quantity-selector">
      <button className="quantity-btn" onClick={onDecrement} disabled={quantity <= 0}>
        -
      </button>
      <input className="quantity-input" type="text" value={quantity} readOnly />
      <button className="quantity-btn" onClick={onIncrement}>
        +
      </button>
    </div>
  );
}


function TicketItem({ ticket, quantity, onQuantityChange }) {
  const handleIncrement = () => {
    onQuantityChange(ticket.id, quantity + 1);
  };

  const handleDecrement = () => {
    onQuantityChange(ticket.id, Math.max(0, quantity - 1));
  };

  return (
    <div className="ticket-item">
      <div className="ticket-item-main">
        <div className="ticket-info">
          <div className="ticket-name">{ticket.name}</div>
          <div className="ticket-price">{formatCurrency(ticket.price)}</div>
        </div>
        <QuantitySelector
          quantity={quantity}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
        />
      </div>
      <div className="ticket-benefits">
        {ticket.benefits}
      </div>
    </div>
  );
}

// Component Header
function PageHeader() {
  
}

// Component chính của trang
function OrderTicketPage() {
  const navigate = useNavigate();
  // State để lưu số lượng vé đã chọn, ví dụ: { t1: 1, t2: 0 }
  const [selectedTickets, setSelectedTickets] = useState({});

  const handleQuantityChange = (ticketId, newQuantity) => {
    setSelectedTickets((prev) => ({
      ...prev,
      [ticketId]: newQuantity,
    }));
  };

  // Tính toán tổng số vé và tổng tiền
  const { totalItems, totalPrice } = useMemo(() => {
    let items = 0;
    let price = 0;
    for (const ticketId in selectedTickets) {
      const quantity = selectedTickets[ticketId];
      const ticket = availableTickets.find((t) => t.id === ticketId);
      if (ticket && quantity > 0) {
        items += quantity;
        price += ticket.price * quantity;
      }
    }
    
    return { totalItems: items, totalPrice: price };
  }, [selectedTickets]);
    
    const handleContinue = () => {
    // Lọc ra các vé đã được chọn
    const ticketsInCart = availableTickets
      .filter(ticket => selectedTickets[ticket.id] > 0)
      .map(ticket => ({
        id: ticket.id,
        name: ticket.name,
        price: ticket.price,
        quantity: selectedTickets[ticket.id],
      }));

      const orderSummary = {
      eventDetails,
      ticketsInCart,
      totalItems,
      totalPrice,
    };

    navigate('/order', { state: { summary: orderSummary } });
};
  if (!eventDetails) {
    navigate("/events");
    return null;
  }
  return (
    <div className="order-page">
      <PageHeader />
      <div className="order-page-container">
        {/* Cột Nội dung chính (Bên trái) */}
        <main className="main-content">
          <div className="main-content-header">
            <button className="back-btn" onClick={() => navigate(-1)}>
              ← Trở về
            </button>
            <h2 className="main-title">Chọn vé</h2>
          </div>
          
          <div className="ticket-list">
            {availableTickets.length === 0 ? (
              <p>Không có vé nào để hiển thị.</p>
            ) : (
              <>
                <div className="list-header">
                  <span>Loại vé</span>
                  <span>Số lượng</span>
                </div>
                {availableTickets.map((ticket) => (
                  <TicketItem
                    key={ticket.id}
                    ticket={ticket}
                    quantity={selectedTickets[ticket.id] || 0}
                    onQuantityChange={handleQuantityChange}
                  />
                ))}
              </>
            )}
          </div>
        </main>

        {/* Cột Sidebar (Bên phải) */}
        <aside className="sidebar">
          <div className="summary-card">

            {/* Tên sự kiện */}
            <h3 className="event-title">{eventDetails?.name || "Sự kiện không tồn tại"}</h3>

            {/* Thời gian */}
            {eventDetails?.start_date && eventDetails?.end_date && (
              <div className="event-detail">
                <span>🗓️</span>
                {formatDate(eventDetails.start_date)} → {formatDate(eventDetails.end_date)}
              </div>
            )}

            {/* Địa điểm */}
            {eventDetails?.location_id && (
              <div className="event-detail">
                <span>📍</span> Địa điểm ID: {eventDetails.location_id}
              </div>
            )}

            {/* Ảnh bìa */}
            {eventDetails?.cover_image && (
              <img
                src={eventDetails.cover_image}
                alt="Event Cover"
                className="event-cover"
              />
            )}

            <hr className="divider" />

            {/* Giá vé */}
            <div className="price-summary">
              <h4>Giá vé</h4>
              {totalItems === 0 ? (
                <p>Chưa chọn vé</p>
              ) : (
                availableTickets.map((ticket) => {
                  const quantity = selectedTickets[ticket.id] || 0;
                  if (quantity > 0) {
                    return (
                      <div className="summary-item" key={ticket.id}>
                        <span>{ticket.name} (x{quantity})</span>
                        <span>{formatCurrency(ticket.price * quantity)}</span>
                      </div>
                    );
                  }
                  return null;
                })
              )}
            </div>

            <hr className="divider" />

            {/* Tổng cộng */}
            <div className="summary-total">
              <span>Tổng cộng</span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>
          </div>

          {/* Nút tiếp tục */}
          <button
            className="continue-btn"
            disabled={totalItems === 0}
            onClick={handleContinue}
          >
            {totalItems === 0 ? 'Vui lòng chọn vé >>' : 'Tiếp tục >>'}
          </button>
        </aside>


      </div>
    </div>
  );
}

export default OrderTicketPage;