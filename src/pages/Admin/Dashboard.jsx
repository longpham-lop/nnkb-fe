import React, { useState, useEffect } from 'react';
import './Dashboard.css';
// import { FaUsers, FaCalendarAlt, FaTicketAlt } from 'react-icons/fa'; 

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    events: 0,
    ticketsSold: 0,
  });

  // Giả lập việc fetch dữ liệu khi component được tải
  useEffect(() => {
    // Thay thế bằng API call thật
    const fetchedStats = {
      users: 120,
      events: 15,
      ticketsSold: 850,
    };
    setStats(fetchedStats);
  }, []);

  return (
    <div className="dashboard-page">
      <h2>Bảng điều khiển</h2>
      
      <div className="stats-container">
        <div className="stat-card">
          {/* <FaUsers size={30} /> */}
          <div className="stat-info">
            <p>Tổng người dùng</p>
            <span>{stats.users}</span>
          </div>
        </div>
        
        <div className="stat-card">
          {/* <FaCalendarAlt size={30} /> */}
          <div className="stat-info">
            <p>Tổng sự kiện</p>
            <span>{stats.events}</span>
          </div>
        </div>
        
        <div className="stat-card">
          {/* <FaTicketAlt size={30} /> */}
          <div className="stat-info">
            <p>Vé đã bán</p>
            <span>{stats.ticketsSold}</span>
          </div>
        </div>
      </div>
      
      <div className="dashboard-widgets">
        <div className="widget">
          <h3>Doanh thu (Biểu đồ)</h3>
          {/* Bạn có thể thêm thư viện biểu đồ như Chart.js hoặc Recharts ở đây */}
          <p style={{textAlign: 'center', padding: '20px'}}>Nội dung biểu đồ ở đây</p>
        </div>
        <div className="widget">
          <h3>Sự kiện sắp diễn ra</h3>
          <ul>
            <li>Sự kiện A - (01/12/2025)</li>
            <li>Sự kiện B - (15/12/2025)</li>
            <li>Sự kiện C - (25/12/2025)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;