import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LayoutGrid, Users, ShoppingCart, Package, Layers, Ticket, ArrowUpRight } from 'lucide-react';
import { getAllPayments } from '../../api/payment';
import { getAllOrderItems } from '../../api/orderitem';
import { getAllUsers } from '../../api/auth';
import { getAllEvents } from '../../api/event';
import { getAllLog } from '../../api/logreq';
import { getAllipblock,blocknow } from '../../api/blockip';
import { Input } from 'postcss';

const Dashboard = () => {

  const [pay, setpay] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [thunhap , setthunhap]= useState();
  const [log, setlog] = useState([]);
  const [ip, setip] = useState([]);
  const [ipp, setIpp] = useState('');


  const [activeTab, setActiveTab] = useState('events');

  const [stats, setStats] = useState({
    users: 0,
    events: 0,
    ticketsSold: 0,
    revenue: 0, 
    category: 0,
  });

  useEffect(() => {
    loadPayments();
    loadItems();
    fetchUsers();
    fetchEvents();
    fetchLog();
    fetchblock();
  }, []);

  const getMonthlyRevenue = (payments) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return payments
      .filter(p => {
        const d = new Date(p.createdAt);
        return (
          d.getMonth() === currentMonth &&
          d.getFullYear() === currentYear
        );
      })
      .reduce((sum, p) => sum + Number(p.total_paid || 0), 0);
  };

  const loadPayments = async () => {
    try {
      const res = await getAllPayments();
      const payments = res.data;

      const dailyRevenue = {};
      const monthlyRevenue = getMonthlyRevenue(payments);

      setStats(prev => ({ ...prev, revenue: monthlyRevenue }));

      payments.forEach(p => {
        const date = new Date(p.createdAt);
        const day = date.toLocaleDateString("vi-VN", { day: "2-digit" });
        const month = date.toLocaleDateString("vi-VN", { month: "2-digit" });
        const key = `${day}-${month}`;
        if (!dailyRevenue[key]) dailyRevenue[key] = 0;
        dailyRevenue[key] += p.total_paid;
      });
        
      const formatted = Object.keys(dailyRevenue).map(date => ({
        name: date,
        value: dailyRevenue[date],
      }));
      
      setChartData(formatted);

    } catch (err) {
      console.error("Lỗi load payment", err);
    }
  };

  const loadItems = async () => {
    try {
      const res = await getAllOrderItems();
      const item = res.data;
      let ve =0;
      item.forEach(i => { ve += i.quantity; });
      setStats(prev => ({ ...prev, ticketsSold: ve }));
    } catch (err) {
      console.error("Lỗi lấy danh sách chi tiết đơn hàng:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();      
      setStats(prev => ({ ...prev, users: res.data.length }));
    } catch (err) {
      console.error("Lỗi lấy danh sách users:", err);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await getAllEvents();
      setStats(prev => ({ ...prev, events: res.data.length }));
    } catch (error) {
      console.error("Lỗi load sự kiện:", error);
    }
  };

  const fetchLog = async () => {
    try {
      const res = await getAllLog();
      setlog(res.data);
    } catch (error) {
      console.error("Lỗi load log", error);
    }
  };
  //------------------------------------------\
  const fetchblock = async () => {
    try {
      const res = await getAllipblock();
      setip(res.data);
    } catch (error) {
      console.error("Lỗi load log", error);
    }
  };
  const block = async (ipp) => {
    if (!ipp) {
      alert("Vui lòng nhập IP!");
      return;
    }

    const ipRegex = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;
    if (!ipRegex.test(ipp)) {
      alert("IP không hợp lệ!");
      return;
    }

    try {
      const res = await blocknow({ ip: ipp }); // <--- Gửi đúng key 'ip'
      console.log("Block thành công:", res.data);
      alert("Block IP thành công!");
      fetchblock(); // reload danh sách IP
    } catch (error) {
      console.error("Lỗi block IP", error);
      alert(error.response?.data?.message || "Block IP thất bại!");
    }
  };
  //------------------------------------------------------------------------
  return (
    <div className="dashboard-wrapper">
      {/* --- PHẦN TRÊN: BIỂU ĐỒ & THỐNG KÊ --- */}
      <div className="top-section-grid">
        {/* BIỂU ĐỒ DOANH THU */}
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

        {/* STATS PANEL */}
        <div className="card stats-panel">
          <div className="revenue-section">
            <h3>Tổng doanh thu (Tháng này)</h3>
            <h1 className="revenue-number">{stats.revenue.toLocaleString('vi-VN')} đ</h1>
            <p className="growth-text">
                <ArrowUpRight size={16} /> 
                <span>12.5% tăng trưởng hơn tháng trước</span>
            </p>
          </div>
          <div className="stats-grid">
            <div className="stat-item">
                <div className="stat-icon green"><Ticket size={20}/></div>
                <span className="stat-value">{stats.ticketsSold}</span>
                <span className="stat-label">Vé đã bán</span>
            </div>
            <div className="stat-item">
                <div className="stat-icon blue"><Users size={20}/></div>
                <span className="stat-value">{stats.users}</span>
                <span className="stat-label">Khách hàng</span>
            </div>
            <div className="stat-item">
                <div className="stat-icon purple"><Layers size={20}/></div>
                <span className="stat-value">{stats.events}</span>
                <span className="stat-label">Sự kiện</span>
            </div>
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
                <span className="stat-value">4</span>
                <span className="stat-label">Danh mục</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- PHẦN DƯỚI: TAB & NỘI DUNG --- */}
      <div className="card table-card">
        <div className="table-header-tabs">
          <h3>Dashboard Detail</h3>
          <div className="tabs">
            <button className={`tab ${activeTab === 'events' ? 'active' : ''}`} onClick={()=>setActiveTab('events')}>Sự kiện</button>
            <button className={`tab ${activeTab === 'log' ? 'active' : ''}`} onClick={()=>setActiveTab('log')}>Log</button>
            <button className={`tab ${activeTab === 'ip' ? 'active' : ''}`} onClick={()=>setActiveTab('ip')}>IP Blocker</button>
          </div>
        </div>

        <div className="table-content">
          {activeTab === 'events' && (
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
          )}

          {activeTab === 'log' && (
            <div className="log-tab">
              <h4>Log Request</h4>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ip</th>
                      <th>method</th>
                      <th>route</th>
                      <th>user_agent</th>
                      <th>token</th>
                      <th>createdAt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {log.map((l) => (
                    <tr key={l.id}>
                      <td>{l.ip}</td>
                      <td>{l.method}</td>
                      <td>{l.route}</td>
                      <td>{l.user_agent}</td>
                      <td>{ l.token === "không có" ? l.token : 'Có'}</td>
                      <td>{l.createdAt}</td>
                    </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'ip' && (
            <div className="ip-tab">
              <h4>IP Blocker</h4>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ip</th>
                      <th>time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ip.map((l) => (
                    <tr key={l.id}>
                      <td>{l.ip}</td>
                      <td>{l.createdAt}</td>
                    </tr>
                    ))}
                  </tbody>
                </table>
                <div className="ip-block-form" style={{ marginTop: '10px' }}>
                  <label>Nhập IP muốn block:</label>
                  <input
                    type="text"
                    placeholder="128.128.128.128"
                    value={ipp}
                    onChange={(e) => setIpp(e.target.value)}
                    style={{ marginRight: '10px' }}
                  />
                  <button onClick={() => block(ipp)}>Block IP</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
