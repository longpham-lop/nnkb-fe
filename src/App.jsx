import React, { useState, useRef } from 'react';
import {BrowserRouter, Routes, Route, useLocation, useNavigate,} from "react-router-dom";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute from './routes/AdminRoute';
import ScrollToTop from "./Scroll";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Home from "./pages/Home/Home";
import Account from "./pages/Account/Account";
import TicketDetail from "./pages/TicketDetail/TicketDetail";
import Filter from "./components/Filter/Filter";
import OrderTicket from "./pages/OrderTicket/OrderTicket";
import Order from "./pages/Order/Order";
import PayTicket from "./pages/PayTicket/PayTicket";
import Pay from "./pages/Pay/Pay";
import MyTickets from "./pages/MyTickets/MyTickets";
import TermsPage from "./components/TermsPage/TermsPage";
import Admin from './pages/Admin/Admin';
import GoogleCallback from "./hook/GoogleCallback";
import Dashboard from './pages/Admin/Dashboard';
import Events from './pages/Admin/Events';
import Users from './pages/Admin/Users';
import Location from './pages/Admin/location'
import Categories from './pages/Admin/category';
import Tickets from './pages/Admin/ticket';
import Orders from './pages/Admin/order';
import OrderItems from './pages/Admin/order_item';
import Transactions from './pages/Admin/transaction';
import Setting from './pages/Admin/Setting';
import Payments from './pages/Admin/payment';
import { searchEvents } from "./api/event";
import MintAndTransferTicket from './pages/PayTicket/Blockchain';
import PaymentSelection from './pages/PaymentSelection/PaymentSelection';
import MyWallet from './pages/tranfer/MyWallet';
import Blockticket from './pages/Admin/blockticket';


import "./App.css";
// Import ảnh icon mạng xã hội
import Fb from "./assets/fb.png";
import Ig from "./assets/ig.png";
import Tiktok from "./assets/tiktok.png";
import Thread from "./assets/thread.png";
import Gg from "./assets/gg.png";
import Appstore from "./assets/appstore.png";
// import Banquyen from "./assets/banquyen.png";

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
          path="/auth/google/callback"
          element={
            <Motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5 }}
            >
              <GoogleCallback />
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
          element={<ProtectedRoute>
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              
              <Home />
            </Motion.div></ProtectedRoute>
          }
        />
        <Route
          path="/account"
          element={<ProtectedRoute>
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Account />
            </Motion.div></ProtectedRoute>
          }
        />
        <Route
          path="/ticketdetail"
          element={<ProtectedRoute>
            <Motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              <TicketDetail />
            </Motion.div></ProtectedRoute>
          }
        />
        <Route
          path="/filter"
          element={<ProtectedRoute>
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Filter />
            </Motion.div></ProtectedRoute>
          }
        />
        <Route
          path="/orderticket"
          element={<ProtectedRoute>
            <Motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.5 }}
            >
              <OrderTicket />
            </Motion.div></ProtectedRoute>
          }
        />
        <Route
          path="/order"
          element={<ProtectedRoute>
            <Motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.5 }}
            >
              <Order />
            </Motion.div></ProtectedRoute>
          }
        />
        <Route
          path="/payticket"
          element={<ProtectedRoute>
            <Motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.5 }}
            >
              <PayTicket />
            </Motion.div></ProtectedRoute>
          }
        />
        <Route
          path="/pay"
          element={<ProtectedRoute>
            <Motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.5 }}
            >
              <Pay />
            </Motion.div></ProtectedRoute>
          }
        />
        <Route
          path="/termspage"
          element={<ProtectedRoute>
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <TermsPage />
            </Motion.div></ProtectedRoute>
          }
        />
        <Route
          path="/mytickets"
          element={<ProtectedRoute>
            <Motion.div
              initial={{ opacity: 0 }}  
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <MyTickets />
            </Motion.div></ProtectedRoute>
          }
        />
        <Route
          path="/mywal"
          element={<ProtectedRoute>
            <Motion.div
              initial={{ opacity: 0 }}  
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <MyWallet />
            </Motion.div></ProtectedRoute>
          }
        />
        <Route
          path="/block-lo"
          element={<ProtectedRoute>
            <Motion.div
              initial={{ opacity: 0 }}  
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <MintAndTransferTicket />
            </Motion.div></ProtectedRoute>
          }
        />
        <Route
          path="/chonve"
          element={<ProtectedRoute>
            <Motion.div
              initial={{ opacity: 0 }}  
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <PaymentSelection />
            </Motion.div></ProtectedRoute>
          }
        />
          <Route
          path="/admin"
          element={<AdminRoute>
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Admin />
            </Motion.div></AdminRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="events" element={<Events />} />
          <Route path="users" element={<Users />} />
          <Route path="setting" element={<Setting />} />
          <Route path="location" element={<Location />} />
          <Route path="category" element={<Categories />} />
          <Route path="ticket" element={<Tickets />} />
          <Route path="order" element={<Orders />} />
          <Route path="orderitem" element={<OrderItems />} />
          <Route path="transaction" element={<Transactions />} />
          <Route path="payment" element={<Payments />} />
          <Route path="b-t" element={<Blockticket />} />
        </Route>
        </Routes>
    </AnimatePresence>
  );
}

function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef(null);
  //
  const handleSearch = (e) => {
    const value = e.target.value;
    setKeyword(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      if (value.trim().length > 0) {
        const res = await searchEvents(value.trim());
        setResults(res.data);
        setShowDropdown(true);
      } else {
        setShowDropdown(false);
      }
    }, 300);
  };

  const onSelectEvent = (event) => {
    localStorage.setItem("eventid", event.id);
    navigate("/ticketdetail");
    setShowDropdown(false);
    setKeyword("");
  };

  // Ẩn Header/Footer ở trang login và register
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const hideHeaderFooter =
    location.pathname === "/" 
    || location.pathname === "/register"
    || location.pathname === "/admin"
    || location.pathname === "/admin/events"
    || location.pathname === "/admin/users"
    || location.pathname === "/admin/location"
    || location.pathname === "/admin/category"
    || location.pathname === "/admin/ticket"
    || location.pathname === "/admin/order"
    || location.pathname === "/admin/orderitem"
    || location.pathname === "/admin/transaction"
    || location.pathname === "/admin/payment";
  const currentUser = user.role;

  const logout =()=>{
    localStorage.clear();
    navigate("/");
  }

  return (
    <>
      {!hideHeaderFooter && (
        <div className="home-container-app">
          <header className="header">
            {/* Logo */}
            <button className="logo" onClick={() => navigate("/home")}>
              <span className="logo-highlight">TOPTICKET</span>
            </button>

            {/* Thanh tìm kiếm */}
            <div className="search-wrapper">
              <div className="search-bar">
                <input type="text"  value={keyword}
                        onChange={handleSearch}
                        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                        onFocus={() => results.length > 0 && setShowDropdown(true)}
                         placeholder="Tìm kiếm sự kiện, nghệ sĩ..." />
                {showDropdown && results.length > 0 && (
                  <ul
                    className="dropdown"
                    
                  >
                    {results.map((item) => (
                      <li
                        key={item.id}
                        onClick={() => onSelectEvent(item)}
                        style={{ padding: "10px", cursor: "pointer" }}
                      >
                        {item.name}
                      </li>
                    ))}
                  </ul>
                )}         

                <button className="search-btn">🔍</button>
              </div>
            </div>

            {/* Các nút bên phải */}
            <div className="header-nav">
               {currentUser === "admin" && (
              <button className="btn-myticket" onClick={() => window.open("/admin", "_blank")}>
                Admin
              </button>
            )}
              <button className="btn-myticket" onClick={() => navigate("/mytickets")}>
                Vé của tôi
              </button>
              <button className="btn-account" onClick={() => navigate("/account")}>
                Tài khoản
              </button>
            </div>
            <button className='btn-logout'onClick={() => logout()}>
              Đăng xuất
            </button>
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
              <h4>Về Topticket</h4>
              <Link to = "/termspage">Giới thiệu</Link>
              <Link to = "/termspage">Điều khoản sử dụng</Link>
              <Link to ="/termspage">Chính sách bảo mật</Link>
            </div>

            <div className="footer-column">
              <h4>Dành cho nhà tổ chức</h4>
              <a href="/termspage">Hợp tác với chúng tôi</a>
              <a href="/termspage">Câu hỏi thường gặp</a>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="app-links">
              <p>Tải ứng dụng TopTicket</p>
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
            <p>TOPTICKET</p>
            <p>CÔNG TY TNHH TOPTICKET</p>
            <p>
              Địa chỉ: Tầng 6, Tòa E, 234 Hoàng Quốc Việt, Cổ
              Nhuế, Bắc Từ Liêm, Hà Nội, Việt Nam
            </p>
            <p>
              Giấy chứng nhận đăng ký doanh nghiệp số: 0924686868, cấp lần đầu
              ngày 01/01/2016, sửa đổi lần thứ 6 ngày 18/07/2023 bởi Sở Kế hoạch
              và Đầu tư Hà Nội
            </p>
          </div>
          <div className="footer-space">
            <a href ='http://online.gov.vn/'
               target="_blank"
               rel = 'noopener noreferrer'>
                
               </a>
          </div>
        </footer>
      )}
    </>
  );
}

function App() {
  return (
      <Provider store={store}>
    <BrowserRouter>
      <ScrollToTop /> 
      <Layout />
    </BrowserRouter>
    </Provider>
  );
}

export default App;
