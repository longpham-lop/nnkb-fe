import React, { useState, useEffect } from "react";
import "./location.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import {
  getAllLocations,
  createLocation,
  updateLocation,
  deleteLocation,
} from "../../api/location";
import { MapPin, Edit, Trash2, Plus, Save, X, Navigation } from "lucide-react";

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
    // Scroll lên đầu trang để sửa cho dễ
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const handleCancel = () => {
    setEditingId(null);
    setForm({
      name: "",
      address: "",
      city: "",
      province: "",
      capacity: "",
      map_link: "",
    });
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
      handleCancel();
    } catch (err) {
      console.error("Lỗi lưu địa điểm:", err);
    }
  };

  return (
    <div className="dashboard-wrapper">
      <div className="page-header">
        <h2><MapPin className="header-icon"/> Quản lý Địa điểm</h2>
      </div>

      {/* --- FORM CARD --- */}
      <div className="card form-card">
        <div className="card-header">
            <h3>{editingId ? "Cập nhật địa điểm" : "Thêm địa điểm mới"}</h3>
        </div>
        
        <form className="admin-form-grid" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tên địa điểm</label>
            <input
              type="text"
              placeholder="VD: Sân vận động Mỹ Đình"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Sức chứa</label>
            <input
              type="number"
              placeholder="VD: 5000"
              value={form.capacity}
              onChange={(e) => setForm({ ...form, capacity: e.target.value })}
            />
          </div>

          <div className="form-group full-width">
            <label>Địa chỉ chi tiết</label>
            <input
              type="text"
              placeholder="Số nhà, tên đường..."
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Thành phố</label>
            <input
              type="text"
              placeholder="VD: Hà Nội"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Tỉnh/Thành</label>
            <input
              type="text"
              placeholder="VD: Hà Nội"
              value={form.province}
              onChange={(e) => setForm({ ...form, province: e.target.value })}
            />
          </div>

          <div className="form-group full-width">
            <label>Link Google Map (Embed/Share)</label>
            <input
              type="text"
              placeholder="https://maps.google.com/..."
              value={form.map_link}
              onChange={(e) => setForm({ ...form, map_link: e.target.value })}
            />
          </div>

          <div className="form-actions full-width">
            {editingId && (
                <button type="button" className="btn-cancel" onClick={handleCancel}>
                    <X size={18} /> Hủy bỏ
                </button>
            )}
            <button type="submit" className="btn-primary-action">
              {editingId ? <Save size={18} /> : <Plus size={18} />}
              {editingId ? "Lưu thay đổi" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>

      {/* --- TABLE CARD --- */}
      <div className="card table-card">
        <div className="card-header">
            <h3>Danh sách địa điểm ({locations.length})</h3>
        </div>
        <div className="table-responsive">
            <table className="admin-table">
            <thead>
                <tr>
                <th>ID</th>
                <th>TÊN ĐỊA ĐIỂM</th>
                <th>ĐỊA CHỈ</th>
                <th>THÀNH PHỐ</th>
                <th>SỨC CHỨA</th>
                <th className="text-center">BẢN ĐỒ</th>
                <th className="text-center">HÀNH ĐỘNG</th>
                </tr>
            </thead>

            <tbody>
                {locations.length === 0 && (
                    <tr><td colSpan="7" className="text-center">Chưa có dữ liệu</td></tr>
                )}
                {locations.map((loc) => (
                <tr key={loc.id}>
                    <td>#{loc.id}</td>
                    <td className="highlight-text">{loc.name}</td>
                    <td>{loc.address}</td>
                    <td>{loc.city}</td>
                    <td>{loc.capacity ? Number(loc.capacity).toLocaleString() : '---'}</td>
                    <td className="text-center">
                    {loc.map_link ? (
                        <a href={loc.map_link} target="_blank" rel="noreferrer" className="icon-link">
                        <Navigation size={18} />
                        </a>
                    ) : (
                        <span className="text-muted">—</span>
                    )}
                    </td>
                    <td className="action-buttons text-center">
                    <button
                        className="btn-icon edit"
                        onClick={() => handleEdit(loc)}
                        title="Sửa"
                    ><i className="bi bi-pencil-square"></i>
                        <Edit size={16} />
                    </button>
                    <button
                        className="btn-icon delete"
                        onClick={() => handleDelete(loc.id)}
                        title="Xóa"
                    ><i className="bi bi-trash"></i>
                        <Trash2 size={16} />
                    </button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default Locations;