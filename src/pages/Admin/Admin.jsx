import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, CalendarDays, Users, Settings, 
  Plus, Edit2, Trash2, X, Search, ChevronDown, ChevronUp 
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';
import './admin.css';

// --- DỮ LIỆU GIẢ (MOCK DATA) ---
const initialEventsData = [
  { id: 'evt-001', name: 'GS25 MUSIC FESTIVAL 2025', date: '2025-11-23T15:00:00', location: 'Quận 2, TP. Hồ Chí Minh', price: 499000, stock: 5000, status: 'Đang bán' },
  { id: 'evt-002', name: 'Phạm Quỳnh Anh Fan Meeting', date: '2025-11-02T14:00:00', location: 'Cici Saigon', price: 840000, stock: 1000, status: 'Đang bán' },
  { id: 'evt-003', name: 'Làng Nghe Mùa Thu', date: '2025-10-30T20:00:00', location: 'Nhà hát Lớn Hà Nội', price: 1200000, stock: 200, status: 'Sắp diễn ra' },
  { id: 'evt-004', name: 'Waterbomb Vietnam 2024', date: '2024-08-15T13:00:00', location: 'Sân vận động Phú Thọ', price: 1500000, stock: 0, status: 'Đã kết thúc' },
  { id: 'evt-005', name: 'Eifman Ballet World Tour', date: '2025-12-10T20:00:00', location: 'Trung tâm Hội nghị Quốc gia', price: 20000000, stock: 500, status: 'Nháp' },
];

// --- FORMAT TIỀN & NGÀY ---
const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
const formatDateTime = (isoString) => new Date(isoString).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

// --- SIDEBAR ---
const Sidebar = ({ activeItem, setActiveItem }) => {
  const navItems = [
    { name: 'Bảng điều khiển', icon: LayoutDashboard },
    { name: 'Sự kiện', icon: CalendarDays },
    { name: 'Người dùng', icon: Users },
    { name: 'Cài đặt', icon: Settings },
  ];

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Admin Panel</h2>
      <div className="sidebar-buttons">
        {navItems.map(item => (
          <button
            key={item.name}
            className={`nav-btn ${activeItem === item.name ? 'active' : ''}`}
            onClick={() => setActiveItem(item.name)}
          >
            <item.icon className="nav-icon" />
            {item.name}
          </button>
        ))}
      </div>
      <div className="sidebar-bottom">
        <button className="nav-btn">
          <Settings className="nav-icon" />
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

// --- MODAL ---
const EventFormModal = ({ isOpen, onClose, onSubmit, eventData }) => {
  const [formData, setFormData] = useState({});
  const [previewImage, setPreviewImage] = useState('');

  useEffect(() => {
    if (eventData) {
      const localDateTime = eventData.date
        ? new Date(new Date(eventData.date).getTime() - (new Date().getTimezoneOffset() * 60000))
            .toISOString()
            .slice(0, 16)
        : '';
      setFormData({ ...eventData, date: localDateTime });
      setPreviewImage(eventData.imageUrl || '');
    } else {
      setFormData({ name: '', date: '', location: '', price: 0, stock: 0, status: 'Sắp diễn ra', imageFile: null });
      setPreviewImage('');
    }
  }, [eventData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (name === 'image') {
      const file = files[0];
      setFormData(prev => ({ ...prev, imageFile: file }));
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) : value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      date: new Date(formData.date).toISOString(),
      imageUrl: previewImage // tạm thời lưu URL local
    };
    onSubmit(submissionData);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}><X size={24} /></button>
        <h3 className="modal-title">{eventData ? 'Chỉnh sửa Sự kiện' : 'Thêm Sự kiện Mới'}</h3>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Tên sự kiện</label>
              <input type="text" name="name" value={formData.name || ''} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Địa điểm</label>
              <input type="text" name="location" value={formData.location || ''} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-group">
            <label>Ngày & Giờ</label>
            <input type="datetime-local" name="date" value={formData.date || ''} onChange={handleChange} required />
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>Giá (VND)</label>
              <input type="number" name="price" value={formData.price || 0} onChange={handleChange} min="0" />
            </div>
            <div className="form-group">
              <label>Số lượng vé</label>
              <input type="number" name="stock" value={formData.stock || 0} onChange={handleChange} min="0" />
            </div>
            <div className="form-group">
              <label>Trạng thái</label>
              <select name="status" value={formData.status || 'Sắp diễn ra'} onChange={handleChange}>
                <option>Sắp diễn ra</option>
                <option>Đang bán</option>
                <option>Đã kết thúc</option>
                <option>Nháp</option>
              </select>
            </div>
            <div className="form-group">
              <label>Ảnh sự kiện</label>
              <input type="file" name="image" onChange={handleChange} />
              {previewImage && <img src={previewImage} alt="Preview" style={{ width: '100px', marginTop: '10px' }} />}
            </div>
          </div>
          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-cancel">Hủy</button>
            <button type="submit" className="btn-submit">{eventData ? 'Cập nhật' : 'Lưu'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};


// --- DASHBOARD BIỂU ĐỒ ---
const Dashboard = ({ events }) => {
  // Doanh thu mỗi sự kiện
  const revenueData = events.map((e) => ({
    name: e.name,
    revenue: (e.price || 0) * ((e.stock !== undefined ? 5000 : 0) - e.stock), // giả sử 5000 vé là tổng
  }));

  // Trạng thái sự kiện
  const statusCounts = events.reduce((acc, e) => {
    acc[e.status] = (acc[e.status] || 0) + 1;
    return acc;
  }, {});

  const statusData = Object.keys(statusCounts).map((key) => ({
    name: key,
    value: statusCounts[key],
  }));

  const COLORS = ['#4ade80', '#60a5fa', '#9ca3af', '#facc15']; // xanh lá, xanh dương, xám, vàng

  return (
    <div>
      <h1>Biểu đồ</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px' }}>
        <div style={{ flex: 1, minWidth: 300, height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ flex: 1, minWidth: 300, height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// --- TRANG CHÍNH ---
export default function AdminEventsPage() {
  const [activeItem, setActiveItem] = useState('Sự kiện');
  const [events, setEvents] = useState(initialEventsData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  // --- Sắp xếp & lọc ---
  const sortedEvents = useMemo(() => {
    let sortableEvents = [...events];
    sortableEvents.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      if (sortConfig.key === 'date') { aValue = new Date(aValue).getTime(); bValue = new Date(bValue).getTime(); }
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sortableEvents;
  }, [events, sortConfig]);

  const filteredEvents = useMemo(() => {
    return sortedEvents.filter(event =>
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sortedEvents, searchTerm]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const handleAddNew = () => { setCurrentEvent(null); setIsModalOpen(true); };
  const handleEdit = (event) => { setCurrentEvent(event); setIsModalOpen(true); };
  const handleDelete = (eventId) => { if(window.confirm('Bạn có chắc chắn muốn xóa sự kiện này?')) setEvents(events.filter(event => event.id !== eventId)); };
  const handleFormSubmit = (formData) => {
    if (currentEvent) {
      setEvents(events.map(event => event.id === currentEvent.id ? { ...event, ...formData } : event));
    } else {
      const newEvent = { ...formData, id: `evt-${new Date().getTime()}` };
      setEvents([newEvent, ...events]);
    }
    setIsModalOpen(false);
  };

  const getSortIcon = (key) => sortConfig.key !== key ? null : (sortConfig.direction === 'asc' ? <ChevronUp size={14}/> : <ChevronDown size={14}/>);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Đang bán': return 'badge-green';
      case 'Sắp diễn ra': return 'badge-blue';
      case 'Đã kết thúc': return 'badge-gray';
      case 'Nháp': return 'badge-yellow';
      default: return 'badge-gray';
    }
  };

  return (
    <div className="admin-container">
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
      <main className="admin-main">
        {activeItem === 'Người dùng' && <Dashboard events={events} />}
        {activeItem === 'Sự kiện' && (
          <>
            <div className="main-header">
              <h1>Quản lý Sự kiện</h1>
              <div className="header-actions">
                <div className="search-box">
                  <Search size={18} className="search-icon"/>
                  <input
                    type="text"
                    placeholder="Tìm kiếm sự kiện..."
                    value={searchTerm}
                    onChange={(e)=>setSearchTerm(e.target.value)}
                  />
                </div>
                <button className="btn-submit" onClick={handleAddNew}><Plus size={18}/> Thêm Mới</button>
              </div>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th><button onClick={()=>requestSort('name')}>Tên sự kiện {getSortIcon('name')}</button></th>
                    <th>Trạng thái</th>
                    <th><button onClick={()=>requestSort('date')}>Thời gian {getSortIcon('date')}</button></th>
                    <th>Địa điểm</th>
                    <th><button onClick={()=>requestSort('price')}>Giá vé {getSortIcon('price')}</button></th>
                    <th><button onClick={()=>requestSort('stock')}>Còn lại {getSortIcon('stock')}</button></th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.map(event => (
                    <tr key={event.id}>
                      <td>{event.name}</td>
                      <td><span className={`status-badge ${getStatusBadge(event.status)}`}>{event.status}</span></td>
                      <td>{formatDateTime(event.date)}</td>
                      <td>{event.location}</td>
                      <td>{formatCurrency(event.price)}</td>
                      <td>{event.stock>0 ? `${event.stock} vé` : 'Hết vé'}</td>
                      <td>
                        <button className="btn-edit" onClick={()=>handleEdit(event)}><Edit2 size={18}/></button>
                        <button className="btn-delete" onClick={()=>handleDelete(event.id)}><Trash2 size={18}/></button>
                      </td>
                    </tr>
                  ))}
                  {filteredEvents.length===0 && <tr><td colSpan="7" className="no-data">Không tìm thấy sự kiện nào.</td></tr>}
                </tbody>
              </table>
            </div>
          </>
        )}

       
      </main>
      <EventFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        eventData={currentEvent}
      />
    </div>
  );
}
