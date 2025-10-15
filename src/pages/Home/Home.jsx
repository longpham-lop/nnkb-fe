import React from 'react';
import './Home.css';
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

const Home = () => {
  return (
    <div className="home-container">
      {/* Header Section */}
      <header className="header">
        <div className="logo">Topticket</div>
 
        <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;600;700&display=swap" rel="stylesheet"></link>
        <div className="search-bar">
          <input type="text" placeholder="Tìm tên sự kiện hay nghệ sĩ" />
          <button>Tìm kiếm</button>
        </div>
        <div className="header-nav">
          <a href="#">Tạo sự kiện</a>
          <a href="#">Vé của tôi</a>
          <a href="#">Tài khoản</a>
        </div>
      </header>
      <nav className="main-nav">
        <a href="#">Nhạc sống</a>
        <a href="#">Sân khấu & Nghệ thuật</a>
        <a href="#">Thể thao</a>
        <a href="#">Khác</a>
      </nav>

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
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-column">
            <h4>Hỗ trợ khách hàng</h4>
            <p>Hotline: 1900.6408</p>
            <p>Email: support@ticketbox.vn</p>
          </div>
          <div className="footer-column">
            <h4>Về Ticketbox</h4>
            <a href="#">Giới thiệu</a>
            <a href="#">Điều khoản sử dụng</a>
            <a href="#">Chính sách bảo mật</a>
          </div>
          <div className="footer-column">
            <h4>Dành cho nhà tổ chức</h4>
            <a href="#">Hợp tác với chúng tôi</a>
            <a href="#">Câu hỏi thường gặp</a>
          </div>
        </div>
        <div className="footer-bottom">
            <div className="app-links">
                <p>Tải ứng dụng Ticketbox</p>
                <img src="https://via.placeholder.com/120x40.png?text=Google+Play" alt="Google Play" />
                <img src="https://via.placeholder.com/120x40.png?text=App+Store" alt="App Store" />
            </div>
            <div className="social-links">
                 <p>Theo dõi chúng tôi</p>
                 {/* Add social icons here */}
            </div>
        </div>
        <div className="copyright">
            <p>ticketbox</p>
            <p>CÔNG TY TNHH TICKETBOX</p>
            <p>Địa chỉ: Tầng 6, Tòa nhà Circo, 222 Điện Biên Phủ, Phường Võ Thị Sáu, Quận 3, Thành phố Hồ Chí Minh, Việt Nam</p>
            <p>Giấy chứng nhận đăng ký doanh nghiệp số: 0313605444, cấp lần đầu ngày 01/01/2016, sửa đổi lần thứ 6 ngày 18/07/2023 bởi Sở Kế hoạch và Đầu tư TPHCM</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;