import React, { useState, useEffect } from "react";
import "./Events.css";
import {
  getAllOrders,
  updateOrder,
  deleteOrder,
} from "../../api/order";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [statusForm, setStatusForm] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await getAllOrders();
      setOrders(res.data);
    } catch (err) {
      console.error("Lỗi lấy danh sách đơn hàng:", err);
    }
  };

  const handleEdit = (order) => {
    setEditingId(order.id);
    setStatusForm(order.status);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    try {
      await updateOrder(editingId, { status: statusForm });
      setOrders(
        orders.map((o) =>
          o.id === editingId ? { ...o, status: statusForm } : o
        )
      );
      setEditingId(null);
      setStatusForm("");
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Bạn chắc chắn muốn xóa đơn hàng này?")) return;
    try {
      await deleteOrder(id);
      setOrders(orders.filter((o) => o.id !== id));
    } catch (err) {
      console.error("Lỗi xóa đơn hàng:", err);
    }
  };

  return (
    <div className="admin-page-content">
      <div className="page-header">
        <h2>Quản lý Đơn hàng</h2>
      </div>

      {/* FORM cập nhật trạng thái */}
      {editingId && (
        <form className="event-form" onSubmit={handleUpdateStatus}>
          <label>
            Trạng thái:
            <select
              value={statusForm}
              onChange={(e) => setStatusForm(e.target.value)}
            >
              <option value="pending">Chờ xử lý</option>
              <option value="paid">Đã thanh toán</option>
              <option value="cancelled">Hủy</option>
            </select>
          </label>
          <button className="btn btn-primary" type="submit">
            Cập nhật
          </button>
        </form>
      )}

      {/* TABLE */}
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>User ID</th>
            <th>Event ID</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Ngày tạo</th>
            <th>Payment ID</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.user_id}</td>
              <td>{o.event_id}</td>
              <td>{o.total_amount}</td>
              <td>{o.status}</td>
              <td>{o.created_at?.slice(0, 16)}</td>
              <td>{o.payment_id || "—"}</td>
              <td className="action-buttons">
                <button
                  className="btn btn-secondary"
                  onClick={() => handleEdit(o)}
                >
                  Sửa
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(o.id)}
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

export default Orders;
