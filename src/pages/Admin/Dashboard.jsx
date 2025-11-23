import React, { useState, useEffect } from 'react';
import './Dashboard.css';
// Import thư viện biểu đồ và icon
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LayoutGrid, Users, ShoppingCart, Package, Layers, Ticket, ArrowUpRight } from 'lucide-react';

const Dashboard = () => {
  // --- 1. STATE CỦA BẠN (GIỮ NGUYÊN) ---
  const [stats, setStats] = useState({
    users: 0,
    events: 0,
    ticketsSold: 0,
    revenue: 0, // Thêm trường doanh thu giả lập
  });

  // --- 2. DỮ LIỆU BIỂU ĐỒ GIẢ LẬP ---
  const chartData = [
    { name: '10-06', value: 100 }, { name: '10-07', value: 300 },
    { name: '10-08', value: 200 }, { name: '10-09', value: 500 },
    { name: '10-10', value: 400 }, { name: '10-11', value: 700 },
    { name: '10-12', value: 600 },
  ];

  useEffect(() => {
    // Giả lập fetch dữ liệu (Logic cũ của bạn)
    const fetchedStats = {
      users: 120,
      events: 15,
      ticketsSold: 850,
      revenue: 15000000, // Giả sử doanh thu 15 triệu
    };
    setStats(fetchedStats);
  }, []);

  // State cho tab của bảng (để làm màu thôi)
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="dashboard-wrapper">
      
      {/* --- PHẦN TRÊN: BIỂU ĐỒ & THỐNG KÊ --- */}
      <div className="top-section-grid">
        
        {/* CỘT TRÁI: BIỂU ĐỒ DOANH THU */}
        <div className="card chart-card">
          <div className="card-header">
            <div>
                <h3>Biểu đồ doanh thu</h3>
                <p className="sub-header-text">Hôm nay: {new Date().toLocaleDateString('vi-VN')}</p>
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2e3f" vertical={false} />
                <XAxis dataKey="name" stroke="#8b9bb4" tick={{fill: '#8b9bb4'}} axisLine={false} tickLine={false} />
                <YAxis stroke="#8b9bb4" tick={{fill: '#8b9bb4'}} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{backgroundColor: '#1f2233', border: 'none', color: '#fff', borderRadius: '8px'}} />
                <Line type="monotone" dataKey="value" stroke="#3d75ff" strokeWidth={3} dot={{r: 4, fill:'#3d75ff'}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CỘT PHẢI: CHỈ SỐ (STATS PANEL) */}
        <div className="card stats-panel">
          {/* Tổng doanh thu */}
          <div className="revenue-section">
            <h3>Tổng doanh thu (Tháng này)</h3>
            <h1 className="revenue-number">{stats.revenue.toLocaleString('vi-VN')} đ</h1>
            <p className="growth-text">
                <ArrowUpRight size={16} /> 
                <span>12.5% tăng trưởng hơn tháng trước</span>
            </p>
          </div>

          {/* Grid các ô nhỏ: Mapping dữ liệu của bạn vào đây */}
          <div className="stats-grid">
             {/* Ô 1: Vé đã bán */}
             <div className="stat-item">
                <div className="stat-icon green"><Ticket size={20}/></div>
                <span className="stat-value">{stats.ticketsSold}</span>
                <span className="stat-label">Vé đã bán</span>
             </div>

             {/* Ô 2: Người dùng */}
             <div className="stat-item">
                <div className="stat-icon blue"><Users size={20}/></div>
                <span className="stat-value">{stats.users}</span>
                <span className="stat-label">Khách hàng</span>
             </div>

             {/* Ô 3: Sự kiện */}
             <div className="stat-item">
                <div className="stat-icon purple"><Layers size={20}/></div>
                <span className="stat-value">{stats.events}</span>
                <span className="stat-label">Sự kiện</span>
             </div>

             {/* Các ô giả lập thêm cho đầy giao diện giống ảnh */}
             <div className="stat-item">
                <div className="stat-icon yellow"><ShoppingCart size={20}/></div>
                <span className="stat-value">24</span>
                <span className="stat-label">Đơn hàng mới</span>
             </div>
              <div className="stat-item">
                <div className="stat-icon pink"><Package size={20}/></div>
                <span className="stat-value">5</span>
                <span className="stat-label">Đang xử lý</span>
             </div>
              <div className="stat-item">
                <div className="stat-icon cyan"><LayoutGrid size={20}/></div>
                <span className="stat-value">8</span>
                <span className="stat-label">Danh mục</span>
             </div>
          </div>
        </div>
      </div>

      {/* --- PHẦN DƯỚI: BẢNG DỮ LIỆU (SỰ KIỆN SẮP DIỄN RA) --- */}
      <div className="card table-card">
        <div className="table-header-tabs">
          <h3>Sự kiện sắp diễn ra & Cần duyệt</h3>
          <div className="tabs">
            <button className={`tab ${activeTab === 'all' ? 'active' : ''}`} onClick={()=>setActiveTab('all')}>
                Tất cả <span className="badge yellow">3</span>
            </button>
            <button className={`tab ${activeTab === 'pending' ? 'active' : ''}`} onClick={()=>setActiveTab('pending')}>
                Chờ duyệt <span className="badge">1</span>
            </button>
            <button className="tab">Đã bán hết</button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>TRẠNG THÁI</th>
                <th>TÊN SỰ KIỆN</th>
                <th>NGÀY TỔ CHỨC</th>
                <th>VÉ ĐÃ BÁN</th>
                <th>DOANH THU</th>
              </tr>
            </thead>
            <tbody>
              {/* Dữ liệu mẫu giả lập dòng trong bảng */}
              <tr>
                <td>1</td>
                <td><span className="status-tag green">Đang bán</span></td>
                <td>Lễ hội Âm nhạc EDM 2025</td>
                <td>15/12/2025</td>
                <td>450/500</td>
                <td>45.000.000đ</td>
              </tr>
              <tr>
                <td>2</td>
                <td><span className="status-tag yellow">Sắp diễn ra</span></td>
                <td>Hội thảo Tech Summit</td>
                <td>20/12/2025</td>
                <td>120/200</td>
                <td>12.000.000đ</td>
              </tr>
               <tr>
                <td>3</td>
                <td><span className="status-tag red">Đã kết thúc</span></td>
                <td>Triển lãm Nghệ thuật</td>
                <td>01/11/2025</td>
                <td>300/300</td>
                <td>Miễn phí</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;