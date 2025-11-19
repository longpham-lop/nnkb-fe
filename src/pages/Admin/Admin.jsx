import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './Admin.css';
// Bạn có thể import thêm icons từ thư viện như 'react-icons'
// import { FaTachometerAlt, FaUsers, FaCalendarAlt, FaCog } from 'react-icons/fa';

const Admin = () => {
  return (
    <div className="admin-layout">
      {/* ===== SIDEBAR ĐIỀU HƯỚNG ===== */}
      <nav className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h3>Admin Panel</h3>
        </div>
        <ul className="admin-nav-list">
          <li>
            {/* NavLink được dùng thay vì 'a' hay 'Link' 
              vì nó tự động thêm class 'active' khi link trùng khớp,
              giúp bạn style cho link đang được chọn.
              'end' đảm bảo link này chỉ active khi path là CHÍNH XÁC '/admin'
            */}
            <NavLink to="/admin" end>
              {/* <FaTachometerAlt /> */}
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/events">
              {/* <FaCalendarAlt /> */}
              <span>Quản lý Sự kiện (Events)</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/location">
              {/* <FaUsers /> */}
              <span>Quản lý địa điểm</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/category">
              {/* <FaUsers /> */}
              <span>Quản lý thể loại</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/ticket">
              {/* <FaUsers /> */}
              <span>Quản lý vé</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/order">
              {/* <FaUsers /> */}
              <span>Quản lý đơn hàng</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/orderitem">
              {/* <FaUsers /> */}
              <span>Quản lý chi tiết đơn hàng</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/users">
              {/* <FaUsers /> */}
              <span>Quản lý Người dùng (Users)</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/setting">
              {/* <FaCog /> */}
              <span>Cài đặt (Setting)</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* ===== KHU VỰC HIỂN THỊ NỘI DUNG CHÍNH ===== */}
      <main className="admin-content">
        {/* <Outlet /> là một component đặc biệt từ react-router-dom.
          Nó là "cửa ra" để render các component con (Dashboard, Events, Users, Setting)
          tùy thuộc vào đường dẫn (URL) mà người dùng truy cập.
        */}
        <Outlet />
      </main>
    </div>
  );
};

export default Admin;