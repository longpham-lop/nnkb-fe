import React, { useEffect, useState } from "react";
import "./Home.css";

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

  // --- Lấy dữ liệu ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventRes, categoryRes, locationRes, ticketRes] = await Promise.all([
          getAllEvents(),
          getAllCategories(),
          getAllLocations(),
          getAllTickets(),
        ]);
        const shuffleArray = (arr) => arr.sort(() => Math.random() - 0.5);

        setEvents(shuffleArray(eventRes.data || []));
        setLocations(locationRes.data || []);
        setTickets(ticketRes.data || []);
    
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

  // --- Tìm giá vé thấp nhất ---
  const getMinTicketPrice = (eventId) => {
    const eventTickets = tickets.filter((t) => t.event_id === eventId);
    if (eventTickets.length === 0) return null;
    return Math.min(...eventTickets.map((t) => Number(t.price)));
  };
  const scrollLeft = (id) => {
    const el = document.getElementById(id);
    el.scrollBy({ left: -400, behavior: "smooth" });
  };

  const scrollRight = (id) => {
    const el = document.getElementById(id);
    el.scrollBy({ left: 400, behavior: "smooth" });
  };

  // --- Slider Drag & Drop ---
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
        const walk = (x - startX) * 2; // tốc độ scroll
        slider.scrollLeft = scrollLeft - walk;
      };

      slider.addEventListener("mousedown", mouseDown);
      slider.addEventListener("mouseleave", mouseLeave);
      slider.addEventListener("mouseup", mouseUp);
      slider.addEventListener("mousemove", mouseMove);

      // Cleanup
      return () => {
        slider.removeEventListener("mousedown", mouseDown);
        slider.removeEventListener("mouseleave", mouseLeave);
        slider.removeEventListener("mouseup", mouseUp);
        slider.removeEventListener("mousemove", mouseMove);
      };
    });
  }, [events]);

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className="home-container">
      <main>
        {/* ============================= MARQUEE ============================= */}
        <section className="marquee-slider">
          <div className="marquee-track">
            {events.slice(0, 5).concat(events.slice(0, 5)).map((event, idx) => (
              <div key={event.id + "-" + idx} className="marquee-item">
                <img src={event.cover_image} alt={event.name} />
              </div>
            ))}
          </div>
        </section>

        {/* ============================= SỰ KIỆN ĐẶC SẮC ============================= */}
        <section className="event-section">
          <h2>🔥 Sự kiện đặc sắc</h2>

          <div className="event-wrapper">
            <button className="arrow left" onClick={() => scrollLeft("special")}>
              ❮
            </button>

            <div className="event-list" id="special">
              {events.slice(0, 6).map((event) => (
                <div
                  key={event.id}
                  className="event-card-large"
                  onDoubleClick={() => window.location.href = `/detail/${event.id}`}
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
                  <p className="date">
                    {new Date(event.start_date).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              ))}
            </div>

            <button className="arrow right" onClick={() => scrollRight("special")}>
              ❯
            </button>
          </div>
        </section>


        {/* ============================= SỰ KIỆN XU HƯỚNG ============================= */}
        <section className="event-section">
          <h2>🔥 Sự kiện xu hướng</h2>
          <div className="event-wrapper">
            <button className="arrow left" onClick={() => scrollLeft("specials")}>
              ❮
            </button>
          <div className="event-list" id ="specials">
            {events.slice(0, 5).map((event) => (
              <div key={event.id} className="event-card">
                <img src={event.cover_image} alt={event.name} />
                <h3>{event.name}</h3>
                <p className="price">
                  {getMinTicketPrice(event.id) === 0
                    ? "Miễn phí"
                    : getMinTicketPrice(event.id)
                    ? `Từ ${getMinTicketPrice(event.id).toLocaleString("vi-VN")}₫`
                    : "Liên hệ"}
                </p>
                <p className="date">
                  {new Date(event.start_date).toLocaleDateString("vi-VN")}
                </p>
              </div>
            ))}
          </div>
           <button className="arrow right" onClick={() => scrollRight("specials")}>
              ❯
            </button>
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
            <button className="arrow left" onClick={() => scrollLeft("specialss")}>
              ❮
            </button>
          <div className="event-list" id ="specialss">
            {events.slice(0, 6).map((event) => (
              <div key={event.id} className="event-card-small">
                <img src={event.cover_image} alt={event.name} />
                <h3>{event.name}</h3>
                <p className="price">
                  {getMinTicketPrice(event.id) === 0
                    ? "Miễn phí"
                    : getMinTicketPrice(event.id)
                    ? `Từ ${getMinTicketPrice(event.id).toLocaleString("vi-VN")}₫`
                    : "Liên hệ"}
                </p>
                <p className="date">
                  {new Date(event.start_date).toLocaleDateString("vi-VN")}
                </p>
              </div>
            ))}
          </div>
          <button className="arrow right" onClick={() => scrollRight("specialss")}>
              ❯
            </button>
          </div>
        </section>

        {/* ============================= ĐIỂM ĐẾN PHỔ BIẾN ============================= */}
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
