import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./Home.css";

import { getUniqueValues,recommendEventsTF,eventToFeatures,buildModel } from "../../components/RecommendationsTF";
import { getEventHistory } from '../../utils/behavior';


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
  const [specialEvents, setSpecialEvents] = useState([]);
  const [trendEvents, setTrendEvents] = useState([]);
  const [weekendEvents, setWeekendEvents] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [recommendedEvents, setRecommendedEvents] = useState([]);
  
  // ========================= RANDOM FUNCTION =========================
  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

  // ========================= FETCH DATA =========================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventRes, categoryRes, locationRes, ticketRes] = await Promise.all([
          getAllEvents(),
          getAllCategories(),
          getAllLocations(),
          getAllTickets(),
        ]);

        const eventsData = eventRes.data || [];

        // Random 3 danh sách khác nhau
        setSpecialEvents(shuffle(eventsData).slice(0, 6)); // đặc sắc
        setTrendEvents(shuffle(eventsData).slice(0, 5)); // xu hướng
        setWeekendEvents(shuffle(eventsData).slice(0, 6)); // cuối tuần

        const flatEvents = eventsData.map(ev => {
          const loc = locationRes.data.find(l => l.id === ev.location_id)?.name || "Khác";
          const cat = categoryRes.data.find(c => c.id === ev.category_id)?.name || "Khác";
          const price = ticketRes.data.filter(t => t.event_id === ev.id).map(t => Number(t.price));
          return {
            ...ev,
            location: loc,
            category: cat,
            artist: ev.artist || "A", // nếu chưa có artist
            price: price.length ? Math.min(...price) : 0,
          };
        });

        // lấy unique values cho one-hot encoding
        const uniques = getUniqueValues(flatEvents);

        // lấy lịch sử xem user từ localStorage
        const history = getEventHistory();
        const featuresHistory = history.map(ev => eventToFeatures(ev, uniques));

        if (featuresHistory.length > 0) {
          const avgFeatures = buildModel(featuresHistory);
          const recommended = recommendEventsTF(flatEvents, avgFeatures, uniques);
          setRecommendedEvents(recommended);
        }

        setTickets(ticketRes.data || []);
      } catch (err) {
        console.error("Lỗi load dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ========================= MIN PRICE FUNCTION =========================
  const getMinTicketPrice = (eventId) => {
    const eventTickets = tickets.filter((t) => t.event_id === eventId);
    if (eventTickets.length === 0) return null;
    return Math.min(...eventTickets.map((t) => Number(t.price)));
  };

  // ========================= SCROLL LEFT / RIGHT =========================
  const scrollLeft = (id) => {
    const el = document.getElementById(id);
    el.scrollBy({ left: -400, behavior: "smooth" });
  };

  const scrollRight = (id) => {
    const el = document.getElementById(id);
    el.scrollBy({ left: 400, behavior: "smooth" });
  };

  const navto = (e) =>{
    localStorage.setItem("eventid", e);
    navigate("/ticketdetail");

  }

  // ========================= DRAG SCROLL =========================
  useEffect(() => {
    const sliders = document.querySelectorAll(".event-list");
    sliders.forEach((slider) => {
      let isDown = false;
      let startX;
      let scrollLeft;

      const mouseDown = (e) => {
        isDown = true;
        slider.classList.add("active");
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
      };

      const mouseLeave = () => {
        isDown = false;
        slider.classList.remove("active");
      };

      const mouseUp = () => {
        isDown = false;
        slider.classList.remove("active");
      };

      const mouseMove = (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2;
        slider.scrollLeft = scrollLeft - walk;
      };

      slider.addEventListener("mousedown", mouseDown);
      slider.addEventListener("mouseleave", mouseLeave);
      slider.addEventListener("mouseup", mouseUp);
      slider.addEventListener("mousemove", mouseMove);

      return () => {
        slider.removeEventListener("mousedown", mouseDown);
        slider.removeEventListener("mouseleave", mouseLeave);
        slider.removeEventListener("mouseup", mouseUp);
        slider.removeEventListener("mousemove", mouseMove);
      };
    });
  }, [specialEvents, trendEvents, weekendEvents]);

  if (loading) return <p>Đang tải dữ liệu...</p>;

  // ========================= RETURN HTML =========================
  return (
    <div className="home-container">
      <main>

        {/* ============================= MARQUEE ============================= */}
        <section className="marquee-slider">
          <div className="marquee-track">
            {specialEvents
              .slice(0, 5)
              .concat(specialEvents.slice(0, 5))
              .map((event, idx) => (
                <div key={event.id + "-" + idx} className="marquee-item">
                  <img src={event.cover_image} alt={event.name} />
                </div>
              ))}
          </div>
        </section>

        {recommendedEvents.length > 0 && (
          <section className="event-section">
            <h2>✨ Gợi ý cho bạn</h2>
            <div className="event-wrapper">
              <button className="arrow left" onClick={() => scrollLeft("recommended")}>❮</button>
              <div className="event-list" id="recommended">
                {recommendedEvents.map((event) => (
                  <div
                    key={event.id}
                    className="event-card"
                    onClick={() => navto(event.id)}
                  >
                    <img src={event.cover_image} alt={event.name} />
                    <h3>{event.name}</h3>
                    <p className="price">
                      {event.price === 0
                        ? "Miễn phí"
                        : `Từ ${event.price.toLocaleString("vi-VN")}₫`}
                    </p>
                  </div>
                ))}
              </div>
              <button className="arrow right" onClick={() => scrollRight("recommended")}>❯</button>
            </div>
          </section>
        )}

        {/* ============================= SỰ KIỆN ĐẶC SẮC ============================= */}
        <section className="event-section">
          <h2>🔥 Sự kiện đặc sắc</h2>

          <div className="event-wrapper">
            <button className="arrow left" onClick={() => scrollLeft("special")}>❮</button>

            <div className="event-list" id="special">
              {specialEvents.map((event) => (
                <div
                  key={event.id}
                  className="event-card-large"
                  onClick={() => navto(event.id)}
                >
                  <img src={event.cover_image} alt={event.name} />
                  <h3>{event.name}</h3>
                  <p className="price">
                    {getMinTicketPrice(event.id) === 0
                      ? "Miễn phí"
                      : getMinTicketPrice(event.id)
                      ? `Từ ${getMinTicketPrice(event.id).toLocaleString("vi-VN")}₫`
                      : "Liên hệ"}
                  </p>
                </div>
              ))}
            </div>

            <button className="arrow right" onClick={() => scrollRight("special")}>❯</button>
          </div>
        </section>

        {/* ============================= SỰ KIỆN XU HƯỚNG ============================= */}
        <section className="event-section">
          <h2>🔥 Sự kiện xu hướng</h2>

          <div className="event-wrapper">
            <button className="arrow left" onClick={() => scrollLeft("trend")}>❮</button>

            <div className="event-list" id="trend">
              {trendEvents.map((event) => (
                <div
                  key={event.id}
                  className="event-card"
                  onClick={() => navto(event.id)}
                >
                  <img src={event.cover_image} alt={event.name} />
                  <h3>{event.name}</h3>
                  <p className="price">
                    {getMinTicketPrice(event.id) === 0
                      ? "Miễn phí"
                      : getMinTicketPrice(event.id)
                      ? `Từ ${getMinTicketPrice(event.id).toLocaleString("vi-VN")}₫`
                      : "Liên hệ"}
                  </p>
                </div>
              ))}
            </div>

            <button className="arrow right" onClick={() => scrollRight("trend")}>❯</button>
          </div>
        </section>

        {/* ============================= TOP TICKET ============================= */}
        <div className="topticket">
          <img src={Topticket} alt="Top Ticket" />
        </div>

        {/* ============================= CUỐI TUẦN NÀY ============================= */}
        <section className="event-section">
          <h2>
            Cuối tuần này <a href="/filter" className="see-more">Xem thêm &gt;</a>
          </h2>

          <div className="event-wrapper">
            <button className="arrow left" onClick={() => scrollLeft("weekend")}>❮</button>

            <div className="event-list" id="weekend">
              {weekendEvents.map((event) => (
                <div
                  key={event.id}
                  className="event-card-small"
                  onClick={() => navto(event.id)}
                >
                  <img src={event.cover_image} alt={event.name} />
                  <h3>{event.name}</h3>
                  <p className="price">
                    {getMinTicketPrice(event.id) === 0
                      ? "Miễn phí"
                      : getMinTicketPrice(event.id)
                      ? `Từ ${getMinTicketPrice(event.id).toLocaleString("vi-VN")}₫`
                      : "Liên hệ"}
                  </p>
                </div>
              ))}
            </div>

            <button className="arrow right" onClick={() => scrollRight("weekend")}>❯</button>
          </div>
        </section>

        {/* ============================= ĐIỂM ĐẾN ============================= */}
        <section className="destination-section">
          <h2>Điểm đến phổ biến</h2>

          <div className="destination-list">
            {[HoChiMinhcity, Hanoi, DaLat, Vitrikhac].map((img, idx) => {
              const names = ["Tp. Hồ Chí Minh", "Hà Nội", "Đà Lạt", "Vị trí khác"];
              return (
                <a href="/filter" key={idx}>
                  <div className="destination-card">
                    <img src={img} alt={names[idx]} />
                    <div className="destination-name">{names[idx]}</div>
                  </div>
                </a>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
