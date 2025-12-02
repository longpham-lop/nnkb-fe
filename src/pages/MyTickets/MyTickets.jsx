import React, { useEffect, useState } from "react";
import "./MyTickets.css";
import emptyTicketIcon from "../../assets/longavt.png";
import { Link } from "react-router-dom";
import { getAllOrders, getwhoOrderItems,getOrderById, createOrder, updateOrder, deleteOrder } from "../../api/order";
import { getAllOrderItems, getOrderItemById, createOrderItem, updateOrderItem, deleteOrderItem } from "../../api/orderitem";
import { useNavigate } from "react-router-dom";

export default function MyTickets() {
  const [regularTickets, setRegularTickets] = useState([]);
  const [nftTickets, setNftTickets] = useState([]);
  const [bill, setbill] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Vé Thường"); 
  const navigate = useNavigate();
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
      const orderRes = await getwhoOrderItems();
      const orders =orderRes.data.data || [];
      setbill(orders);

      const orderItemsRes = await getAllOrderItems();
      const allItems = Array.isArray(orderItemsRes.data)
        ? orderItemsRes.data
        : [];

      const userTickets = allItems
        .filter(item => orders.some(o => o.id === item.order_id))
        .map(item => {
          const order = orders.find(o => o.id === item.order_id);

          return {
            order_id: order.id,
            event_id: order.event_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
            qr_code: item.qr_code,
            checked_in: item.checked_in,
            status: order.status,
            event: order.Event, 
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
        {["Vé Thường", "Vé Blockchain (NFT)" ,"Hóa đơn của tôi "].map((cat) => (
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
                <p>Click để xem thêm chức năng vé blockchain</p>
                <button className="buy-now-btn">
                  <Link to="/mywal">chi tiết</Link>
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
        {activeCategory === "Hóa đơn của tôi " && (
          <div className="ticket-status-section">
            {bill.length === 0 ? (
              <div className="empty-tickets">
                <img src={emptyTicketIcon} alt="Empty tickets" />
                <p>Chưa có hóa đơn nào</p>
                <button className="buy-now-btn">
                  <Link to="/home">chi tiết</Link>
                </button>
              </div>
            ) : (
              <div className="tickets-grid">
                {bill.map((b, i) => (
                  <div className="ticket-card" key={i}>
                    <h3>{b.event_id}</h3>
                    <p>Tổng: {b.total_amount}</p>
                    <p>Tổng: {b.status}</p>
{/* //id (PK), user_id, event_id, total_amount, status, created_at, payment_id */}
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
