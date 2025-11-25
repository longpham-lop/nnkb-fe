import React, { useState, useEffect } from "react";
import "./transaction.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import {
  getAllTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../../api/transaction";
import { 
  CreditCard, Edit, Trash2, Save, X, Plus,
  Search, Calendar, ArrowRight, User, RefreshCw
} from "lucide-react";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    sender_id: "",
    receiver_id: "",
    amount: "",
  });

  // Search + filter
  const [searchSender, setSearchSender] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const res = await getAllTransactions();
      setTransactions(res.data);
    } catch (err) {
      console.error("Lỗi load giao dịch:", err);
    }
  };

  // ========================
  // Handle Form
  // ========================
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      sender_id: "",
      receiver_id: "",
      amount: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // UPDATE
        await updateTransaction(editingId, formData);
        setTransactions(
          transactions.map((t) =>
            t.id === editingId ? { ...t, ...formData } : t
          )
        );
      } else {
        // CREATE
        const res = await createTransaction(formData);
        setTransactions([res.data, ...transactions]);
      }
      resetForm();
    } catch (err) {
      console.error("Lỗi lưu giao dịch:", err);
      alert("Có lỗi xảy ra khi lưu giao dịch");
    }
  };

  const handleEdit = (t) => {
    setEditingId(t.id);
    setFormData({
      sender_id: t.sender_id,
      receiver_id: t.receiver_id,
      amount: t.amount,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm("Bạn chắc chắn muốn xóa giao dịch này?")) return;
    try {
      await deleteTransaction(id);
      setTransactions(transactions.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Lỗi xóa giao dịch:", err);
    }
  };

  // Helper format tiền tệ
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Helper format ngày
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  // ========================
  // Filter + Search logic
  // ========================
  const filteredTransactions = transactions.filter((t) => {
    const matchSender = t.sender_id
      .toString()
      .toLowerCase()
      .includes(searchSender.toLowerCase()) || 
      t.receiver_id.toString().includes(searchSender); // Tìm cả người nhận

    const created = new Date(t.created_at).getTime();
    const from = fromDate ? new Date(fromDate).getTime() : null;
    
    // Fix lỗi chọn toDate bị hụt giờ (thêm cuối ngày)
    let to = null;
    if(toDate) {
        const d = new Date(toDate);
        d.setHours(23, 59, 59, 999);
        to = d.getTime();
    }

    const matchDate = (!from || created >= from) && (!to || created <= to);

    return matchSender && matchDate;
  });

  return (
    <div className="dashboard-wrapper">
      <div className="page-header">
        <h2><CreditCard className="header-icon"/> Quản lý Giao dịch</h2>
      </div>

      {/* =======================
          FORM TẠO / SỬA (CARD)
      ======================= */}
      <div className="card form-card">
        <div className="card-header">
            <h3>{editingId ? `Chỉnh sửa giao dịch #${editingId}` : "Tạo giao dịch mới"}</h3>
        </div>
        
        <form className="transaction-form" onSubmit={handleSubmit}>
            <div className="form-row">
                <div className="form-group">
                    <label>Người gửi (Sender ID)</label>
                    <div className="input-with-icon">
                        <User size={16} className="input-icon"/>
                        <input
                            type="text"
                            name="sender_id"
                            placeholder="ID người gửi"
                            value={formData.sender_id}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="arrow-separator">
                    <ArrowRight size={24} color="#8b9bb4"/>
                </div>

                <div className="form-group">
                    <label>Người nhận (Receiver ID)</label>
                    <div className="input-with-icon">
                        <User size={16} className="input-icon"/>
                        <input
                            type="text"
                            name="receiver_id"
                            placeholder="ID người nhận"
                            value={formData.receiver_id}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-group amount-group">
                    <label>Số tiền (VND)</label>
                    <input
                        type="number"
                        name="amount"
                        placeholder="0"
                        value={formData.amount}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className="form-actions">
                {editingId && (
                    <button type="button" className="btn-cancel" onClick={resetForm}>
                        <X size={18} /> Hủy bỏ
                    </button>
                )}
                <button className="btn-primary-action" type="submit">
                    {editingId ? <Save size={18} /> : <Plus size={18} />}
                    {editingId ? "Cập nhật" : "Thực hiện giao dịch"}
                </button>
            </div>
        </form>
      </div>

      {/* =======================
          TOOLBAR (SEARCH & FILTER)
      ======================= */}
      <div className="toolbar-section">
        <div className="search-bar">
            <Search className="search-icon" size={18} />
            <input 
                type="text" 
                placeholder="Tìm theo Sender ID hoặc Receiver ID..." 
                value={searchSender}
                onChange={(e) => setSearchSender(e.target.value)}
            />
        </div>
        
        <div className="date-filter-group">
            <div className="date-input">
                <span className="label">Từ:</span>
                <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                />
            </div>
            <div className="date-input">
                <span className="label">Đến:</span>
                <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                />
            </div>
            <button className="btn-refresh" onClick={() => {setFromDate(''); setToDate(''); setSearchSender('')}} title="Reset bộ lọc">
                <RefreshCw size={16} />
            </button>
        </div>
      </div>

      {/* =======================
          TABLE
      ======================= */}
      <div className="card table-card">
        <div className="table-responsive">
          <table className="admin-table transaction-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>LUỒNG GIAO DỊCH (SENDER ➔ RECEIVER)</th>
                <th>SỐ TIỀN</th>
                <th>THỜI GIAN</th>
                <th className="text-center">HÀNH ĐỘNG</th>
              </tr>
            </thead>

            <tbody>
              {filteredTransactions.length === 0 && (
                 <tr><td colSpan="5" className="text-center">Không tìm thấy giao dịch nào</td></tr>
              )}
              {filteredTransactions.map((t) => (
                <tr key={t.id}>
                  <td><span className="id-badge">#{t.id}</span></td>
                  <td>
                    <div className="transaction-flow">
                        <div className="user-node sender">
                            <span className="label">Gửi</span>
                            <span className="value">User {t.sender_id}</span>
                        </div>
                        <div className="flow-arrow">
                            <ArrowRight size={16} />
                        </div>
                        <div className="user-node receiver">
                            <span className="label">Nhận</span>
                            <span className="value">User {t.receiver_id}</span>
                        </div>
                    </div>
                  </td>
                  <td className="amount-cell positive">
                    + {Number(t.amount).toLocaleString()} ₫
                  </td>
                  <td className="date-cell">
                     {formatDate(t.created_at)}
                  </td>
                  <td className="action-buttons text-center">
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transactions;