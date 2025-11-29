import React, { useState, useEffect } from "react";
import EventFormModal from "./EventFormModal";
import 'bootstrap-icons/font/bootstrap-icons.css';
import "./Events.css";
import {
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent as apiDeleteEvent,
} from "../../api/event";
import { 
  Calendar, MapPin, Edit, Trash2, Plus, 
  Search, Filter, Image as ImageIcon, CheckCircle, XCircle
} from "lucide-react";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await getAllEvents();
      setEvents(res.data);
    } catch (error) {
      console.error("Lỗi load sự kiện:", error);
    }
  };

  const handleOpenModal = () => {
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleEdit = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sự kiện này?")) return;

    try {
      await apiDeleteEvent(id);
      setEvents(events.filter((e) => e.id !== id));
    } catch (err) {
      console.error(err);
      alert("Xóa thất bại!");
    }
  };

  const handleSave = async (data) => {
    try {
      let newData;
      if (data.id) {
        // UPDATE
        await updateEvent(data.id, data);
        newData = events.map((e) => (e.id === data.id ? data : e));
      } else {
        // CREATE
        const res = await createEvent(data);
        newData = [res.data, ...events];
      }
      setEvents(newData);
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Lưu thất bại! Vui lòng kiểm tra lại dữ liệu.");
    }
  };

  // Helper format ngày
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  // Helper render trạng thái
  const renderStatus = (status) => {
    const s = status?.toLowerCase();
    if (s === 'active' || s === 'published') {
      return <span className="status-badge success"><CheckCircle size={12}/> Đang diễn ra</span>;
    }
    if (s === 'draft') {
      return <span className="status-badge warning">Nháp</span>;
    }
    if (s === 'cancelled' || s === 'deleted') {
      return <span className="status-badge danger"><XCircle size={12}/> Đã hủy</span>;
    }
    return <span className="status-badge default">{status}</span>;
  };

  // Filter search
  const filteredEvents = events.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.id.toString().includes(searchTerm)
  );

  return (
    <div className="dashboard-wrapper">
      <div className="page-header-flex">
        <div className="header-left">
          <h2><Calendar className="header-icon"/> Quản lý Sự kiện</h2>
          <p className="sub-text">Quản lý tất cả các sự kiện đang hoạt động trên hệ thống</p>
        </div>
        
        <button onClick={handleOpenModal} className="btn-primary-action">
          <Plus size={18} /> Thêm Sự kiện
        </button>
      </div>

      {/* SEARCH BAR & FILTERS */}
      <div className="toolbar-section">
        <div className="search-bar">
            <Search className="search-icon" size={18} />
            <input 
                type="text" 
                placeholder="Tìm kiếm theo tên sự kiện hoặc ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <div className="filter-btn">
            <Filter size={18} /> Lọc
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="card table-card no-padding">
        <div className="table-responsive">
          <table className="admin-table event-table">
            <thead>
              <tr>
                <th width="60">ID</th>
                <th width="80">ẢNH</th>
                <th width="200">TÊN SỰ KIỆN</th>
                <th width="150">THỜI GIAN</th>
                <th>ĐỊA ĐIỂM</th>
                <th>THỂ LOẠI</th>
                <th>TRẠNG THÁI</th>
                <th className="text-center" width="100">HÀNH ĐỘNG</th>
              </tr>
            </thead>

            <tbody>
              {filteredEvents.length === 0 && (
                 <tr><td colSpan="8" className="text-center">Không tìm thấy sự kiện nào</td></tr>
              )}
              {filteredEvents.map((event) => (
                <tr key={event.id}>
                  <td><span className="id-badge">#{event.id}</span></td>
                  <td>
                    <div className="img-thumbnail">
                        {event.cover_image ? (
                            <img src={event.cover_image} alt="Cover" />
                        ) : (
                            <ImageIcon size={20} color="#555" />
                        )}
                    </div>
                  </td>
                  <td>
                    <div className="event-name-cell" title={event.name}>
                        {event.name}
                    </div>
                    <div className="organizer-sub">Org ID: {event.organizer_id}</div>
                  </td>
                  <td>
                    <div className="date-cell">
                        <span className="start-date">{formatDate(event.start_date)}</span>
                        {event.end_date && (
                            <span className="end-date">đến {formatDate(event.end_date)}</span>
                        )}
                    </div>
                  </td>
                  <td><span className="badge-gray"><MapPin size={10}/> {event.location_id}</span></td>
                  <td><span className="badge-gray">{event.category_id}</span></td>
                  <td>{renderStatus(event.status)}</td>
                  
                  <td>
                    <button
                      className="btn-icon edit"
                      onClick={() => handleEdit(event)}
                      title="Sửa"
                    >
                      {/* <i className="bi bi-pencil-square"></i> */}
                      <Edit size={16} />
                    </button>
                    <button
                      className="btn-icon delete"
                      onClick={() => handleDelete(event.id)}
                      title="Xóa"
                    >
                      {/* <i className="bi bi-trash"></i> */}
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL THÊM / SỬA */}
      {isModalOpen && (
        <EventFormModal
          event={selectedEvent}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default Events;