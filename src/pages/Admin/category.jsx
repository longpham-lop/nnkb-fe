import React, { useState, useEffect } from "react";
import "./Events.css";  
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../api/category";

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
      setForm({ name: "", description: "" });
      setEditingId(null);
    } catch (err) {
      console.error("Lỗi lưu thể loại:", err);
    }
  };

  return (
    <div className="admin-page-content">
      <div className="page-header">
        <h2>Quản lý Thể loại</h2>
      </div>

      {/* FORM */}
      <form className="event-form" onSubmit={handleSubmit}>
        <label>
          Tên thể loại:
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </label>

        <label>
          Mô tả:
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
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
            <th>Tên thể loại</th>
            <th>Mô tả</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id}>
              <td>{cat.id}</td>
              <td>{cat.name}</td>
              <td>{cat.description || "—"}</td>
              <td className="action-buttons">
                <button
                  className="btn btn-secondary"
                  onClick={() => handleEdit(cat)}
                >
                  Sửa
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(cat.id)}
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

export default Categories;
