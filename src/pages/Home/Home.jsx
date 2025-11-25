import React, { useEffect, useState } from "react";
import "./Home.css";
import Slider from "react-slick";

import { getAllEvents } from "../../api/event";
import { getAllCategories } from "../../api/category";
import { getAllLocations } from "../../api/location";
import { getAllTickets } from "../../api/ticket";

import HoChiMinhcity from "../../assets/HoChiMinhcity.png";
import Hanoi from "../../assets/Hanoi.png";
import DaLat from "../../assets/Dalat.png";
import Vitrikhac from "../../assets/vitrikhac.png";
import Topticket from "../../assets/topticket.png";

const Home = () => {
  const [events, setEvents] = useState([]);
  const [locations, setLocations] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventRes, categoryRes, locationRes, ticketRes] = await Promise.all([
          getAllEvents(),
          getAllCategories(),
          getAllLocations(),
          getAllTickets(),
        ]);

        setEvents(eventRes.data || []);
        setLocations(locationRes.data || []);
        setTickets(ticketRes.data || []);
      } catch (err) {
        console.error("Lỗi load dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getLocationNameByEventId = (eventId) => {
    const event = events.find((e) => e.id === eventId);
    if (!event) return "";
    const loc = locations.find((l) => l.id === event.location_id);
    return loc?.name || "";
  };

  const getMinTicketPrice = (eventId) => {
    const eventTickets = tickets.filter((t) => t.event_id === eventId);
    if (eventTickets.length === 0) return null;
    return Math.min(...eventTickets.map((t) => Number(t.price)));
  };

  
  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className="home-container">
      <main>
        <section className="marquee-slider">
          <div className="marquee-track">
            {events.map((event) => (
              <div key={event.id} className="marquee-item">
                <img src={event.cover_image} alt={event.name} />
              </div>
            ))}
            {/* Duplicate để chạy liên tục */}
            {events.map((event) => (
              <div key={event.id + "-2"} className="marquee-item">
                <img src={event.cover_image} alt={event.name} />
              </div>
            ))}
          </div>
        </section>

        <section className="event-section">
          <h2>🔥 Sự kiện đặc sắc</h2>

          <div className="event-list">
            {events.slice(0, 6).map((event) => {
              const minPrice = getMinTicketPrice(event.id);
              return (
                <div key={event.id} className="event-card-large" onClick={() => window.location.href = `/detail/${event.id}`}>
                  <img src={event.cover_image} alt={event.name} />
                </div>
              );
            })}
          </div>
        </section>

        <section className="event-section">
          <h2>🔥 Sự kiện xu hướng</h2>

          <div className="event-list">
            {events.slice(0, 5).map((event) => {
              const minPrice = getMinTicketPrice(event.id);

              return (
                <div key={event.id} className="event-card">
                  <img src={event.cover_image} alt={event.name} />
                  <h3>{event.name}</h3>
                  <p className="price">
                    {minPrice === 0
                      ? "Miễn phí"
                      : minPrice
                      ? `Từ ${minPrice.toLocaleString("vi-VN")}₫`
                      : "Liên hệ"}
                  </p>
                  <p className="date">
                    {new Date(event.start_date).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <div className="topticket">
          <img src={Topticket} alt="Top Ticket" />
        </div>

        {/* =======================
            CUỐI TUẦN NÀY
        ==========================*/}
        <section className="event-section">
          <h2>
            Cuối tuần này <a href="/filter" className="see-more">Xem thêm &gt;</a>
          </h2>

          <div className="event-list">
            {events.slice(0, 6).map((event) => {
              const minPrice = getMinTicketPrice(event.id);
              return (
                <div key={event.id} className="event-card-small">
                  <img src={event.cover_image} alt={event.name} />
                  <h3>{event.name}</h3>
                  <p className="price">
                    {minPrice === 0
                      ? "Miễn phí"
                      : minPrice
                      ? `Từ ${minPrice.toLocaleString("vi-VN")}₫`
                      : "Liên hệ"}
                  </p>
                  <p className="date">
                    {new Date(event.start_date).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

       
        <section className="destination-section">
          <h2>Điểm đến phổ biến</h2>
          <div className="destination-list">
            <a href="/filter">
              <div className="destination-card">
                <img src={HoChiMinhcity} alt="Ho Chi Minh City" />
                <div className="destination-name">Tp. Hồ Chí Minh</div>
              </div>
            </a>

            <a href="/filter">
              <div className="destination-card">
                <img src={Hanoi} alt="Hanoi" />
                <div className="destination-name">Hà Nội</div>
              </div>
            </a>

            <a href="/filter">
              <div className="destination-card">
                <img src={DaLat} alt="Da Lat" />
                <div className="destination-name">Đà Lạt</div>
              </div>
            </a>

            <a href="/filter">
              <div className="destination-card">
                <img src={Vitrikhac} alt="Explore" />
                <div className="destination-name">Vị trí khác</div>
              </div>
            </a>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
