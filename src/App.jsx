import React from "react";
import {BrowserRouter, Routes, Route, useLocation, useNavigate,} from "react-router-dom";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { Link } from "react-router-dom";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Home from "./pages/Home/Home";
import Account from "./components/Account/Account";
import TicketDetail from "./components/TicketDetail/TicketDetail";
import Filter from "./components/Filter/Filter";
import OrderTicket from "./components/OrderTicket/OrderTicket";
import Order from "./components/Order/Order";
import PayTicket from "./components/PayTicket/PayTicket";
import Pay from "./components/Pay/Pay";
import TermsPage from "./components/TermsPage/TermsPage";
import EventPage from "./pages/Home/EventPage";

import "./App.css";
// Import ảnh icon mạng xã hội
import Fb from "./assets/fb.png";
import Ig from "./assets/ig.png";
import Tiktok from "./assets/tiktok.png";
import Thread from "./assets/thread.png";
import Gg from "./assets/gg.png";
import Appstore from "./assets/appstore.png";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <Motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5 }}
            >
              <Login />
            </Motion.div>
          }
        />
        <Route
          path="/register"
          element={
            <Motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <Register />
            </Motion.div>
          }
        />
        <Route
          path="/home"
          element={
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Home />
            </Motion.div>
          }
        />
        <Route
          path="/account"
          element={
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Account />
            </Motion.div>
          }
        />
        <Route
          path="/ticketdetail"
          element={
            <Motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              <TicketDetail />
            </Motion.div>
          }
        />
        <Route
          path="/filter"
          element={
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Filter />
            </Motion.div>
          }
        />
        <Route
          path="/orderticket"
          element={
            <Motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.5 }}
            >
              <OrderTicket />
            </Motion.div>
          }
        />
        <Route
          path="/order"
          element={
            <Motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.5 }}
            >
              <Order />
            </Motion.div>
          }
        />
        <Route
          path="/payticket"
          element={
            <Motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.5 }}
            >
              <PayTicket />
            </Motion.div>
          }
        />
        <Route
          path="/pay"
          element={
            <Motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.5 }}
            >
              <Pay />
            </Motion.div>
          }
        />
        <Route
          path="/termspage"
          element={
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <TermsPage />
            </Motion.div>
          }
        />
        <Route
          path="/eventpage"
          element={
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <EventPage />
            </Motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  // Ẩn Header/Footer ở trang login và register
  const hideHeaderFooter =
    location.pathname === "/" || location.pathname === "/register";

  return (
    <>
      {!hideHeaderFooter && (
        <div className="home-container">
          {/* Header Section */}
          <header className="header">
             <button className="logo" onClick={() => navigate("home")}>
                Topticket
              </button>

            <link
              href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;600;700&display=swap"
              rel="stylesheet"
            />

            <div className="search-bar">
              <input type="text" placeholder="Tìm tên sự kiện hay nghệ sĩ" />
              <button>Tìm kiếm</button>
            </div>

            <div className="header-nav">
              <a href="#">Tạo sự kiện</a>
              <button
                className="btn-myticket"
                onClick={() => navigate("/account")}
              >
                Vé của tôi
              </button>
              <button
                className="btn-account"
                onClick={() => navigate("/account")}
              >
                Tài khoản
              </button>
            </div>
          </header>

          <nav className="main-nav">
            <Link to="/filter">Nhạc sống</Link>
            <Link to="/filter">Sân khấu & Nghệ thuật</Link>
            <Link to="/filter">Thể thao</Link>
            <Link to="/filter">Khác</Link>
          </nav>
        </div>
      )}

      {/* Nội dung chính của từng trang */}
      <AnimatedRoutes />
        
      {!hideHeaderFooter && (
        <footer className="footer">
          <div className="footer-content">
            <div className="footer-column">
              <h4>Hỗ trợ khách hàng</h4>
              <p>Hotline: 1900.6868</p>
              <p>Email: topticket@support.vn</p>
            </div>

            <div className="footer-column">
              <h4>Về Ticketbox</h4>
              <Link to = "/termspage">Giới thiệu</Link>
              <Link to = "/termspage">Điều khoản sử dụng</Link>
              <Link to ="/termspage">Chính sách bảo mật</Link>
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
              <a href ="https://play.google.com/store/apps/details?id=ticketbox.event.user&referrer=utm_source%3Dtkbvn-website%26utm_medium%3Dreferral%26utm_campaign%3Dapp-landing-page"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                src={Gg}
                alt="Google Play"
              />
              </a>
              <a href = "https://apps.apple.com/us/app/ticketbox/id1041900498"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                src={Appstore}
                alt="App Store"
              />
              </a>
            </div>

            <div className="social-section">
              <h3 className="follow-title">Theo dõi chúng tôi</h3>
              <div className="social-icons-container">
                <a
                  href="https://www.facebook.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={Fb} alt="Facebook" />
                </a>
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={Ig} alt="Instagram" />
                </a>
                <a
                  href="https://www.tiktok.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={Tiktok} alt="TikTok" />
                </a>
                <a
                  href="https://www.threads.net/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={Thread} alt="Threads" />
                </a>
              </div>
            </div>
          </div>

          <div className="copyright">
            <p>Topticket</p>
            <p>CÔNG TY TNHH TOPTICKET</p>
            <p>
              Địa chỉ: Tầng 6, Tòa Electric Power, 234 Hoàng Quốc Việt, Cổ
              Nhuế, Bắc Từ Liêm, Hà Nội, Việt Nam
            </p>
            <p>
              Giấy chứng nhận đăng ký doanh nghiệp số: 0313605444, cấp lần đầu
              ngày 01/01/2016, sửa đổi lần thứ 6 ngày 18/07/2023 bởi Sở Kế hoạch
              và Đầu tư Hà Nội
            </p>
          </div>
        </footer>
      )}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
