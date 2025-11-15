import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function EventFormModal({ isOpen, onClose, onSubmit, eventData }) {
  const [formData, setFormData] = useState({});
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (eventData) {
      const localDateTime = eventData.date
        ? new Date(new Date(eventData.date).getTime() - (new Date().getTimezoneOffset() * 60000))
            .toISOString()
            .slice(0, 16)
        : "";
      setFormData({ ...eventData, date: localDateTime });
      setPreviewImage(eventData.imageUrl || "");
    } else {
      setFormData({ name: "", date: "", location: "", price: 0, stock: 0, status: "Sắp diễn ra", imageFile: null });
      setPreviewImage("");
    }
  }, [eventData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (name === "image") {
      const file = files[0];
      setFormData(prev => ({ ...prev, imageFile: file }));
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setFormData(prev => ({ ...prev, [name]: type === "number" ? parseFloat(value) : value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      date: new Date(formData.date).toISOString(),
      imageUrl: previewImage
    };
    onSubmit(submissionData);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}><X size={24} /></button>
        <h3 className="modal-title">{eventData ? "Chỉnh sửa Sự kiện" : "Thêm Sự kiện Mới"}</h3>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Tên sự kiện</label>
              <input type="text" name="name" value={formData.name || ""} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Địa điểm</label>
              <input type="text" name="location" value={formData.location || ""} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-group">
            <label>Ngày & Giờ</label>
            <input type="datetime-local" name="date" value={formData.date || ""} onChange={handleChange} required />
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
              <select name="status" value={formData.status || "Sắp diễn ra"} onChange={handleChange}>
                <option>Sắp diễn ra</option>
                <option>Đang bán</option>
                <option>Đã kết thúc</option>
                <option>Nháp</option>
              </select>
            </div>
            <div className="form-group">
              <label>Ảnh sự kiện</label>
              <input type="file" name="image" onChange={handleChange} />
              {previewImage && <img src={previewImage} alt="Preview" style={{ width: "100px", marginTop: "10px" }} />}
            </div>
          </div>
          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-cancel">Hủy</button>
            <button type="submit" className="btn-submit">{eventData ? "Cập nhật" : "Lưu"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
