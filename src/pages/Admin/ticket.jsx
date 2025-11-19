import React, { useState, useEffect } from "react";
import "./Events.css";
import {
  getAllTickets,
  createTicket,
  updateTicket,
  deleteTicket,
} from "../../api/ticket";

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    event_id: "",
    name: "",
    price: "",
    quantity: "",
    sold: 0,
    sale_start: "",
    sale_end: "",
    seat_type: "",
  });

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const res = await getAllTickets();
      setTickets(res.data);
    } catch (err) {
      console.error("Lỗi lấy danh sách vé:", err);
    }
  };

  const handleEdit = (ticket) => {
    setEditingId(ticket.id);
    setForm({
      event_id: ticket.event_id,
      name: ticket.name,
      price: ticket.price,
      quantity: ticket.quantity,
      sold: ticket.sold,
      sale_start: ticket.sale_start?.slice(0,16) || "",
      sale_end: ticket.sale_end?.slice(0,16) || "",
      seat_type: ticket.seat_type,
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Bạn chắc chắn muốn xóa vé này?")) return;
    try {
      await deleteTicket(id);
      setTickets(tickets.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Lỗi xóa vé:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateTicket(editingId, form);
        setTickets(
          tickets.map((t) => (t.id === editingId ? { ...t, ...form } : t))
        );
      } else {
        const res = await createTicket(form);
        setTickets([...tickets, res.data]);
      }
      setForm({
        event_id: "",
        name: "",
        price: "",
        quantity: "",
        sold: 0,
        sale_start: "",
        sale_end: "",
        seat_type: "",
      });
      setEditingId(null);
    } catch (err) {
      console.error("Lỗi lưu vé:", err);
    }
  };

  return (
    <div className="admin-page-content">
      <div className="page-header">
        <h2>Quản lý Vé</h2>
      </div>

      {/* FORM */}
      <form className="event-form" onSubmit={handleSubmit}>
        <label>
          Event ID:
          <input
            type="text"
            value={form.event_id}
            onChange={(e) => setForm({ ...form, event_id: e.target.value })}
            required
          />
        </label>

        <label>
          Tên vé:
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </label>

        <label>
          Giá:
          <input
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />
        </label>

        <label>
          Số lượng:
          <input
            type="number"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            required
          />
        </label>

        <label>
          Ngày bắt đầu bán:
          <input
            type="datetime-local"
            value={form.sale_start}
            onChange={(e) => setForm({ ...form, sale_start: e.target.value })}
          />
        </label>

        <label>
          Ngày kết thúc bán:
          <input
            type="datetime-local"
            value={form.sale_end}
            onChange={(e) => setForm({ ...form, sale_end: e.target.value })}
          />
        </label>

        <label>
          Loại ghế:
          <input
            type="text"
            value={form.seat_type}
            onChange={(e) => setForm({ ...form, seat_type: e.target.value })}
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
            <th>Event ID</th>
            <th>Tên vé</th>
            <th>Giá</th>
            <th>Số lượng</th>
            <th>Đã bán</th>
            <th>Bắt đầu bán</th>
            <th>Kết thúc bán</th>
            <th>Loại ghế</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          {tickets.map((t) => (
            <tr key={t.id}>
              <td>{t.event_id}</td>
              <td>{t.name}</td>
              <td>{t.price}</td>
              <td>{t.quantity}</td>
              <td>{t.sold}</td>
              <td>{t.sale_start?.slice(0,16)}</td>
              <td>{t.sale_end?.slice(0,16)}</td>
              <td>{t.seat_type || "—"}</td>
              <td className="action-buttons">
                <button
                  className="btn btn-secondary"
                  onClick={() => handleEdit(t)}
                >
                  Sửa
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(t.id)}
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

export default Tickets;
