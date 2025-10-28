import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './OrderTicket.css';

// Dữ liệu mock
const availableTickets = [
  {
    id: 't1',
    name: "Say & 'Quẩy' (Standing)",
    price: 840000,
    benefits: 'Benefits: Album, Fansign, Photo 1:1, Keychain, Hi-touch, Áo, Nón, Khăn Bandana, Nước Suối.',
  },
  //thêm các loại vé khác 
];

// Dữ liệu mock 
const eventDetails = {
  title: 'Phạm Quỳnh Anh Fan Meeting',
  date: '14:00, 2 tháng 11, 2025',
  location: 'Cici Saigon',
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
          </div>
        </main>

        {/* Cột Sidebar (Bên phải) */}
        <aside className="sidebar">
          <div className="summary-card">
            <h3 className="event-title">{eventDetails.title}</h3>
            <div className="event-detail">
              <span>🗓️</span> {eventDetails.date}
            </div>
            <div className="event-detail">
              <span>📍</span> {eventDetails.location}
            </div>

            <hr className="divider" />

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
            
            <div className="summary-total">
              <span>Tổng cộng</span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>
          </div>

          <button className="continue-btn" disabled={totalItems === 0} onClick={handleContinue}>
            {totalItems === 0 ? 'Vui lòng chọn vé >>' : 'Tiếp tục >>'}
          </button>
        </aside>
      </div>
    </div>
  );
}

export default OrderTicketPage;