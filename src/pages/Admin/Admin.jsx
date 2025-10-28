import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, CalendarDays, Users, Settings, 
  Plus, Edit2, Trash2, X, Search, ChevronDown, ChevronUp 
} from 'lucide-react';

// --- DỮ LIỆU GIẢ (MOCK DATA) ---
// Trong ứng dụng thật, bạn sẽ lấy dữ liệu này từ API/Backend
const initialEventsData = [
  {
    id: 'evt-001',
    name: 'GS25 MUSIC FESTIVAL 2025',
    date: '2025-11-23T15:00:00',
    location: 'Quận 2, TP. Hồ Chí Minh',
    price: 499000,
    stock: 5000,
    status: 'Đang bán',
  },
  {
    id: 'evt-002',
    name: 'Phạm Quỳnh Anh Fan Meeting',
    date: '2025-11-02T14:00:00',
    location: 'Cici Saigon',
    price: 840000,
    stock: 1000,
    status: 'Đang bán',
  },
  {
    id: 'evt-003',
    name: 'Làng Nghe Mùa Thu',
    date: '2025-10-30T20:00:00',
    location: 'Nhà hát Lớn Hà Nội',
    price: 1200000,
    stock: 200,
    status: 'Sắp diễn ra',
  },
  {
    id: 'evt-004',
    name: 'Waterbomb Vietnam 2024',
    date: '2024-08-15T13:00:00',
    location: 'Sân vận động Phú Thọ',
    price: 1500000,
    stock: 0,
    status: 'Đã kết thúc',
  },
  {
    id: 'evt-005',
    name: 'Eifman Ballet World Tour',
    date: '2025-12-10T20:00:00',
    location: 'Trung tâm Hội nghị Quốc gia',
    price: 20000000,
    stock: 500,
    status: 'Nháp',
  },
];

// Hàm format tiền tệ
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

// Hàm format ngày tháng
const formatDateTime = (isoString) => {
  return new Date(isoString).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// --- COMPONENT SIDEBAR ---
const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('Sự kiện');
  const navItems = [
    { name: 'Bảng điều khiển', icon: LayoutDashboard },
    { name: 'Sự kiện', icon: CalendarDays },
    { name: 'Người dùng', icon: Users },
    { name: 'Cài đặt', icon: Settings },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-5 flex flex-col">
      <h2 className="text-2xl font-bold mb-10">Admin Panel</h2>
      <nav>
        <ul>
          {navItems.map((item) => (
            <li key={item.name} className="mb-2">
              <a
                href="#"
                className={`flex items-center p-3 rounded-lg transition-colors ${
                  activeItem === item.name
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
                onClick={() => setActiveItem(item.name)}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto">
        <a href="#" className="flex items-center p-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white">
          <Settings className="w-5 h-5 mr-3" />
          Đăng xuất
        </a>
      </div>
    </div>
  );
};

// --- COMPONENT MODAL THÊM/SỬA SỰ KIỆN ---
const EventFormModal = ({ isOpen, onClose, onSubmit, eventData }) => {
  const [formData, setFormData] = useState({});

  // Khi `eventData` thay đổi (khi bấm nút "Sửa"), cập nhật form
  useEffect(() => {
    if (eventData) {
      // Format lại ngày tháng cho input type="datetime-local"
      const localDateTime = eventData.date ? new Date(new Date(eventData.date).getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().slice(0, 16) : '';
      setFormData({ ...eventData, date: localDateTime });
    } else {
      // Reset form khi thêm mới
      setFormData({
        name: '',
        date: '',
        location: '',
        price: 0,
        stock: 0,
        status: 'Sắp diễn ra',
      });
    }
  }, [eventData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Chuyển đổi ngày giờ về ISO string trước khi gửi
    const submissionData = {
      ...formData,
      date: new Date(formData.date).toISOString(),
    };
    onSubmit(submissionData);
    onClose();
  };

  return (
    // Lớp phủ
    <div className="fixed inset-0 bg-black bg-opacity-60 z-40 flex justify-center items-center">
      {/* Nội dung Modal */}
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl relative animate-modal-pop">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>
        <h3 className="text-2xl font-bold mb-6 text-gray-800">
          {eventData ? 'Chỉnh sửa Sự kiện' : 'Thêm Sự kiện Mới'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tên sự kiện */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Tên sự kiện</label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {/* Địa điểm */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Địa điểm</label>
              <input
                type="text"
                name="location"
                value={formData.location || ''}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Ngày & Giờ */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Ngày & Giờ</label>
            <input
              type="datetime-local"
              name="date"
              value={formData.date || ''}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Giá vé */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Giá (VND)</label>
              <input
                type="number"
                name="price"
                value={formData.price || 0}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>
            {/* Số lượng vé */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Số lượng vé</label>
              <input
                type="number"
                name="stock"
                value={formData.stock || 0}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>
            {/* Trạng thái */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Trạng thái</label>
              <select
                name="status"
                value={formData.status || 'Sắp diễn ra'}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option>Sắp diễn ra</option>
                <option>Đang bán</option>
                <option>Đã kết thúc</option>
                <option>Nháp</option>
              </select>
            </div>
          </div>

          {/* Nút bấm */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
            >
              {eventData ? 'Cập nhật' : 'Lưu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// --- COMPONENT TRANG CHÍNH ---
export default function AdminEventsPage() {
  const [events, setEvents] = useState(initialEventsData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null); // Dùng để xác định Sửa hay Thêm
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  // Logic Sắp xếp
  const sortedEvents = useMemo(() => {
    let sortableEvents = [...events];
    sortableEvents.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Xử lý sort cho ngày tháng
      if (sortConfig.key === 'date') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    return sortableEvents;
  }, [events, sortConfig]);

  // Logic Lọc/Tìm kiếm
  const filteredEvents = useMemo(() => {
    return sortedEvents.filter((event) =>
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sortedEvents, searchTerm]);

  // Hàm đổi chiều sắp xếp
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Hàm mở modal để THÊM
  const handleAddNew = () => {
    setCurrentEvent(null);
    setIsModalOpen(true);
  };

  // Hàm mở modal để SỬA
  const handleEdit = (event) => {
    setCurrentEvent(event);
    setIsModalOpen(true);
  };

  // Hàm XÓA
  const handleDelete = (eventId) => {
    // Hiện thông báo xác nhận
    if (window.confirm('Bạn có chắc chắn muốn xóa sự kiện này?')) {
      setEvents(events.filter((event) => event.id !== eventId));
      // Trong ứng dụng thật, gọi API xóa ở đây
    }
  };

  // Hàm xử lý khi submit form
  const handleFormSubmit = (formData) => {
    if (currentEvent) {
      // SỬA: Cập nhật sự kiện
      setEvents(
        events.map((event) =>
          event.id === currentEvent.id ? { ...event, ...formData } : event
        )
      );
      // Gọi API Sửa (PUT/PATCH) ở đây
    } else {
      // THÊM: Tạo sự kiện mới
      const newEvent = {
        ...formData,
        id: `evt-${new Date().getTime()}`, // Tạo ID tạm
      };
      setEvents([newEvent, ...events]);
      // Gọi API Thêm (POST) ở đây
    }
    setIsModalOpen(false);
  };

  // Hàm render biểu tượng sort
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return null;
    }
    if (sortConfig.direction === 'asc') {
      return <ChevronUp size={14} className="ml-1" />;
    }
    return <ChevronDown size={14} className="ml-1" />;
  };

  // Hàm render class cho Trạng thái
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Đang bán':
        return 'bg-green-100 text-green-800';
      case 'Sắp diễn ra':
        return 'bg-blue-100 text-blue-800';
      case 'Đã kết thúc':
        return 'bg-gray-100 text-gray-800';
      case 'Nháp':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      {/* --- KHU VỰC NỘI DUNG CHÍNH --- */}
      <main className="flex-1 p-8 md:p-10">
        {/* Header của Main */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Quản lý Sự kiện</h1>
          <div className="flex items-center gap-4 w-full md:w-auto">
            {/* Thanh Tìm kiếm */}
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Tìm kiếm sự kiện..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            {/* Nút Thêm mới */}
            <button
              onClick={handleAddNew}
              className="flex items-center justify-center bg-blue-600 text-white px-5 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md whitespace-nowrap"
            >
              <Plus size={18} className="mr-2" />
              Thêm Mới
            </button>
          </div>
        </div>

        {/* --- BẢNG DỮ LIỆU --- */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              {/* Tiêu đề bảng */}
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button onClick={() => requestSort('name')} className="flex items-center">
                      Tên sự kiện {getSortIcon('name')}
                    </button>
                  </th>
                  <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button onClick={() => requestSort('date')} className="flex items-center">
                      Thời gian {getSortIcon('date')}
                    </button>
                  </th>
                  <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Địa điểm
                  </th>
                  <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button onClick={() => requestSort('price')} className="flex items-center">
                      Giá vé {getSortIcon('price')}
                    </button>
                  </th>
                  <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button onClick={() => requestSort('stock')} className="flex items-center">
                      Còn lại {getSortIcon('stock')}
                    </button>
                  </th>
                  <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              {/* Thân bảng */}
              <tbody className="divide-y divide-gray-200">
                {filteredEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 whitespace-nowrap">
                      <span className="font-medium text-gray-900">{event.name}</span>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                          event.status
                        )}`}
                      >
                        {event.status}
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDateTime(event.date)}
                    </td>
                    <td className="p-4 whitespace-nowrap text-sm text-gray-600 max-w-xs truncate">
                      {event.location}
                    </td>
                    <td className="p-4 whitespace-nowrap text-sm text-gray-600">
                      {formatCurrency(event.price)}
                    </td>
                    <td className="p-4 whitespace-nowrap text-sm text-gray-600">
                      {event.stock > 0 ? `${event.stock} vé` : 'Hết vé'}
                    </td>
                    <td className="p-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(event)}
                        className="text-blue-600 hover:text-blue-800 mr-4 transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Thông báo khi không có kết quả */}
          {filteredEvents.length === 0 && (
            <div className="text-center p-10 text-gray-500">
              Không tìm thấy sự kiện nào.
            </div>
          )}
        </div>
      </main>

      {/* --- MODAL FORM --- */}
      <EventFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        eventData={currentEvent}
      />
    </div>
  );
}

/* --- Thêm CSS cho animation (nếu cần) ---
   Bạn có thể thêm đoạn này vào file CSS chung của mình
   (ví dụ: App.css hoặc index.css)
*/
/*
@keyframes modal-pop {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
.animate-modal-pop {
  animation: modal-pop 0.2s ease-out;
}
*/
