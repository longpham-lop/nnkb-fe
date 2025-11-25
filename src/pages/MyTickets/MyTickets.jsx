import React, { useEffect, useState } from "react";
import "./MyTickets.css";
import emptyTicketIcon from "../../assets/longavt.png";
import { Link } from "react-router-dom";
import { getAllOrders, getOrderById, createOrder, updateOrder, deleteOrder } from "../../api/order";
import { getAllOrderItems, getOrderItemById, createOrderItem, updateOrderItem, deleteOrderItem } from "../../api/orderitem";

export default function MyTickets() {
  const [regularTickets, setRegularTickets] = useState([]);
  const [nftTickets, setNftTickets] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Vé Thường"); 

  const [activeStatusTab, setActiveStatusTab] = useState("Tất cả"); 
  const userId = localStorage.getItem("userid");

  useEffect(() => {
    loadBlockchainTickets();
    loadRegularTickets();
  }, []);

  const loadBlockchainTickets = () => {
    const stored = JSON.parse(localStorage.getItem("nftTickets") || "[]");
    setNftTickets(stored);
  };

  const loadRegularTickets = async () => {
    try {
      const orderRes = await getAllOrders();
      let orders = orderRes.data || [];

      orders = orders.filter((o) => String(o.user_id) === String(userId));

      const orderItemsRes = await getAllOrderItems();
      const allItems = orderItemsRes.data || [];

      const userTickets = allItems
        .filter((item) => orders.some((o) => o.id === item.order_id))
        .map((item) => {
          const order = orders.find((o) => o.id === item.order_id);
          return {
            order_id: order.id,
            event_id: order.event_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
            qr_code: item.qr_code,
            checked_in: item.checked_in,
            status: order.status,
            event: item.event || {},
          };
        });

      setRegularTickets(userTickets);
    } catch (err) {
      console.error("Lỗi tải vé thường:", err);
    }
  };

  // Filter vé thường theo trạng thái
  const filteredRegularTickets =
    activeStatusTab === "Tất cả"
      ? regularTickets
      : regularTickets.filter((t) => t.status === activeStatusTab);

  return (
    <div className="mytickets-container">
      <h1>Vé của tôi</h1>
      <hr className="divider" />

      {/* Tab chọn loại vé */}
      <div className="category-tabs">
        {["Vé Thường", "Vé Blockchain (NFT)"].map((cat) => (
          <button
            key={cat}
            className={`tab ${activeCategory === cat ? "active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="ticket-list-container">
        {activeCategory === "Vé Thường" && (
          <div className="ticket-status-section">
            
            {filteredRegularTickets.length === 0 ? (
              <div className="empty-tickets">
                <img src={emptyTicketIcon} alt="Empty tickets" />
                <p>Bạn chưa mua vé nào</p>
                <button className="buy-now-btn">
                  <Link to="/home">Mua vé ngay</Link>
                </button>
              </div>
            ) : (
              <div className="tickets-grid">
                {filteredRegularTickets.map((t, index) => (
                  <div className="ticket-card" key={index}>
                    <h3>{t.event?.name || "Tên sự kiện"}</h3>
                    <p>SL: {t.quantity}</p>
                    <p>Giá: {t.unit_price.toLocaleString()}₫</p>
                    <p>Trạng thái: {t.status}</p>

                    {t.qr_code ? (
                      <img src={t.qr_code} className="qr-img" alt="QR vé" />
                    ) : (
                      <p className="no-qr">Không có mã QR</p>
                    )}

                    <button
                      className={`checkin-btn ${
                        t.checked_in ? "checked" : ""
                      }`}
                    >
                      {t.checked_in ? "Đã check-in" : "Chưa check-in"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================== Vé Blockchain (NFT) ==================== */}
        {activeCategory === "Vé Blockchain (NFT)" && (
          <div className="ticket-status-section">
            {nftTickets.length === 0 ? (
              <div className="empty-tickets">
                <img src={emptyTicketIcon} alt="Empty tickets" />
                <p>Chưa có vé NFT nào</p>
                <button className="buy-now-btn">
                  <Link to="/home">Mua vé ngay</Link>
                </button>
              </div>
            ) : (
              <div className="tickets-grid">
                {nftTickets.map((nft, i) => (
                  <div className="ticket-card" key={i}>
                    <h3>{nft.eventName}</h3>
                    <p>Mã NFT: {nft.tokenId}</p>

                    {nft.qr && (
                      <img className="qr-img" src={nft.qr} alt="nft qr" />
                    )}

                    <button className="checkin-btn nft-btn">NFT</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
