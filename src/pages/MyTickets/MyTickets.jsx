import React, { useEffect, useState } from "react";
import "./MyTickets.css";
import emptyTicketIcon from "../../assets/amongus.png";  
import { Link, useNavigate } from "react-router-dom"
import { getwhoOrderItems, getAllOrders } from "../../api/order"; 


export default function MyTickets() {
  const [regularTickets, setRegularTickets] = useState([]);
  const [nftTickets, setNftTickets] = useState([]);
  const [bill, setBill] = useState([]); 
  const [activeCategory, setActiveCategory] = useState("Vé Thường");
  
  // const navigate = useNavigate(); // Chưa dùng thì comment lại
  const [activeStatusTab, setActiveStatusTab] = useState("Tất cả");

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
      const orders = orderRes.data.data || [];
      setBill(orders);

      const orderItemsRes = await getAllOrders();
      const allItems = Array.isArray(orderItemsRes.data) ? orderItemsRes.data : [];

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
            event: order.Event,
          };
        });

      setRegularTickets(userTickets);
    } catch (err) {
      console.error("Lỗi tải vé thường:", err);
    }
  };

  const filteredRegularTickets =
    activeStatusTab === "Tất cả"
      ? regularTickets
      : regularTickets.filter((t) => t.status === activeStatusTab);

  // Helper để format giá tiền
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Helper render trạng thái có màu sắc
  const renderStatus = (status) => {
    let className = "status-badge pending";
    if (status === "completed" || status === "paid" || status === "Thành công") className = "status-badge success";
    if (status === "cancelled" || status === "failed") className = "status-badge error";
    
    return <span className={className}>{status}</span>;
  };

  return (
    <div className="mytickets-wrapper">
      <div className="mytickets-container">
        <div className="header-section">
            <h1>Kho Vé Của Tôi</h1>
            <p>Quản lý vé tham dự sự kiện và lịch sử giao dịch</p>
        </div>
        
        {/* Tab chọn loại vé */}
        <div className="category-tabs">
          {["Vé Thường", "Vé Blockchain (NFT)", "Hóa đơn của tôi"].map((cat) => (
            <button
              key={cat}
              className={`tab-btn ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="ticket-content-area">
          {/* ==================== VÉ THƯỜNG ==================== */}
          {activeCategory === "Vé Thường" && (
            <>
              {filteredRegularTickets.length === 0 ? (
                <EmptyState message="Bạn chưa mua vé sự kiện nào" linkText="Mua vé ngay" linkTo="/home" />
              ) : (
                <div className="tickets-grid">
                  {filteredRegularTickets.map((t, index) => (
                    <div className="ticket-card" key={index}>
                      <div className="card-header">
                        <h3 className="event-name">{t.event?.name || "Sự kiện chưa cập nhật"}</h3>
                        {renderStatus(t.status)}
                      </div>
                      
                      <div className="card-body">
                        <div className="info-row">
                            <span>Số lượng:</span> <strong>{t.quantity}</strong>
                        </div>
                        <div className="info-row">
                            <span>Đơn giá:</span> <strong>{formatCurrency(t.unit_price)}</strong>
                        </div>
                        
                        <div className="qr-section">
                            {t.qr_code ? (
                            <img src={t.qr_code} className="qr-img" alt="QR Code" />
                            ) : (
                            <div className="no-qr">Chưa có mã QR</div>
                            )}
                        </div>
                      </div>

                      <div className="card-footer">
                        <button className={`action-btn ${t.checked_in ? "disabled" : "primary"}`}>
                          {t.checked_in ? "Đã Check-in" : "Mở vé Check-in"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ==================== VÉ NFT ==================== */}
          {activeCategory === "Vé Blockchain (NFT)" && (
            <>
              {nftTickets.length === 0 ? (
                <EmptyState message="Bạn chưa sở hữu vé NFT nào" linkText="Vào ví NFT" linkTo="/mywal" />
              ) : (
                <div className="tickets-grid">
                  {nftTickets.map((nft, i) => (
                    <div className="ticket-card nft-card" key={i}>
                      <div className="card-header">
                        <h3 className="event-name">{nft.eventName}</h3>
                        <span className="nft-badge">NFT Asset</span>
                      </div>
                      <div className="card-body">
                         <div className="info-row">
                            <span>Token ID:</span> <span className="token-id">#{nft.tokenId}</span>
                         </div>
                         <div className="qr-section">
                            {nft.qr && <img className="qr-img" src={nft.qr} alt="NFT QR" />}
                         </div>
                      </div>
                      <div className="card-footer">
                        <button className="action-btn nft-action">Xem trên Blockchain</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ==================== HÓA ĐƠN ==================== */}
          {activeCategory === "Hóa đơn của tôi" && (
            <>
              {bill.length === 0 ? (
                <EmptyState message="Chưa có lịch sử giao dịch" linkText="Khám phá sự kiện" linkTo="/home" />
              ) : (
                <div className="tickets-grid">
                  {bill.map((b, i) => (
                    <div className="ticket-card bill-card" key={i}>
                      <div className="card-header">
                         <span className="bill-id">Mã đơn: #{b.id}</span>
                         {renderStatus(b.status)}
                      </div>
                      <div className="card-body">
                        <div className="info-rows">
                            <span>Sự kiện ID:</span> <strong>{b.event_id}</strong>
                        </div>
                        <div className="info-row">
                            <span>Ngày tạo:</span> <span>{new Date(b.created_at).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <div className="bill-total">
                            Tổng tiền: {formatCurrency(b.total_amount)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Component phụ hiển thị lúc trống
const EmptyState = ({ message, linkText, linkTo }) => (
  <div className="empty-state">
    <img src={emptyTicketIcon} alt="Empty" />
    <p>{message}</p>
    <Link to={linkTo} className="buy-now-btn">{linkText}</Link>
  </div>
);