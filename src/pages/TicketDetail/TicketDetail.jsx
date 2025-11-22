import React, { useState, useEffect } from 'react';
import './TicketDetail.css';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import eventPoster from '../../assets/banner1.png';
import ticketGa from '../../assets/banner2.png';
import ticketFanZone from '../../assets/banner3.png';
import Vpbanks from '../../assets/vpbanks.png';
import Banner1 from '../../assets/banner1.png';

import { getAllEvents } from '../../api/event';
import { getAllCategories } from '../../api/category';
import { getAllLocations } from '../../api/location';
import { getAllTickets } from '../../api/ticket';


const TicketDetail = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTicketSectionExpanded, setIsTicketSectionExpanded] = useState(true);

  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [tickets, setTickets] = useState([]);

  const [loading, setLoading] = useState(true);

  const eventId = localStorage.getItem("eventid"); 

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventRes, categoryRes, locationRes, ticketRes] = await Promise.all([
          getAllEvents(),
          getAllCategories(),
          getAllLocations(),
          getAllTickets()
        ]);

        const allEvents = eventRes.data;
        const allCategories = categoryRes.data;
        const allLocations = locationRes.data;
        const allTickets = ticketRes.data;

        // ✅ lọc vé đúng theo event đang xem
        const filteredTickets = allTickets.filter(
          (t) => String(t.event_id) === String(eventId)
        );
        if (filteredTickets) {
        localStorage.setItem("availableTickets", JSON.stringify(filteredTickets));
        }

        setEvents(allEvents);
        setCategories(allCategories);
        setLocations(allLocations);
        setTickets(filteredTickets);
      } catch (error) {
        console.error("Lỗi load dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId]);
  //---
  const currentEvent = events.find(
    (e) => String(e.id) === String(eventId),
    
  );
  if (currentEvent) {
  localStorage.setItem("eventDetails", JSON.stringify(currentEvent));
  }

  const currentLocation = locations.find(
    (l) => l.id === currentEvent?.location_id
  );
  //---
    

  const handleBuyTicket = () => {
        
        navigate('/OrderTicket');
    };

   return (
    <div className="ticket-page">
      {/* ==== PHẦN TRÊN – NỀN TỐI + CARD VÉ ==== */}
      <section className="ticket-hero">
        <div className="ticket-detail-container">
          <main className="main-detail-content">

            <div className="event-main-header">
              <div className="event-info">
                <h1>{currentEvent?.name || 'Đang tải...'}</h1>
                <p className="event-time">
                  🕒 {currentEvent?.start_date} - {currentEvent?.end_date}
                </p>
                <p className="event-location">
                  📍 {currentLocation?.address}, {currentLocation?.city}
                </p>
                <button className="price-box" onClick={handleBuyTicket}>
                  <span>Giá từ 499.000 ₫</span>
                </button>
              </div>

              {/* Vạch xé vé ở giữa */}
              <div className="event-main-divider" />

              <div className="event-poster">
                <img src={currentEvent?.cover_image}alt="Event Poster" />
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
                  src={currentEvent?.cover_image}
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
                      {currentEvent?.description}
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
                        src={ticket.seat_type === 'VIP' ? ticketFanZone : ticketGa}
                        alt="ticket"
                        className="ticket-type-img"
                      />

                      <div className="ticket-details">
                        <h4>{ticket.name}</h4>
                        <p>Loại ghế: {ticket.seat_type}</p>
                        <p>Số lượng còn: {ticket.quantity - ticket.sold}</p>
                      </div>

                      <div className="ticket-price">
                        {Number(ticket.price).toLocaleString('vi-VN')} ₫
                      </div>
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
                      src={currentEvent?.cover_image}
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
                      Với sự kiện {currentEvent?.name || 'Đang tải...'}, chúng tôi tự hào là đối
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
                  {events.slice(0, 4).map((event) => (
                    <div key={event.id} className="reco-card">
                      <img src={event.cover_image || eventPoster} alt={event.name} />
                      <h4>{event.name}</h4>
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
              <img src={Vpbanks} alt="Ad" />
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default TicketDetail;