import React, { useState } from 'react';
import './EventFormModal.css';
import { uploadImage } from "../../api/upload";

const EventFormModal = ({ event, onClose, onSave }) => {

  const [images, setImages] = useState([]);

  const [formData, setFormData] = useState({
    id: event?.id || null,
    organizer_id: event?.organizer_id || "",
    name: event?.name || "",
    description: event?.description || "",
    category_id: event?.category_id || "",
    location_id: event?.location_id || "",
    start_date: event?.start_date || "",
    end_date: event?.end_date || "",
    cover_image: event?.cover_image || "",
    status: event?.status || "upcoming",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.start_date || !formData.location_id) {
      alert("Vui lòng điền các trường bắt buộc!");
      return;
    }

    // Chuẩn hóa payload đúng backend yêu cầu
    const payload = {
      organizer_id: Number(formData.organizer_id),
      name: formData.name,
      description: formData.description,
      category_id: Number(formData.category_id),
      location_id: Number(formData.location_id),
      start_date: formData.start_date,
      end_date: formData.end_date,
      cover_image: formData.cover_image,
      status: formData.status, // upcoming | ongoing | ended
    };

    if (formData.id) payload.id = formData.id;

    onSave(payload);
  };

  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };


  // Upload ảnh bằng input file
  const handleSelectFiles = async (e) => {
    const files = Array.from(e.target.files);
    await handleUploadProcess(files);
  };

  // Drag & Drop ảnh
  const handleDrop = async (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    await handleUploadProcess(files);
  };

  const handleDragOver = (e) => e.preventDefault();


  // Upload lên BE → Cloudinary → nhận URL
  const handleUploadProcess = async (files) => {
    const imageFiles = files.filter((f) => f.type.startsWith("image/"));

    for (let file of imageFiles) {
      try {
        const res = await uploadImage(file);
        const fileUrl = res.data.url;

        setImages((prev) => [
          ...prev,
          { name: file.name, url: fileUrl }
        ]);

        setFormData((prev) => ({
          ...prev,
          cover_image: fileUrl,
        }));

      } catch (error) {
        console.error("Upload failed:", error);
        alert("Upload thất bại!");
      }
    }
  };


  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={handleModalContentClick}>

        <div className="modal-header">
          <h3>{event ? "Sửa Sự kiện" : "Tạo Sự kiện Mới"}</h3>
          <button onClick={onClose} className="modal-close-btn">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">

          {/* Organizer */}
          <div className="form-group">
            <label htmlFor="organizer_id">Người tổ chức (ID)</label>
            <input
              type="number"
              id="organizer_id"
              name="organizer_id"
              value={formData.organizer_id}
              onChange={handleChange}
              required
            />
          </div>

          {/* Tên sự kiện */}
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

          {/* Mô tả */}
          <div className="form-group">
            <label htmlFor="description">Mô tả</label>
            <textarea
              id="description"
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label htmlFor="category_id">ID Thể loại</label>
            <input
              type="number"
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
            />
          </div>

          {/* Location */}
          <div className="form-group">
            <label htmlFor="location_id">ID Địa điểm</label>
            <input
              type="number"
              id="location_id"
              name="location_id"
              value={formData.location_id}
              onChange={handleChange}
              required
            />
          </div>

          {/* Start Date */}
          <div className="form-group">
            <label htmlFor="start_date">Ngày bắt đầu</label>
            <input
              type="date"
              id="start_date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              required
            />
          </div>

          {/* End Date */}
          <div className="form-group">
            <label htmlFor="end_date">Ngày kết thúc</label>
            <input
              type="date"
              id="end_date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
            />
          </div>

          {/* Trạng thái */}
          <div className="form-group">
            <label htmlFor="status">Trạng thái</label>
            <select name="status" id="status" value={formData.status} onChange={handleChange}>
              <option value="upcoming">Sắp diễn ra</option>
              <option value="ongoing">Đang diễn ra</option>
              <option value="ended">Đã kết thúc</option>
            </select>
          </div>

          {/* Upload ảnh */}
          <div className="dropzone" onDrop={handleDrop} onDragOver={handleDragOver}>
            <p>Kéo và thả hình ảnh sự kiện vào đây</p>
            <span>Hoặc</span>
            <label className="upload-btn">
              Chọn ảnh
              <input type="file" multiple hidden onChange={handleSelectFiles} />
            </label>
          </div>

          {/* Preview ảnh */}
          <div className="image-preview-container">
            {images.map((img, i) => (
              <div key={i} className="image-card">
                <img src={img.url} alt={img.name} />
                <p>{img.name}</p>
              </div>
            ))}
          </div>

          {/* Buttons */}
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
