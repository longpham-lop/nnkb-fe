import React, { useState,} from 'react';
import './EventFormModal.css'; 

const EventFormModal = ({ event, onClose, onSave }) => {
 
  const [formData, setFormData] = useState({
    id: event?.id || null,
    name: event?.name || '',
    date: event?.date || '',
    location: event?.location || '',
    description: event?.description || '',
    status: event?.status || 'Sắp diễn ra',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Thêm một số kiểm tra (validate) cơ bản
    if (!formData.name || !formData.date || !formData.location) {
      alert('Vui lòng điền các trường bắt buộc (Tên, Ngày, Địa điểm).');
      return;
    }
    onSave(formData);
  };

  // Ngăn chặn việc click vào form đóng modal
  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    // Lớp phủ toàn màn hình
    <div className="modal-overlay" onClick={onClose}>
      {/* Nội dung modal */}
      <div className="modal-content" onClick={handleModalContentClick}>
        <div className="modal-header">
          <h3>{event ? 'Sửa Sự kiện' : 'Tạo Sự kiện Mới'}</h3>
          <button onClick={onClose} className="modal-close-btn">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="name">Tên sự kiện</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="date">Ngày diễn ra</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="location">Địa điểm</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Trạng thái</label>
            <select 
              id="status" 
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Sắp diễn ra">Sắp diễn ra</option>
              <option value="Đang diễn ra">Đang diễn ra</option>
              <option value="Đã kết thúc">Đã kết thúc</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Mô tả</label>
            <textarea
              id="description"
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>
          
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventFormModal;