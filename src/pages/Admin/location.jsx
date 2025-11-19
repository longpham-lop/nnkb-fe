import React, { useState, useEffect } from "react";
import "./Events.css";  
import {
  getAllLocations,
  createLocation,
  updateLocation,
  deleteLocation,
} from "../../api/location";

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    province: "",
    capacity: "",
    map_link: "",
  });

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      const res = await getAllLocations();
      setLocations(res.data);
    } catch (err) {
      console.error("Lỗi lấy danh sách địa điểm:", err);
    }
  };

  const handleEdit = (loc) => {
    setEditingId(loc.id);
    setForm({
      name: loc.name,
      address: loc.address,
      city: loc.city,
      province: loc.province,
      capacity: loc.capacity,
      map_link: loc.map_link,
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Bạn chắc chắn muốn xóa địa điểm này?")) return;
    try {
      await deleteLocation(id);
      setLocations(locations.filter((l) => l.id !== id));
    } catch (err) {
      console.error("Lỗi xóa địa điểm:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateLocation(editingId, form);
        setLocations(
          locations.map((l) => (l.id === editingId ? { ...l, ...form } : l))
        );
      } else {
        const res = await createLocation(form);
        setLocations([...locations, res.data]);
      }
      setForm({
        name: "",
        address: "",
        city: "",
        province: "",
        capacity: "",
        map_link: "",
      });
      setEditingId(null);
    } catch (err) {
      console.error("Lỗi lưu địa điểm:", err);
    }
  };

  return (
    <div className="admin-page-content">
      <div className="page-header">
        <h2>Quản lý Địa điểm</h2>
      </div>

      {/* FORM */}
      <form className="event-form" onSubmit={handleSubmit}>
        <label>
          Tên địa điểm:
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </label>

        <label>
          Địa chỉ:
          <input
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
        </label>

        <label>
          Thành phố:
          <input
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />
        </label>

        <label>
          Tỉnh/Thành:
          <input
            value={form.province}
            onChange={(e) => setForm({ ...form, province: e.target.value })}
          />
        </label>

        <label>
          Sức chứa:
          <input
            type="number"
            value={form.capacity}
            onChange={(e) => setForm({ ...form, capacity: e.target.value })}
          />
        </label>

        <label>
          Link bản đồ:
          <input
            value={form.map_link}
            onChange={(e) => setForm({ ...form, map_link: e.target.value })}
          />
        </label>

        <button className="btn btn-primary" type="submit">
          {editingId ? "Cập nhật" : "Thêm mới"}
        </button>
      </form>

      {/* TABLE */}
      <table className="data-table">
        <thead>
          <tr>
            <th>id</th>
            <th>Tên địa điểm</th>
            <th>Địa chỉ</th>
            <th>Thành phố</th>
            <th>Tỉnh/Thành</th>
            <th>Sức chứa</th>
            <th>Link bản đồ</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          {locations.map((loc) => (
            <tr key={loc.id}>
              <td>{loc.id}</td>
              <td>{loc.name}</td>
              <td>{loc.address}</td>
              <td>{loc.city}</td>
              <td>{loc.province}</td>
              <td>{loc.capacity}</td>
              <td>
                {loc.map_link ? (
                  <a href={loc.map_link} target="_blank" rel="noreferrer">
                    Xem
                  </a>
                ) : (
                  "—"
                )}
              </td>
              <td className="action-buttons">
                <button
                  className="btn btn-secondary"
                  onClick={() => handleEdit(loc)}
                >
                  Sửa
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(loc.id)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Locations;
