import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './Admin.css';
// Bạn có thể import thêm icons từ thư viện như 'react-icons'
// import { FaTachometerAlt, FaUsers, FaCalendarAlt, FaCog } from 'react-icons/fa';

const Admin = () => {
  return (
    <div className="admin-layout">
      <nav className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h3>Admin Panel</h3>
        </div>
        <ul className="admin-nav-list">
          <li>
            <NavLink to="/admin" end>
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/events">
              <span>Quản lý Sự kiện (Events)</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/location">
              <span>Quản lý địa điểm</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/category">
              <span>Quản lý thể loại</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/ticket">
              <span>Quản lý vé</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/order">
              <span>Quản lý đơn hàng</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/orderitem">
              <span>Quản lý chi tiết đơn hàng</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/transaction">
              <span>Quản lý giao dịch</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/payment">
              <span>Quản lý thanh toán</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/users">
              <span>Quản lý Người dùng (Users)</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/setting">
              <span>Cài đặt (Setting)</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Admin;