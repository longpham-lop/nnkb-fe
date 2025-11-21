import { useEffect, useState } from "react";
import {
  getAllPayments,
  createPayment,
  updatePayment,
  deletePayment,
} from "../../api/payment";
import "./Events.css";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [form, setForm] = useState({
    order_id: "",
    method: "",
    status: "",
    transaction_code: "",
    paid_at: "",
    total_paid: "",
  });

  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);

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
    }
  };

  const handleEdit = (p) => {
    setForm({
      order_id: p.order_id,
      method: p.method,
      status: p.status,
      transaction_code: p.transaction_code || "",
      paid_at: p.paid_at?.slice(0, 16) || "",
      total_paid: p.total_paid,
    });
    setIsEdit(true);
    setCurrentId(p.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xoá thanh toán này?")) return;
    await deletePayment(id);
    fetchPayments();
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

  return (
    <div className="admin-page-content">
      <h2 className="page-header">Quản lý Thanh toán</h2>

      {/* FORM */}
      <div className="form-box">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Order ID</label>
            <input
              type="number"
              name="order_id"
              value={form.order_id}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phương thức</label>
            <input
              type="text"
              name="method"
              value={form.method}
              onChange={handleChange}
              placeholder="VNPAY / MOMO..."
              required
            />
          </div>

          <div className="form-group">
            <label>Trạng thái</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              required
            >
              <option value="">-- Chọn trạng thái --</option>
              <option value="PENDING">PENDING</option>
              <option value="SUCCESS">SUCCESS</option>
              <option value="FAILED">FAILED</option>
            </select>
          </div>

          <div className="form-group">
            <label>Mã giao dịch</label>
            <input
              type="text"
              name="transaction_code"
              value={form.transaction_code}
              onChange={handleChange}
            />
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

          <div className="form-group">
            <label>Tổng tiền</label>
            <input
              type="number"
              name="total_paid"
              value={form.total_paid}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-actions">
            <button className="btn btn-primary" type="submit">
              {isEdit ? "Cập nhật" : "Thêm mới"}
            </button>

            {isEdit && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetForm}
              >
                Huỷ
              </button>
            )}
          </div>
        </form>
      </div>

      {/* TABLE */}
      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Order ID</th>
              <th>Method</th>
              <th>Status</th>
              <th>Mã GD</th>
              <th>Paid At</th>
              <th>Total</th>
              <th>Hành động</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.order_id}</td>
                <td>{p.method}</td>
                <td>{p.status}</td>
                <td>{p.transaction_code}</td>
                <td>
                  {p.paid_at
                    ? new Date(p.paid_at).toLocaleString()
                    : ""}
                </td>
                <td>{Number(p.total_paid).toLocaleString()}</td>
                <td>
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleEdit(p)}
                  >
                    Sửa
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(p.id)}
                  >
                    Xoá
                  </button>
                </td>
              </tr>
            ))}

            {payments.length === 0 && (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payments;
