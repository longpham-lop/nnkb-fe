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

  // --- PHÂN TRANG ---
  const [currentPage, setCurrentPage] = useState(1);
  const [ticketsPerPage] = useState(5);

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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  // --- PHÂN TRANG DỮ LIỆU ---
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = tickets.slice(indexOfFirstTicket, indexOfLastTicket);
  const totalPages = Math.ceil(tickets.length / ticketsPerPage);

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
          {/* ... form giống như cũ ... */}
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
              {currentTickets.length === 0 && (
                 <tr><td colSpan="8" className="text-center">Chưa có dữ liệu</td></tr>
              )}
              {currentTickets.map((t) => {
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
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="btn-icon delete"
                        onClick={() => handleDelete(t.id)}
                        title="Xóa"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* --- PAGINATION --- */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={currentPage === i + 1 ? "active" : ""}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tickets;
