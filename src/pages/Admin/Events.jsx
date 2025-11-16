import React, { useState, useEffect } from 'react';
import EventFormModal from './EventFormModal';
import './Events.css';

const mockEvents = [
  { id: 1, name: 'Đại nhạc hội Mùa Hè', date: '2025-12-01', location: 'Mỹ Đình', status: 'Sắp diễn ra' },
  { id: 2, name: 'TechShow 2025', date: '2025-11-20', location: 'Hội nghị Quốc gia', status: 'Đang diễn ra' },
  { id: 3, name: 'Workshop React', date: '2025-11-10', location: 'FPT Tower', status: 'Đã kết thúc' },
];

const Events = () => {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [images, setImages] = useState([]); // ⭐ Danh sách ảnh sự kiện upload

  useEffect(() => {
    setEvents(mockEvents);
  }, []);

  const handleOpenModal = () => {
    setSelectedEvent(null);
    setIsModalOpen(true);
  };
  const handleSaveToLocal = () => {
  localStorage.setItem("admin_events", JSON.stringify(events));
  alert("🎉 Lưu sự kiện thành công!");
};

  const handleEdit = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Xóa sự kiện?")) {
      setEvents(events.filter(e => e.id !== id));
    }
  };

  // ⭐ DRAG & DROP UPLOAD
  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);

    const imageFiles = files.filter(file =>
      file.type.startsWith("image/")
    );

    const imageURLs = imageFiles.map(file => ({
      name: file.name,
      url: URL.createObjectURL(file)
    }));

    setImages(prev => [...prev, ...imageURLs]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Upload bằng nút chọn file
  const handleSelectFiles = (e) => {
    const files = Array.from(e.target.files);

    const imageFiles = files.filter(file => file.type.startsWith("image/"));
    const imageURLs = imageFiles.map(file => ({
      name: file.name,
      url: URL.createObjectURL(file)
    }));

    setImages(prev => [...prev, ...imageURLs]);
  };

  return (
    <div className="admin-page-content">
      <div className="page-header">
        <h2>Quản lý Sự kiện</h2>
        <button onClick={handleSaveToLocal} className="btn btn-success">
          Lưu sư kiện
        </button>
        <button onClick={handleOpenModal} className="btn btn-primary">
          + Thêm Sự kiện
        </button>
      </div>

      {/* ⭐ KHUNG KÉO THẢ ẢNH */}
      <div
        className="dropzone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <p>Kéo và thả hình ảnh sự kiện vào đây</p>
        <span>Hoặc</span>
        <label className="upload-btn">
          Chọn ảnh
          <input type="file" multiple hidden onChange={handleSelectFiles} />
        </label>
      </div>

      {/* ⭐ Preview ảnh */}
      <div className="image-preview-container">
        {images.map((img, i) => (
          <div key={i} className="image-card">
            <img src={img.url} alt={img.name} />
            <p>{img.name}</p>
          </div>
        ))}
      </div>

      {/* TABLE SỰ KIỆN */}
      <table className="data-table">
        <thead>
          <tr>
            <th>Tên sự kiện</th>
            <th>Ngày diễn ra</th>
            <th>Địa điểm</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {events.map(event => (
            <tr key={event.id}>
              <td>{event.name}</td>
              <td>{event.date}</td>
              <td>{event.location}</td>
              <td>{event.status}</td>
              <td className="action-buttons">
                <button className="btn btn-secondary" onClick={() => handleEdit(event)}>Sửa</button>
                <button className="btn btn-danger" onClick={() => handleDelete(event.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <EventFormModal
          event={selectedEvent}
          onClose={() => setIsModalOpen(false)}
          onSave={(data) => {
            if (data.id) {
              setEvents(events.map(e => (e.id === data.id ? data : e)));
            } else {
              setEvents([{ ...data, id: Date.now() }, ...events]);
            }
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default Events;
