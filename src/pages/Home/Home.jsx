import React from "react";
import "./Home.css";

function Home() {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Trang đặt vé sự kiện</h1>
        <nav>
          <ul>
            <li><a href="/">Trang chủ</a></li>
            <li><a href="/events">Sự kiện</a></li>
            <li><a href="/contact">Liên hệ</a></li>
            <li><a href="/profile">Tài khoản</a></li>
          </ul>
        </nav>
      </header>

      <section className="home-banner">
        <h2>Chào mừng bạn đến với hệ thống đặt vé online 🎟️</h2>
        <p>Khám phá và đặt vé nhanh chóng, an toàn và tiện lợi.</p>
        <button className="btn-banner">Khám phá ngay</button>
      </section>

      <section className="home-events">
        <h3>Sự kiện nổi bật</h3>
        <div className="event-list">
          <div className="event-card">
            <img src="/event1.jpg" alt="Sự kiện 1" />
            <h4>Đêm nhạc hội</h4>
            <p>19:00 - 21:00, 20/10/2025</p>
            <button className="btn-buy">Đặt vé</button>
          </div>

          <div className="event-card">
            <img src="/event2.jpg" alt="Sự kiện 2" />
            <h4>Workshop thiết kế</h4>
            <p>08:30 - 12:00, 22/10/2025</p>
            <button className="btn-buy">Đặt vé</button>
          </div>

          <div className="event-card">
            <img src="/event3.jpg" alt="Sự kiện 3" />
            <h4>Talkshow công nghệ</h4>
            <p>18:00 - 20:00, 25/10/2025</p>
            <button className="btn-buy">Đặt vé</button>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <p>© 2025 Hệ thống đặt vé sự kiện. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
