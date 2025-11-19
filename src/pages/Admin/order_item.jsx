import React, { useState, useEffect } from "react";
import "./Events.css";
import {
  getAllOrderItems,
  updateOrderItem,
  deleteOrderItem,
} from "../../api/orderitem";

const OrderItems = () => {
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [checkedInForm, setCheckedInForm] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const res = await getAllOrderItems();
      setItems(res.data);
    } catch (err) {
      console.error("Lỗi lấy danh sách chi tiết đơn hàng:", err);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setCheckedInForm(item.checked_in);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateOrderItem(editingId, { checked_in: checkedInForm });
      setItems(
        items.map((i) =>
          i.id === editingId ? { ...i, checked_in: checkedInForm } : i
        )
      );
      setEditingId(null);
    } catch (err) {
      console.error("Lỗi cập nhật chi tiết đơn hàng:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Bạn chắc chắn muốn xóa chi tiết đơn hàng này?")) return;
    try {
      await deleteOrderItem(id);
      setItems(items.filter((i) => i.id !== id));
    } catch (err) {
      console.error("Lỗi xóa chi tiết đơn hàng:", err);
    }
  };

  return (
    <div className="admin-page-content">
      <div className="page-header">
        <h2>Quản lý Chi tiết đơn hàng</h2>
      </div>

      {/* Form chỉnh sửa */}
      {editingId && (
        <form className="event-form" onSubmit={handleUpdate}>
          <label>
            Checked In:
            <select
              value={checkedInForm ? "true" : "false"}
              onChange={(e) =>
                setCheckedInForm(e.target.value === "true")
              }
            >
              <option value="true">Đã check-in</option>
              <option value="false">Chưa check-in</option>
            </select>
          </label>
          <button className="btn btn-primary" type="submit">
            Cập nhật
          </button>
        </form>
      )}

      {/* Table chi tiết đơn hàng */}
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Order ID</th>
            <th>Ticket ID</th>
            <th>Số lượng</th>
            <th>Đơn giá</th>
            <th>QR Code</th>
            <th>Checked In</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          {items.map((i) => (
            <tr key={i.id}>
              <td>{i.id}</td>
              <td>{i.order_id}</td>
              <td>{i.ticket_id}</td>
              <td>{i.quantity}</td>
              <td>{i.unit_price}</td>
              <td>
                {i.qr_code ? (
                  <a href={i.qr_code} target="_blank" rel="noreferrer">
                    Xem QR
                  </a>
                ) : (
                  "—"
                )}
              </td>
              <td>{i.checked_in ? "Đã check-in" : "Chưa check-in"}</td>
              <td className="action-buttons">
                <button
                  className="btn btn-secondary"
                  onClick={() => handleEdit(i)}
                >
                  Sửa
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(i.id)}
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

export default OrderItems;
