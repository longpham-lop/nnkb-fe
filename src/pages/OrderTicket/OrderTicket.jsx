import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './OrderTicket.css';

const availableTickets = JSON.parse(localStorage.getItem("availableTickets") || "[]");
const eventDetails = JSON.parse(localStorage.getItem("eventDetails") || "{}");

// ===== HELPERS =====
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

const formatCurrency = (amount) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);

// ===== COMPONENTS =====
function QuantitySelector({ quantity, max, onIncrement, onDecrement }) {
  return (
    <div className="quantity-selector">
      <button
        className="quantity-btn"
        onClick={onDecrement}
        disabled={quantity <= 0}
      >
        -
      </button>

      <input
        className="quantity-input"
        type="text"
        value={quantity}
        readOnly
      />

      <button
        className="quantity-btn"
        onClick={onIncrement}
        disabled={quantity >= max}
      >
        +
      </button>
    </div>
  );
}

function TicketItem({ ticket, quantity, onQuantityChange }) {
  const remaining = Math.max(0, ticket.quantity - ticket.sold);

  const handleIncrement = () => {
    if (quantity < remaining) {
      onQuantityChange(ticket.id, quantity + 1);
    }
  };

  const handleDecrement = () => {
    onQuantityChange(ticket.id, Math.max(0, quantity - 1));
  };

  return (
    <div className={`ticket-item ${remaining === 0 ? 'sold-out' : ''}`}>
      <div className="ticket-item-main">
        <div className="ticket-info">
          <div className="ticket-name">{ticket.name}</div>
          <div className="ticket-price">{formatCurrency(ticket.price)}</div>

          {remaining === 0 ? (
            <div className="sold-out-text">❌ Hết vé</div>
          ) : (
            <div className="remaining-text">
              Còn lại: {remaining} vé
            </div>
          )}
        </div>

        <QuantitySelector
          quantity={quantity}
          max={remaining}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
        />
      </div>

      {ticket.benefits && (
        <div className="ticket-benefits">{ticket.benefits}</div>
      )}
    </div>
  );
}

// ===== MAIN PAGE =====
function OrderTicketPage() {
  const navigate = useNavigate();

  const [selectedTickets, setSelectedTickets] = useState({});

  const handleQuantityChange = (ticketId, newQuantity) => {
    setSelectedTickets((prev) => ({
      ...prev,
      [String(ticketId)]: newQuantity
    }));
  };

  // ===== CALCULATE TOTAL =====
  const { totalItems, totalPrice } = useMemo(() => {
    let items = 0;
    let price = 0;

    for (const key in selectedTickets) {
      const quantity = selectedTickets[key];

      const ticket = availableTickets.find(
        (t) => String(t.id) === String(key)
      );

      if (ticket && quantity > 0) {
        items += quantity;
        price += ticket.price * quantity;
      }
    }

    return { totalItems: items, totalPrice: price };
  }, [selectedTickets]);

  // ===== CONTINUE HANDLER =====
  const handleContinue = () => {
    const ticketsInCart = availableTickets
      .filter((ticket) => selectedTickets[String(ticket.id)] > 0)
      .map((ticket) => ({
        id: ticket.id,
        name: ticket.name,
        price: ticket.price,
        quantity: selectedTickets[String(ticket.id)]
      }));

    const orderSummary = {
      eventDetails,
      ticketsInCart,
      totalItems,
      totalPrice
    };

    navigate('/order', { state: { summary: orderSummary } });
  };

  if (!eventDetails?.id) {
    navigate("/events");
    return null;
  }

  return (
    <div className="order-page">
      <div className="order-page-container">

        {/* ===== MAIN ===== */}
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
                    quantity={selectedTickets[String(ticket.id)] || 0}
                    onQuantityChange={handleQuantityChange}
                  />
                ))}
              </>
            )}
          </div>
        </main>

        {/* ===== SIDEBAR ===== */}
        <aside className="sidebar">
          <div className="summary-card">
            <h3 className="event-title">
              {eventDetails?.name || "Sự kiện không tồn tại"}
            </h3>

            {eventDetails?.start_date && eventDetails?.end_date && (
              <div className="event-detail">
                🗓️ {formatDate(eventDetails.start_date)} → {formatDate(eventDetails.end_date)}
              </div>
            )}

            {eventDetails?.location_id && (
              <div className="event-detail">
                📍 Địa điểm ID: {eventDetails.location_id}
              </div>
            )}

            {eventDetails?.cover_image && (
              <img
                src={eventDetails.cover_image}
                alt="Event Cover"
                className="event-cover"
              />
            )}

            <hr className="divider" />

            <div className="price-summary">
              <h4>Giá vé</h4>

              {totalItems === 0 ? (
                <p>Chưa chọn vé</p>
              ) : (
                availableTickets.map((ticket) => {
                  const quantity = selectedTickets[String(ticket.id)] || 0;
                  if (!quantity) return null;

                  return (
                    <div className="summary-item" key={ticket.id}>
                      <span>{ticket.name} (x{quantity})</span>
                      <span>{formatCurrency(ticket.price * quantity)}</span>
                    </div>
                  );
                })
              )}
            </div>

            <hr className="divider" />

            <div className="summary-total">
              <span>Tổng cộng</span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>
          </div>

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
