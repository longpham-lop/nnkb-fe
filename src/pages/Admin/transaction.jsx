import React, { useState, useEffect } from "react";
import "./Events.css";
import {
  getAllTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../../api/transaction";

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
    }
  };

  const handleEdit = (t) => {
    setEditingId(t.id);
    setFormData({
      sender_id: t.sender_id,
      receiver_id: t.receiver_id,
      amount: t.amount,
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Bạn chắc chắn muốn xóa?")) return;
    try {
      await deleteTransaction(id);
      setTransactions(transactions.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Lỗi xóa giao dịch:", err);
    }
  };

  // ========================
  // Filter + Search logic
  // ========================
  const filteredTransactions = transactions.filter((t) => {
    const matchSender = t.sender_id
      .toString()
      .toLowerCase()
      .includes(searchSender.toLowerCase());

    const created = new Date(t.created_at).getTime();
    const from = fromDate ? new Date(fromDate).getTime() : null;
    const to = toDate ? new Date(toDate).getTime() : null;

    const matchDate =
      (!from || created >= from) && (!to || created <= to);

    return matchSender && matchDate;
  });

  return (
    <div className="admin-page-content">
      <div className="page-header">
        <h2>Quản lý Giao dịch</h2>
      </div>

      {/* =======================
          FORM TẠO / SỬA
      ======================= */}
      <form className="event-form" onSubmit={handleSubmit}>
        <label>
          Sender ID
          <input
            type="text"
            name="sender_id"
            value={formData.sender_id}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Receiver ID
          <input
            type="text"
            name="receiver_id"
            value={formData.receiver_id}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Amount
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </label>

        <div style={{ display: "flex", gap: "10px" }}>
          <button className="btn btn-primary" type="submit">
            {editingId ? "Cập nhật" : "Thêm mới"}
          </button>

          {editingId && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={resetForm}
            >
              Hủy
            </button>
          )}
        </div>
      </form>

      {/* =======================
          FILTER + SEARCH
      ======================= */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Tìm theo Sender ID..."
          value={searchSender}
          onChange={(e) => setSearchSender(e.target.value)}
        />

        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />

        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
      </div>

      {/* =======================
          TABLE
      ======================= */}
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Sender</th>
            <th>Receiver</th>
            <th>Số tiền</th>
            <th>Thời gian</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          {filteredTransactions.map((t) => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.sender_id}</td>
              <td>{t.receiver_id}</td>
              <td>{Number(t.amount).toLocaleString()} ₫</td>
              <td>{new Date(t.created_at).toLocaleString("vi-VN")}</td>
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

export default Transactions;
