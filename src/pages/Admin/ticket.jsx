import React, { useState, useEffect } from "react";
import "./ticket.css"; 
import 'bootstrap-icons/font/bootstrap-icons.css';
import {
  getAllTickets,
  createTicket,
  updateTicket,
  deleteTicket,
} from "../../api/ticket";
import { 
  Ticket, Edit, Trash2, Plus, Save, X, 
  Calendar, DollarSign, Hash, Layers 
} from "lucide-react";

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [editingId, setEditingId] = useState(null);
  
  // Form state
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
      // Cắt chuỗi để fit vào input type="datetime-local" (YYYY-MM-DDTHH:mm)
      sale_start: ticket.sale_start ? ticket.sale_start.slice(0, 16) : "",
      sale_end: ticket.sale_end ? ticket.sale_end.slice(0, 16) : "",
      seat_type: ticket.seat_type,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const handleCancel = () => {
    setEditingId(null);
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
      handleCancel();
    } catch (err) {
      console.error("Lỗi lưu vé:", err);
    }
  };

  // Helper format tiền tệ
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Helper format ngày hiển thị
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="dashboard-wrapper">
      <div className="page-header">
        <h2><Ticket className="header-icon"/> Quản lý Vé sự kiện</h2>
      </div>

      {/* --- FORM CARD --- */}
      <div className="card form-card">
        <div className="card-header">
          <h3>{editingId ? "Cập nhật thông tin vé" : "Tạo loại vé mới"}</h3>
        </div>

        <form className="admin-form-grid three-cols" onSubmit={handleSubmit}>
          {/* Cột 1: Thông tin cơ bản */}
          <div className="form-group">
            <label>Event ID <span className="required">*</span></label>
            <div className="input-with-icon">
              <Hash size={16} className="input-icon"/>
              <input
                type="text"
                value={form.event_id}
                onChange={(e) => setForm({ ...form, event_id: e.target.value })}
                required
                placeholder="ID Sự kiện"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Tên loại vé <span className="required">*</span></label>
            <div className="input-with-icon">
              <Ticket size={16} className="input-icon"/>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                placeholder="VD: VIP, General, Early Bird..."
              />
            </div>
          </div>

          <div className="form-group">
            <label>Loại ghế / Khu vực</label>
            <div className="input-with-icon">
              <Layers size={16} className="input-icon"/>
              <input
                type="text"
                value={form.seat_type}
                onChange={(e) => setForm({ ...form, seat_type: e.target.value })}
                placeholder="VD: Khán đài A, Standing..."
              />
            </div>
          </div>

          {/* Cột 2: Giá & Số lượng */}
          <div className="form-group">
            <label>Giá vé (VNĐ) <span className="required">*</span></label>
            <div className="input-with-icon">
              <DollarSign size={16} className="input-icon"/>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
                placeholder="0"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Tổng số lượng phát hành <span className="required">*</span></label>
            <input
              type="number"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              required
              placeholder="VD: 100"
            />
          </div>

          <div className="form-group">
            <label>Đã bán (Sold)</label>
            <input
              type="number"
              value={form.sold}
              onChange={(e) => setForm({ ...form, sold: e.target.value })}
              placeholder="0"
              disabled={!editingId} // Thường chỉ edit mới sửa số này
            />
          </div>

          {/* Cột 3: Thời gian mở bán */}
          <div className="form-group">
            <label>Mở bán từ</label>
            <div className="input-with-icon">
              <Calendar size={16} className="input-icon"/>
              <input
                type="datetime-local"
                value={form.sale_start}
                onChange={(e) => setForm({ ...form, sale_start: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Kết thúc bán</label>
            <div className="input-with-icon">
              <Calendar size={16} className="input-icon"/>
              <input
                type="datetime-local"
                value={form.sale_end}
                onChange={(e) => setForm({ ...form, sale_end: e.target.value })}
              />
            </div>
          </div>

          {/* Action Buttons (Chiếm full hàng cuối) */}
          <div className="form-actions full-width">
            {editingId && (
              <button type="button" className="btn-cancel" onClick={handleCancel}>
                <X size={18} /> Hủy bỏ
              </button>
            )}
            <button type="submit" className="btn-primary-action">
              {editingId ? <Save size={18} /> : <Plus size={18} />}
              {editingId ? "Lưu thay đổi" : "Tạo vé mới"}
            </button>
          </div>
        </form>
      </div>

      {/* --- TABLE CARD --- */}
      <div className="card table-card">
        <div className="card-header">
          <h3>Danh sách vé hiện có ({tickets.length})</h3>
        </div>

        <div className="table-responsive">
          <table className="admin-table ticket-table">
            <thead>
              <tr>
                <th>Event ID</th>
                <th>Tên Vé</th>
                <th>Giá Vé</th>
                <th>Phát hành</th>
                <th>Đã bán</th>
                <th>Tiến độ</th>
                <th>Thời gian bán</th>
                <th>Hành động</th>
              </tr>
            </thead>

            <tbody>
              {tickets.length === 0 && (
                 <tr><td colSpan="8" className="text-center">Chưa có dữ liệu</td></tr>
              )}
              {tickets.map((t) => {
                const percentSold = t.quantity > 0 ? Math.round((t.sold / t.quantity) * 100) : 0;
                return (
                  <tr key={t.id}>
                    <td><span className="badge-id">#{t.event_id}</span></td>
                    <td className="highlight-text">
                      {t.name}
                      <div className="sub-text-sm">{t.seat_type}</div>
                    </td>
                    <td className="price-text">{formatCurrency(t.price)}</td>
                    <td>{t.quantity}</td>
                    <td>{t.sold}</td>
                    <td>
                      {/* Progress bar nhỏ */}
                      <div className="progress-bar-container" title={`${percentSold}%`}>
                        <div 
                          className="progress-bar-fill" 
                          style={{width: `${percentSold}%`, backgroundColor: percentSold > 90 ? '#e91e63' : '#00b14f'}}
                        ></div>
                      </div>
                      <span className="progress-text">{percentSold}%</span>
                    </td>
                    <td>
                      <div className="date-range">
                        <span>{formatDate(t.sale_start)}</span>
                        <span className="arrow">➔</span>
                        <span>{formatDate(t.sale_end)}</span>
                      </div>
                    </td>
                    <td>
                      <button
                        className="btn-icon edit"
                        onClick={() => handleEdit(t)}
                        title="Sửa"
                      ><i className="bi bi-pencil-square"></i>
                        <Edit size={16} />
                      </button>
                      <button
                        className="btn-icon delete"
                        onClick={() => handleDelete(t.id)}
                        title="Xóa"
                      ><i className="bi bi-trash"></i>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Tickets;