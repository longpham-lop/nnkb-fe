import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './Admin.css';
import { 
  LayoutDashboard, 
  Calendar, 
  MapPin, 
  Layers, 
  Ticket, 
  ShoppingCart, 
  List, 
  CreditCard, 
  DollarSign, 
  Users, 
  Settings,
  LogOut
} from 'lucide-react';

const Admin = () => {
  return (
    <div className="admin-layout">
      {/* --- SIDEBAR --- */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div className="logo-icon">A</div>
          <h3>Admin Control</h3>
        </div>

        <nav className="sidebar-nav">
          <ul className="nav-list">
            <li>
              <NavLink to="/admin" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                <LayoutDashboard size={20} />
                <span>Dashboard</span>
              </NavLink>
            </li>
            
            <li className="nav-section-label">QUẢN LÝ SỰ KIỆN</li>
            
            <li>
              <NavLink to="/admin/events" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                <Calendar size={20} />
                <span>Sự kiện (Events)</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/location" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                <MapPin size={20} />
                <span>Địa điểm</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/category" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                <Layers size={20} />
                <span>Thể loại</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/ticket" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                <Ticket size={20} />
                <span>Vé sự kiện</span>
              </NavLink>
            </li>

            <li className="nav-section-label">KINH DOANH</li>

            <li>
              <NavLink to="/admin/order" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                <ShoppingCart size={20} />
                <span>Đơn hàng</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/orderitem" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                <List size={20} />
                <span>Chi tiết đơn hàng</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/b-t" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                <List size={20} />
                <span>Chi tiết đơn blockticket</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/transaction" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                <CreditCard size={20} />
                <span>Giao dịch</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/payment" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                <DollarSign size={20} />
                <span>Thanh toán</span>
              </NavLink>
            </li>

            <li className="nav-section-label">HỆ THỐNG</li>

            <li>
              <NavLink to="/admin/users" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                <Users size={20} />
                <span>Người dùng</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/setting" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                <Settings size={20} />
                <span>Cài đặt</span>
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
            <button className="logout-btn">
                <LogOut size={18} />
                <span>Đăng xuất</span>
            </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="admin-content">
        {/* Header Mobile hoặc Breadcrumb có thể đặt ở đây nếu cần */}
        <Outlet />
      </main>
    </div>
  );
};

export default Admin;