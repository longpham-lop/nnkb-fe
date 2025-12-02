import React, { useEffect, useState } from "react";
import {
  getAllPayments,
  createPayment,
  updatePayment,
  deletePayment,
} from "../../api/payment";
import "./payment.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { 
  CreditCard, Edit, Trash2, Save, X, Plus, 
  Search, CheckCircle, XCircle, Clock, Wallet
} from "lucide-react";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [form, setForm] = useState({
    order_id: "",
    method: "",
    status: "",
    transaction_code: "",
    paid_at: "",
    total_paid: "",
  });

  const fetchPayments = async () => {
    try {
      const res = await getAllPayments();
      setPayments(res.data);
    } catch (err) {
      console.error("Lỗi load payments:", err);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await updatePayment(currentId, form);
      } else {
        await createPayment(form);
      }
      resetForm();
      fetchPayments();
    } catch (err) {
      console.error("Lỗi submit:", err);
      alert("Có lỗi xảy ra!");
    }
  };

  const handleEdit = (p) => {
    setForm({
      order_id: p.order_id,
      method: p.method,
      status: p.status,
      transaction_code: p.transaction_code || "",
      paid_at: p.paid_at ? p.paid_at.slice(0, 16) : "",
      total_paid: p.total_paid,
    });
    setIsEdit(true);
    setCurrentId(p.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xoá thanh toán này?")) return;
    try {
      await deletePayment(id);
      fetchPayments();
    } catch (err) {
      console.error("Lỗi xóa:", err);
    }
  };

  const resetForm = () => {
    setForm({
      order_id: "",
      method: "",
      status: "",
      transaction_code: "",
      paid_at: "",
      total_paid: "",
    });
    setIsEdit(false);
    setCurrentId(null);
  };

  // Render badge trạng thái
  const renderStatus = (status) => {
    const s = status?.toUpperCase();
    if (s === "SUCCESS" || s === "COMPLETED") {
        return <span className="status-badge success"><CheckCircle size={12}/> Thành công</span>;
    }
    if (s === "PENDING") {
        return <span className="status-badge warning"><Clock size={12}/> Đang chờ</span>;
    }
    if (s === "FAILED" || s === "CANCELLED") {
        return <span className="status-badge danger"><XCircle size={12}/> Thất bại</span>;
    }
    return <span className="status-badge default">{status}</span>;
  };

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Filter + search
  const filteredPayments = payments.filter(p => {
    const searchMatch =
      p.order_id.toString().includes(searchTerm) ||
      p.transaction_code?.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = statusFilter ? p.status?.toUpperCase() === statusFilter.toUpperCase() : true;
    return searchMatch && statusMatch;
  });

  // Phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPayments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

  return (
    <div className="dashboard-wrapper">
      <div className="page-header">
        <h2><CreditCard className="header-icon"/> Quản lý Thanh toán</h2>
      </div>

      {/* FORM */}
      <div className="card form-card">
        <div className="card-header">
            <h3>{isEdit ? "Cập nhật giao dịch" : "Ghi nhận thanh toán mới"}</h3>
        </div>
        
        <form className="payment-form" onSubmit={handleSubmit}>
          <div className="form-row">
             <div className="form-group">
                <label>Order ID <span className="required">*</span></label>
                <input
                  type="number"
                  name="order_id"
                  value={form.order_id}
                  onChange={handleChange}
                  required
                  placeholder="Mã đơn hàng"
                />
             </div>

             <div className="form-group">
                <label>Tổng tiền <span className="required">*</span></label>
                <input
                  type="number"
                  name="total_paid"
                  value={form.total_paid}
                  onChange={handleChange}
                  required
                  placeholder="VNĐ"
                />
             </div>

             <div className="form-group">
                <label>Phương thức <span className="required">*</span></label>
                <div className="select-wrapper">
                    <Wallet size={16} className="input-icon"/>
                    <input
                      type="text"
                      name="method"
                      value={form.method}
                      onChange={handleChange}
                      placeholder="VNPAY / MOMO..."
                      required
                      className="icon-padding"
                    />
                </div>
             </div>
          </div>

          <div className="form-row">
             <div className="form-group">
                <label>Mã giao dịch (Trans ID)</label>
                <input
                  type="text"
                  name="transaction_code"
                  value={form.transaction_code}
                  onChange={handleChange}
                  placeholder="VD: VNP123456"
                />
             </div>

             <div className="form-group">
                <label>Trạng thái</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  required
                  className={`status-select ${form.status?.toLowerCase()}`}
                >
                  <option value="">-- Chọn --</option>
                  <option value="PENDING">⏳ PENDING</option>
                  <option value="SUCCESS">✅ SUCCESS</option>
                  <option value="FAILED">❌ FAILED</option>
                </select>
             </div>

             <div className="form-group">
                <label>Ngày thanh toán</label>
                <input
                  type="datetime-local"
                  name="paid_at"
                  value={form.paid_at}
                  onChange={handleChange}
                />
             </div>
          </div>

          <div className="form-actions">
            {isEdit && (
              <button type="button" className="btn-cancel" onClick={resetForm}>
                <X size={18} /> Hủy bỏ
              </button>
            )}
            <button className="btn-primary-action" type="submit">
              {isEdit ? <Save size={18} /> : <Plus size={18} />}
              {isEdit ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>

      {/* TOOLBAR */}
      <div className="toolbar-section">
        <div className="search-bar">
            <Search className="search-icon" size={18} />
            <input 
                type="text" 
                placeholder="Tìm theo Order ID hoặc Mã giao dịch..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <div className="filter-group">
          <button className={`filter-btn ${statusFilter === "" ? "active" : ""}`} onClick={() => setStatusFilter("")}>Tất cả</button>
          <button className={`filter-btn ${statusFilter === "SUCCESS" ? "active" : ""}`} onClick={() => setStatusFilter("SUCCESS")}>Thành công</button>
          <button className={`filter-btn ${statusFilter === "PENDING" ? "active" : ""}`} onClick={() => setStatusFilter("PENDING")}>Đang chờ</button>
          <button className={`filter-btn ${statusFilter === "FAILED" ? "active" : ""}`} onClick={() => setStatusFilter("FAILED")}>Thất bại</button>
        </div>
      </div>

      {/* TABLE */}
      <div className="card table-card">
        <div className="table-responsive">
          <table className="admin-table payment-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>MÃ ĐƠN (ORDER)</th>
                <th>PHƯƠNG THỨC</th>
                <th>TỔNG TIỀN</th>
                <th>TRẠNG THÁI</th>
                <th>MÃ GIAO DỊCH</th>
                <th>THỜI GIAN</th>
                <th className="text-center">HÀNH ĐỘNG</th>
              </tr>
            </thead>

            <tbody>
              {currentItems.length === 0 && (
                 <tr><td colSpan="8" className="text-center">Không tìm thấy dữ liệu</td></tr>
              )}
              {currentItems.map((p) => (
                <tr key={p.id}>
                  <td><span className="id-badge">#{p.id}</span></td>
                  <td><span className="order-badge">Order #{p.order_id}</span></td>
                  <td className="method-cell">{p.method}</td>
                  <td className="amount-cell">{formatMoney(p.total_paid)}</td>
                  <td>{renderStatus(p.status)}</td>
                  <td>{p.transaction_code || <span className="text-muted">—</span>}</td>
                  <td>{p.paid_at ? new Date(p.paid_at).toLocaleString('vi-VN') : '—'}</td>
                  <td>
                    <button className="btn-icon edit" onClick={() => handleEdit(p)} title="Sửa">
                      <Edit size={16} />
                    </button>
                    <button className="btn-icon delete" onClick={() => handleDelete(p.id)} title="Xoá">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >Prev</button>

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
              >Next</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payments;
