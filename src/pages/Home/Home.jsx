import React from 'react';
import './Home.css';
// import { useNavigate } from "react-router-dom";
import Banner1 from "../../assets/banner1.png";
import Banner2 from "../../assets/banner2.png";
import Banner3 from "../../assets/banner3.png";
import Banner4 from "../../assets/banner4.png";
import Banner5 from "../../assets/banner5.png";
import Banner6 from "../../assets/banner6.png";
import Banner7 from "../../assets/banner7.png";
import Banner8 from "../../assets/banner8.png";
import Banner9 from "../../assets/banner9.png";
import Banner10 from "../../assets/banner10.png";
import Gg from "../../assets/gg.png";
import Fb from "../../assets/fb.png";
import Tiktok from "../../assets/tiktok.png";
import Thread from "../../assets/thread.png";
import Ig from "../../assets/ig.png";

const Home = () => {
    // const navigate = useNavigate();
  return (
    <div className="home-container">
      {/* Header Section */}
      

      {/* Main Content */}
      <main>
        {/* Hero Banner Section */}
        <section className="hero-section">
          {/* Add your banner images here */}
          <div className="hero-banner">
            <img src={Banner1} alt="Event Banner 1" />
          </div>
          <div className="hero-banner">
            <img src={Banner2} alt="Event Banner 2" />
          </div>
        </section>

        {/* Trending Events Section */}
        <section className="event-section">
          <h2>🔥 Sự kiện đặc sắc</h2>
          <div className="event-list">
            {/* Replace with your event card components */}
            <div className="event-card-large">
              <span className="event-number">1</span>
              <img src={Banner7} alt="Event 1" />
            </div>
            <div className="event-card-large">
              <img src={Banner8} alt="Event 2" />
            </div>
            <div className="event-card-large">
              <img src={Banner9} alt="Event 3" />
            </div>
             <div className="event-card-large">
              <img src={Banner10} alt="Event 4" />
            </div>
          </div>
        </section>

        {/* Trending Categories Section */}
        <section className="event-section">
            <h2>🔥 Sự kiện xu hướng</h2>
             <div className="event-list">
                {/* Replace with your event card components */}
                <div className="event-card">
                    <img src={Banner3} alt="Event 1" />
                    <h3>Nhà Hát Kịch IDECAF: MÁ ƠI ÚT DÌA!U</h3>
                    <p className="price">Từ 270,000₫</p>
                    <p className="date">18 tháng 10, 2025</p>
                </div>
                 <div className="event-card">
                    <img src={Banner4} alt="Event 2" />
                    <h3>[CATMOUSSE] Hà Nội - Eifman Ballet World Tour in Vietnam - ANNA KARENINA</h3>
                    <p className="price">Từ 700,000₫</p>
                    <p className="date">03 tháng 12, 2025</p>
                </div>
                <div className="event-card">
                    <img src={Banner5} alt="Event 3" />
                    <h3>Hồ Chí Minh - Eifman Ballet World Tour in Vietnam - ANNA KARENINA</h3>
                    <p className="price">Từ 700,000₫</p>
                    <p className="date"> 27 tháng 11, 2025</p>
                </div>
                 <div className="event-card">
                    <img src={Banner6} alt="Event 4" />
                    <h3>EVERLASTING SYMPHONY - KIM JAEJOONG 2025 FAN MEETING IN HO CHI MINH CITY</h3>
                    <p className="price">Từ 2,600,000₫</p>
                    <p className="date">25 tháng 10, 2025</p>
                </div>
                <div className="event-card">
                    <img src={Banner6} alt="Event 4" />
                    <h3>EVERLASTING SYMPHONY - KIM JAEJOONG 2025 FAN MEETING IN HO CHI MINH CITY</h3>
                    <p className="price">Từ 2,600,000₫</p>
                    <p className="date">25 tháng 10, 2025</p>
                </div>
            </div>
        </section>


        {/* This Weekend Section */}
        <section className="event-section">
          <h2>Cuối tuần này <a href="#" className="see-more">Xem thêm &gt;</a></h2>
          <div className="event-list">
            {/* Replace with your event card components */}
            <div className="event-card-small">
              <img src="https://via.placeholder.com/280x160.png?text=Workshop+1" alt="Event 1" />
              <h3>PHÁT BẢO NGHIÊM TRUYỀN...</h3>
              <p className="price">Từ 75,000₫</p>
              <p className="date">15 Tháng 10, 2025</p>
            </div>
            <div className="event-card-small">
              <img src="https://via.placeholder.com/280x160.png?text=Workshop+2" alt="Event 2" />
              <h3>[LIENLAB] WORKSHOP TRẢI NGHIỆM...</h3>
              <p className="price">Từ 290,000₫</p>
              <p className="date">18 Tháng 10, 2025</p>
            </div>
            <div className="event-card-small">
              <img src="https://via.placeholder.com/280x160.png?text=Workshop+3" alt="Event 3" />
              <h3>[GARDEN ART] ART WORKSHOP "FRUIT...</h3>
              <p className="price">Từ 400,000₫</p>
              <p className="date">18 Tháng 10, 2025</p>
            </div>
            <div className="event-card-small">
              <img src="https://via.placeholder.com/280x160.png?text=Workshop+4" alt="Event 4" />
              <h3>ART WORKSHOP "MON-PERU STYLE BASIL...</h3>
              <p className="price">Từ 420,000₫</p>
              <p className="date">18 Tháng 10, 2025</p>
            </div>
          </div>
        </section>

         {/* Destination Section */}
         <section className="destination-section">
            <h2>Điểm đến phổ biến</h2>
            <div className="destination-list">
                <div className="destination-card">
                    <img src="https://via.placeholder.com/280x180.png?text=HCM" alt="Ho Chi Minh City" />
                    <div className="destination-name">Tp. Hồ Chí Minh</div>
                </div>
                 <div className="destination-card">
                    <img src="https://via.placeholder.com/280x180.png?text=Hanoi" alt="Hanoi" />
                    <div className="destination-name">Hà Nội</div>
                </div>
                 <div className="destination-card">
                    <img src="https://via.placeholder.com/280x180.png?text=Da+Lat" alt="Da Lat" />
                    <div className="destination-name">Đà Lạt</div>
                </div>
                 <div className="destination-card">
                    <img src="https://via.placeholder.com/280x180.png?text=Explore" alt="Explore" />
                    <div className="destination-name">Ví trí khác</div>
                </div>
            </div>
        </section>

      </main>

      {/* Footer Section */}
    </div>
  );
};

export default Home;