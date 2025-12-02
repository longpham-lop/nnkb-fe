import React, { useState, useEffect } from "react";
import "./order_item.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import {
  getAllOrderItems,
  updateOrderItem,
  deleteOrderItem,
} from "../../api/orderitem";
import { 
  List, Edit, Trash2, Save, X, 
  Search, CheckCircle, XCircle, QrCode, Ticket 
} from "lucide-react";

const OrderItems = () => {
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [checkedInForm, setCheckedInForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // --- PHÂN TRANG ---
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
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
      alert("Cập nhật thất bại");
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Filter logic
  const filteredItems = items.filter(i => 
    i.order_id.toString().includes(searchTerm) || 
    i.ticket_id.toString().includes(searchTerm) ||
    i.id.toString().includes(searchTerm)
  );

  // --- PHÂN TRANG DỮ LIỆU ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  return (
    <div className="dashboard-wrapper">
      <div className="page-header">
        <h2><List className="header-icon"/> Chi tiết Đơn hàng & Soát vé</h2>
      </div>

      {/* --- FORM EDIT CHECK-IN --- */}
      {editingId && (
        <div className="card form-card slide-down">
            <div className="card-header">
                <h3>Cập nhật trạng thái Check-in (Item #{editingId})</h3>
            </div>
            <form className="checkin-form" onSubmit={handleUpdate}>
                <div className="form-group">
                    <label>Trạng thái vé:</label>
                    <div className="toggle-wrapper">
                        <button 
                            type="button"
                            className={`toggle-btn ${checkedInForm ? 'active' : ''}`}
                            onClick={() => setCheckedInForm(true)}
                        >
                            <CheckCircle size={16} /> Đã Check-in
                        </button>
                        <button 
                            type="button"
                            className={`toggle-btn ${!checkedInForm ? 'active-red' : ''}`}
                            onClick={() => setCheckedInForm(false)}
                        >
                            <XCircle size={16} /> Chưa Check-in
                        </button>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" className="btn-cancel" onClick={handleCancelEdit}>
                        <X size={18} /> Hủy bỏ
                    </button>
                    <button type="submit" className="btn-primary-action">
                        <Save size={18} /> Lưu thay đổi
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
                placeholder="Tìm theo Order ID, Ticket ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      {/* --- TABLE --- */}
      <div className="card table-card">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>MÃ ĐƠN (ORDER)</th>
                <th>LOẠI VÉ (TICKET)</th>
                <th>SỐ LƯỢNG</th>
                <th>ĐƠN GIÁ</th>
                <th>QR CODE</th>
                <th>TRẠNG THÁI</th>
                <th className="text-center">HÀNH ĐỘNG</th>
              </tr>
            </thead>

            <tbody>
              {currentItems.length === 0 && (
                 <tr><td colSpan="8" className="text-center">Không tìm thấy dữ liệu</td></tr>
              )}
              {currentItems.map((i) => (
                <tr key={i.id}>
                  <td><span className="id-badge">#{i.id}</span></td>
                  <td><span className="order-badge">Order #{i.order_id}</span></td>
                  <td>
                    <div className="ticket-info">
                        <Ticket size={14} /> Ticket #{i.ticket_id}
                    </div>
                  </td>
                  <td>x{i.quantity}</td>
                  <td className="price-text">{formatCurrency(i.unit_price)}</td>
                  <td>
                    {i.qr_code ? (
                      <a href={i.qr_code} target="_blank" rel="noreferrer" className="qr-link">
                        <QrCode size={16} /> Check QR
                      </a>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td>
                    {i.checked_in ? (
                        <span className="status-badge success"><CheckCircle size={12}/> Đã Check-in</span>
                    ) : (
                        <span className="status-badge default"><XCircle size={12}/> Chưa Check-in</span>
                    )}
                  </td>
                  <td className="action-buttons text-center">
                    <button
                      className="btn-icon edit"
                      onClick={() => handleEdit(i)}
                      title="Cập nhật Check-in"
                    >
                      <Edit size={16}/>
                    </button>
                    <button
                      className="btn-icon delete"
                      onClick={() => handleDelete(i.id)}
                      title="Xóa"
                    >
                      <Trash2 size={16}/>
                    </button>
                  </td>
                </tr>
              ))}
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

export default OrderItems;
