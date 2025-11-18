import React, { useState, useEffect } from "react";
import EventFormModal from "./EventFormModal";
import "./Events.css";

import {
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent as apiDeleteEvent,
} from "../../api/event"; 

const Events = () => {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await getAllEvents();
      setEvents(res.data);
    } catch (error) {
      console.error("Lỗi load sự kiện:", error);
      alert("Không thể tải danh sách sự kiện!");
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
    if (!window.confirm("Xóa sự kiện?")) return;

    try {
      await apiDeleteEvent(id);
      setEvents(events.filter((e) => e.id !== id)); // Remove tại FE
      alert("Đã xóa thành công!");
    } catch (err) {
      console.error(err);
      alert("Xóa thất bại!");
    }
  };

  // ⭐ Drag & Drop Upload
  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);

    const imageFiles = files.filter((f) => f.type.startsWith("image/"));
    const imageURLs = imageFiles.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...imageURLs]);
  };

  const handleDragOver = (e) => e.preventDefault();

  // Upload bằng nút chọn file
  const handleSelectFiles = (e) => {
    const files = Array.from(e.target.files);

    const imageFiles = files.filter((f) => f.type.startsWith("image/"));
    const imageURLs = imageFiles.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...imageURLs]);
  };

  return (
    <div className="admin-page-content">
      <div className="page-header">
        <h2>Quản lý Sự kiện</h2>

        <button onClick={handleOpenModal} className="btn btn-primary">
          + Thêm Sự kiện
        </button>
      </div>

      {/* TABLE SỰ KIỆN */}
      <table className="data-table">
        <thead>
          <tr>
            <th>id</th>
            <th>Người tổ chức</th>
            <th>Tên sự kiện</th>
            <th>Mô tả</th>
            <th>id thể loại</th>
            <th>id địa điểm</th>
            <th>Ngày diễn ra</th>
            <th>Ngày kết thúc</th>
            <th>Ảnh</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          {events.map((event) => (
            <tr key={event.id}>
              <td>{event.id}</td>
              <td>{event.organizer_id}</td>
              <td>{event.name}</td>
              <td>{event.description}</td>
              <td>{event.category_id}</td>
              <td>{event.location_id}</td>
              <td>{event.start_date}</td>
              <td>{event.end_date}</td>
              <td><img className="minipic" src={event.cover_image} alt="E" /></td>
              <td>{event.status}</td>

              <td className="action-buttons">
                <button
                  className="btn btn-secondary"
                  onClick={() => handleEdit(event)}
                >
                  Sửa
                </button>

                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(event.id)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL THÊM / SỬA */}
      {isModalOpen && (
        <EventFormModal
          event={selectedEvent}
          onClose={() => setIsModalOpen(false)}
          onSave={async (data) => {
            try {
              let newData;

              if (data.id) {
                // ⭐ UPDATE
                await updateEvent(data.id, data);
                newData = events.map((e) => (e.id === data.id ? data : e));
              } else {
                // ⭐ CREATE
                const res = await createEvent(data);
                newData = [res.data, ...events]; // thêm API trả về
              }

              setEvents(newData);
              setIsModalOpen(false);
            } catch (err) {
              console.error(err);
              alert("Lưu thất bại!");
            }
          }}
        />
      )}
    </div>
  );
};

export default Events;
