import React, {useState} from 'react';
import './TicketDetail.css';
import { Link, useNavigate } from 'react-router-dom';
// Import ảnh (thay thế bằng ảnh thật của bạn)
import eventPoster from '../../assets/banner1.png';
import ticketGa from '../../assets/banner2.png';
import ticketFanZone from '../../assets/banner3.png';
import Vpbank from '../../assets/vpbank.png';
import Banner1 from '../../assets/banner1.png';

const TicketDetail = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isTicketSectionExpanded, setIsTicketSectionExpanded] = useState(true);
    
    // --- BẮT ĐẦU PHẦN THÊM MỚI ---
    const navigate = useNavigate(); 

    const handleBuyTicket = () => {
        
        navigate('/OrderTicket');
    };
    // Dữ liệu vé giả để render
    const tickets = [
        { id: 1, type: 'GA', name: 'Gói Dậy Sớm + GA 1', desc: 'Full Day Access + GA 1', price: '499.000₫', image: ticketGa },
        { id: 2, type: 'GA', name: 'Gói Dậy Sớm + GA 2', desc: 'Full Day Access + GA 2', price: '699.000₫', image: ticketGa },
        { id: 3, type: 'FanZone', name: 'Gói Dậy Sớm + FanZone 1', desc: 'Full Day Access + FanZone 1', price: '799.000₫', image: ticketFanZone },
        { id: 4, type: 'GA', name: 'Gói Dậy Sớm + GA 2', desc: 'Full Day Access + GA 2', price: '699.000₫', image: ticketGa },
        { id: 5, type: 'FanZone', name: 'Gói Dậy Sớm + FanZone 2', desc: 'Full Day Access + FanZone 2', price: '999.000₫', image: ticketFanZone }
    ];

   return (
    <div className="ticket-page">
      {/* ==== PHẦN TRÊN – NỀN TỐI + CARD VÉ ==== */}
      <section className="ticket-hero">
        <div className="ticket-detail-container">
          <main className="main-detail-content">

            <div className="event-main-header">
              <div className="event-info">
                <h1>GS25 MUSIC FESTIVAL 2025</h1>
                <p className="event-time">
                  🕒 15:00 - 22:00 | 23 Tháng 11, 2025
                </p>
                <p className="event-location">
                  📍 Đường Nguyễn Thiện Thành, Phường Thủ Thiêm, Quận 2, Thành
                  phố Hồ Chí Minh
                </p>
                <button className="price-box" onClick={handleBuyTicket}>
                  <span>Giá từ 499.000 ₫</span>
                </button>
              </div>

              {/* Vạch xé vé ở giữa */}
              <div className="event-main-divider" />

              <div className="event-poster">
                <img src={eventPoster} alt="Event Poster" />
              </div>
            </div>
          </main>
        </div>
      </section>

      {/* ==== PHẦN DƯỚI – NỀN SÁNG + NỘI DUNG + BANNER ==== */}
      <section className="ticket-body">
        <div className="ticket-detail-container">
          <main className="main-detail-content">
            <section className="event-bottom-half">
              {/* --- Giới thiệu --- */}
              <section className="event-description">
                <h3>Giới thiệu</h3>
                <img
                  src={Banner1}
                  alt="Event description banner"
                  className="description-banner"
                />

                <div
                  className={`description-content ${
                    !isExpanded ? "collapsed" : ""
                  }`}
                >
                  <div className="description-text">
                    <p>
                      GS25 MUSIC FESTIVAL 2025 là một sự kiện âm nhạc đỉnh cao,
                      quy tụ dàn nghệ sĩ hàng đầu trong nước và quốc tế. Với sân
                      khấu hoành tráng, âm thanh ánh sáng hiện đại, sự kiện hứa
                      hẹn mang đến những giây phút bùng nổ và trải nghiệm âm
                      nhạc không thể nào quên.
                    </p>
                    <p>
                      Đến với GS25 MUSIC FESTIVAL, bạn không chỉ được thưởng
                      thức âm nhạc mà còn được tham gia vào các hoạt động bên
                      lề hấp dẫn, các gian hàng ẩm thực đa dạng và cơ hội giao
                      lưu cùng thần tượng. Đây là sự kiện không thể bỏ lỡ trong
                      năm 2025!
                    </p>
                    <p>
                      Sự kiện được tổ chức tại một trong những địa điểm đẹp
                      nhất thành phố, đảm bảo không gian rộng rãi và an toàn cho
                      hàng chục ngàn khán giả. Hãy chuẩn bị sẵn sàng để "cháy"
                      hết mình cùng chúng tôi!
                    </p>
                  </div>
                </div>

                <button
                  className="toggle-expand-btn"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? "Thu gọn" : "Xem thêm"}
                  <span
                    className="arrow-icon"
                    style={{
                      transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  >
                    ▼
                  </span>
                </button>
              </section>

              {/* --- Thông tin vé --- */}
              <div className="ticket-selection-section">
                <div className="ticket-list-header">
                  <div
                    className="ticket-header-left"
                    onClick={() =>
                      setIsTicketSectionExpanded(!isTicketSectionExpanded)
                    }
                  >
                    <div className="info-block">
                      <h4>Thông tin vé</h4>
                      <p>15:00 - 22:00 | 23 Tháng 11, 2025</p>
                    </div>
                    <span
                      className="arrow-icon"
                      style={{
                        transform: isTicketSectionExpanded
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                      }}
                    >
                      ▼
                    </span>
                  </div>
                  <button
                    className="buy-ticket-now-btn"
                    onClick={handleBuyTicket}
                  >
                    Mua vé ngay
                  </button>
                </div>

                <div
                  className={`ticket-list ${
                    !isTicketSectionExpanded ? "collapsed" : ""
                  }`}
                >
                  {tickets.map((ticket) => (
                    <div key={ticket.id} className="ticket-item">
                      <img
                        src={ticket.image}
                        alt={`${ticket.type} ticket`}
                        className="ticket-type-img"
                      />
                      <div className="ticket-details">
                        <h4>{ticket.name}</h4>
                        <p>{ticket.desc}</p>
                      </div>
                      <div className="ticket-price">{ticket.price}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* --- Ban tổ chức --- */}
              <section className="event-organizer">
                <h3>Ban tổ chức</h3>
                <hr className="faint-divider" />
                <div className="organizer-content">
                  <div className="organizer-logo-wrapper">
                    {/* nếu có logo riêng thì thay src */}
                    <img
                      src={eventPoster}
                      alt="Ban tổ chức"
                      className="organizer-logo"
                    />
                  </div>
                  <div className="organizer-text">
                    <p className="organizer-name">
                      <strong>CÔNG TY TNHH TOPTICKET</strong>
                    </p>
                    <p>
                      TOPTICKET là nền tảng phân phối vé sự kiện hàng đầu Việt
                      Nam, mang đến giải pháp toàn diện cho cả nhà tổ chức và
                      người tham dự. Chúng tôi cam kết mang lại trải nghiệm mua
                      vé dễ dàng, an toàn và tiện lợi.
                    </p>
                    <p>
                      Với sự kiện GS25 MUSIC FESTIVAL, chúng tôi tự hào là đối
                      tác đồng hành, góp phần tạo nên một lễ hội âm nhạc thành
                      công và đáng nhớ.
                    </p>
                  </div>
                </div>
              </section>

              {/* --- Gợi ý sự kiện --- */}
              <div className="recommendations">
                <h3>Có thể bạn quan tâm</h3>
                <div className="recommendation-grid">
                  {tickets.map((event) => (
                    <div key={event.id} className="reco-card">
                      <img src={event.image} alt={event.name} />
                      <h4>{event.name}</h4>
                      <p className="reco-price">{event.price}</p>
                    </div>
                  ))}
                </div>
                <div className="see-more-container">
                  <Link to="/home" className="see-more-btn">
                    Xem thêm sự kiện
                  </Link>
                </div>
              </div>
            </section>
          </main>

          {/* Cột quảng cáo bên phải cho phần thân dưới */}
          <aside className="sidebar-ads">
            <div className="ad-card">
              <h4>VÉ RẺ BẤT NGỜ</h4>
              <img src={Vpbank} alt="Ad" />
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default TicketDetail;