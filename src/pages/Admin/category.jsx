import React, { useState, useEffect } from "react";
import "./category.css"; // Đổi tên file CSS cho đúng ngữ cảnh
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../api/category";
import { Layers, Edit, Trash2, Plus, Save, X } from "lucide-react";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await getAllCategories();
      setCategories(res.data);
    } catch (err) {
      console.error("Lỗi lấy danh sách thể loại:", err);
    }
  };

  const handleEdit = (cat) => {
    setEditingId(cat.id);
    setForm({
      name: cat.name,
      description: cat.description,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm("Bạn chắc chắn muốn xóa thể loại này?")) return;
    try {
      await deleteCategory(id);
      setCategories(categories.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Lỗi xóa thể loại:", err);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({ name: "", description: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateCategory(editingId, form);
        setCategories(
          categories.map((c) => (c.id === editingId ? { ...c, ...form } : c))
        );
      } else {
        const res = await createCategory(form);
        setCategories([...categories, res.data]);
      }
      handleCancel(); // Reset form sau khi lưu
    } catch (err) {
      console.error("Lỗi lưu thể loại:", err);
    }
  };

  return (
    <div className="dashboard-wrapper">
      <div className="page-header">
        <h2><Layers className="header-icon"/> Quản lý Thể loại</h2>
      </div>

      {/* --- KHỐI FORM (Bên trái hoặc Trên cùng) --- */}
      <div className="card form-card">
        <div className="card-header">
          <h3>{editingId ? "Cập nhật thể loại" : "Thêm thể loại mới"}</h3>
        </div>

        <form className="category-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tên thể loại</label>
            <input
              type="text"
              placeholder="VD: Nhạc Rock, Bolero..."
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Mô tả</label>
            <textarea
              rows={4}
              placeholder="Mô tả ngắn về thể loại này..."
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          <div className="form-actions">
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

      {/* --- KHỐI BẢNG DỮ LIỆU --- */}
      <div className="card table-card">
        <div className="card-header">
          <h3>Danh sách thể loại ({categories.length})</h3>
        </div>
        
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{width: '80px'}}>ID</th>
                <th style={{width: '25%'}}>TÊN THỂ LOẠI</th>
                <th>MÔ TẢ</th>
                <th className="text-center" style={{width: '120px'}}>HÀNH ĐỘNG</th>
              </tr>
            </thead>

            <tbody>
              {categories.length === 0 && (
                 <tr><td colSpan="4" className="text-center">Chưa có dữ liệu</td></tr>
              )}
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td>#{cat.id}</td>
                  <td className="highlight-text">{cat.name}</td>
                  <td className="desc-cell">{cat.description || "—"}</td>
                  <td className="action-buttons text-center">
                    <button
                      className="btn-icon edit"
                      onClick={() => handleEdit(cat)}
                      title="Sửa"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="btn-icon delete"
                      onClick={() => handleDelete(cat.id)}
                      title="Xóa"
                    >
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

export default Categories;