import React, { useState, useEffect } from "react";
import "./order.css";
import {
  getAllOrders,
  updateOrder,
  deleteOrder,
} from "../../api/order";
import { 
  ShoppingCart, Edit, Trash2, Save, X, 
  Search, Filter, CheckCircle, Clock, XCircle, CreditCard 
} from "lucide-react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [statusForm, setStatusForm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setStatusForm("");
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
      handleCancelEdit();
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái:", err);
      alert("Cập nhật thất bại");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Bạn chắc chắn muốn xóa đơn hàng này? Hành động này không thể hoàn tác.")) return;
    try {
      await deleteOrder(id);
      setOrders(orders.filter((o) => o.id !== id));
    } catch (err) {
      console.error("Lỗi xóa đơn hàng:", err);
    }
  };

  // Helper format tiền tệ
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Helper render trạng thái badge
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return <span className="status-badge success"><CheckCircle size={12}/> Đã thanh toán</span>;
      case 'pending':
        return <span className="status-badge warning"><Clock size={12}/> Chờ xử lý</span>;
      case 'cancelled':
        return <span className="status-badge danger"><XCircle size={12}/> Đã hủy</span>;
      default:
        return <span className="status-badge default">{status}</span>;
    }
  };

  // Filter logic đơn giản
  const filteredOrders = orders.filter(o => 
    o.id.toString().includes(searchTerm) || 
    o.user_id.toString().includes(searchTerm)
  );

  return (
    <div className="dashboard-wrapper">
      <div className="page-header">
        <h2><ShoppingCart className="header-icon"/> Quản lý Đơn hàng</h2>
      </div>

      {/* --- FORM CẬP NHẬT TRẠNG THÁI (Chỉ hiện khi Edit) --- */}
      {editingId && (
        <div className="card form-card slide-down">
            <div className="card-header">
                <h3>Cập nhật trạng thái đơn hàng #{editingId}</h3>
            </div>
            <form className="order-status-form" onSubmit={handleUpdateStatus}>
                <div className="form-group">
                    <label>Trạng thái mới:</label>
                    <div className="select-wrapper">
                        <select
                            value={statusForm}
                            onChange={(e) => setStatusForm(e.target.value)}
                            className={`status-select ${statusForm}`}
                        >
                            <option value="pending">⏳ Chờ xử lý</option>
                            <option value="paid">✅ Đã thanh toán</option>
                            <option value="cancelled">❌ Hủy đơn</option>
                        </select>
                    </div>
                </div>
                
                <div className="form-actions">
                    <button type="button" className="btn-cancel" onClick={handleCancelEdit}>
                        <X size={18} /> Hủy bỏ
                    </button>
                    <button type="submit" className="btn-primary-action">
                        <Save size={18} /> Lưu trạng thái
                    </button>
                </div>
            </form>
        </div>
      )}

      {/* --- TOOLBAR --- */}
      <div className="toolbar-section">
        <div className="search-bar">
            <Search className="search-icon" size={18} />
            <input 
                type="text" 
                placeholder="Tìm kiếm theo ID đơn hàng hoặc User ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <div className="filter-group">
            <button className="filter-btn active">Tất cả</button>
            <button className="filter-btn">Đã thanh toán</button>
            <button className="filter-btn">Chờ xử lý</button>
        </div>
      </div>

      {/* --- TABLE --- */}
      <div className="card table-card">
        <div className="table-responsive">
          <table className="admin-table order-table">
            <thead>
              <tr>
                <th>MÃ ĐƠN</th>
                <th>KHÁCH HÀNG (ID)</th>
                <th>SỰ KIỆN (ID)</th>
                <th>TỔNG TIỀN</th>
                <th>TRẠNG THÁI</th>
                <th>NGÀY TẠO</th>
                <th>THANH TOÁN</th>
                <th className="text-center">HÀNH ĐỘNG</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.length === 0 && (
                 <tr><td colSpan="8" className="text-center">Không tìm thấy đơn hàng nào</td></tr>
              )}
              {filteredOrders.map((o) => (
                <tr key={o.id}>
                  <td><span className="id-badge">#{o.id}</span></td>
                  <td><span className="user-badge">User {o.user_id}</span></td>
                  <td>
                    <div className="event-info-cell">
                        Event #{o.event_id}
                    </div>
                  </td>
                  <td className="price-cell">{formatCurrency(o.total_amount)}</td>
                  <td>{renderStatusBadge(o.status)}</td>
                  <td className="date-cell">
                    {o.created_at ? new Date(o.created_at).toLocaleDateString('vi-VN') : '—'}
                    <span className="time-sub">
                        {o.created_at ? new Date(o.created_at).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'}) : ''}
                    </span>
                  </td>
                  <td>
                    {o.payment_id ? (
                        <div className="payment-badge" title={o.payment_id}>
                            <CreditCard size={12}/> ID: ...{o.payment_id.slice(-4)}
                        </div>
                    ) : <span className="text-muted">—</span>}
                  </td>
                  <td className="action-buttons text-center">
                    <button
                      className="btn-icon edit"
                      onClick={() => handleEdit(o)}
                      title="Cập nhật trạng thái"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="btn-icon delete"
                      onClick={() => handleDelete(o.id)}
                      title="Xóa đơn hàng"
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

export default Orders;