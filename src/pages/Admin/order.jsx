import React, { useState, useEffect, useRef } from "react";
import "./order.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import * as XLSX from 'xlsx';
import {
  getAllOrders,
  updateOrder,
  deleteOrder,
} from "../../api/order";
import { 
  ShoppingCart, Edit, Trash2, Save, X, 
  Search, CheckCircle, Clock, XCircle, CreditCard,
  Download
} from "lucide-react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [statusForm, setStatusForm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const tableRef = useRef(null); // Ref để cuộn trang

  // --- CẤU HÌNH PHÂN TRANG ---
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(6); // Giữ cố định 6 dòng mỗi trang để bảng không bị dài ngắn thất thường

  useEffect(() => {
    loadOrders();
  }, []);

  // Khi chuyển trang, tự động cuộn lên đầu bảng
  useEffect(() => {
    if (tableRef.current) {
        tableRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentPage]);

  const loadOrders = async () => {
    try {
      const res = await getAllOrders();
      const rawData = Array.isArray(res.data) ? res.data : [];

      const uniqueOrders = Object.values(
        rawData.reduce((acc, curr) => {
          if (!acc[curr.id]) {
            acc[curr.id] = curr;
          }
          return acc;
        }, {})
      );

      // Sắp xếp đơn mới nhất lên đầu (nếu cần)
      uniqueOrders.sort((a, b) => b.id - a.id);

      setOrders(uniqueOrders);
    } catch (err) {
      console.error("Lỗi lấy danh sách đơn hàng:", err);
    }
  };

  const handleEdit = (order) => {
    setEditingId(order.id);
    setStatusForm(order.status);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setStatusForm("");
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    try {
      await updateOrder(editingId, { status: statusForm });
      setOrders(orders.map((o) => o.id === editingId ? { ...o, status: statusForm } : o));
      handleCancelEdit();
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
      alert("Cập nhật thất bại");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa?")) return;
    try {
      await deleteOrder(id);
      setOrders(orders.filter((o) => o.id !== id));
    } catch (err) {
      console.error("Lỗi xóa:", err);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'paid': return <span className="status-badge success"><CheckCircle size={12}/> Đã thanh toán</span>;
      case 'pending': return <span className="status-badge warning"><Clock size={12}/> Chờ xử lý</span>;
      case 'cancelled': return <span className="status-badge danger"><XCircle size={12}/> Đã hủy</span>;
      default: return <span className="status-badge default">{status}</span>;
    }
  };

  // 1. Filter
  const filteredOrders = orders.filter(o => 
    o.id?.toString().includes(searchTerm) || 
    o.user_id?.toString().includes(searchTerm)
  );

  // 2. Pagination Calculation (Quan trọng)
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  
  // 3. CẮT MẢNG: Chỉ lấy 6 phần tử cho trang hiện tại
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const handleExportExcel = () => {
    const dataToExport = filteredOrders.map(order => ({
        "Mã Đơn": order.id,
        "User ID": order.user_id,
        "Tổng tiền": order.total_amount,
        "Trạng thái": order.status,
        "Ngày tạo": new Date(order.created_at).toLocaleString('vi-VN')
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DonHang");
    XLSX.writeFile(workbook, "Danh_Sach_Don_Hang.xlsx");
  };

  return (
    <div className="dashboard-wrapper">
      <div className="page-header" ref={tableRef}> {/* Gắn ref vào đây để cuộn lên */}
        <h2><ShoppingCart className="header-icon"/> Quản lý Đơn hàng</h2>
        <button onClick={handleExportExcel} className="btn-secondary-action" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#fff', border: '1px solid #ccc', borderRadius: '6px', cursor: 'pointer' }}>
            <Download size={18} /> Xuất Excel
        </button>
      </div>

      {/* Form Sửa (Giữ nguyên) */}
      {editingId && (
        <div className="card form-card slide-down" style={{ marginBottom: '20px' }}>
            <div className="card-header"><h3>Cập nhật trạng thái #{editingId}</h3></div>
            <form className="order-status-form" onSubmit={handleUpdateStatus}>
                <div className="form-group">
                    <label>Trạng thái mới:</label>
                    <select value={statusForm} onChange={(e) => setStatusForm(e.target.value)} className={`status-select ${statusForm}`}>
                        <option value="pending">⏳ Chờ xử lý</option>
                        <option value="paid">✅ Đã thanh toán</option>
                        <option value="cancelled">❌ Hủy đơn</option>
                    </select>
                </div>
                <div className="form-actions">
                    <button type="button" className="btn-cancel" onClick={handleCancelEdit}><X size={18} /> Hủy</button>
                    <button type="submit" className="btn-primary-action"><Save size={18} /> Lưu</button>
                </div>
            </form>
        </div>
      )}

      {/* Toolbar Tìm kiếm */}
      <div className="toolbar-section">
        <div className="search-bar">
            <Search className="search-icon" size={18} />
            <input 
                type="text" 
                placeholder="Tìm ID đơn hàng..." 
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
        </div>
      </div>

      {/* Bảng Dữ Liệu */}
      <div className="card table-card">
        <div className="table-responsive" style={{ minHeight: '400px' }}> {/* Đặt min-height để bảng không bị giật */}
          <table className="admin-table order-table">
            <thead>
              <tr>
                <th>MÃ ĐƠN</th>
                <th>KHÁCH HÀNG</th>
                <th>SỰ KIỆN</th>
                <th>TỔNG TIỀN</th>
                <th>TRẠNG THÁI</th>
                <th>NGÀY TẠO</th>
                <th>THANH TOÁN</th>
                <th className="text-center">HÀNH ĐỘNG</th>
              </tr>
            </thead>
            
            <tbody>
              {/* QUAN TRỌNG: Phải map currentOrders (đã cắt), KHÔNG map orders */}
              {currentOrders.length === 0 && (
                 <tr><td colSpan="8" className="text-center">Không tìm thấy đơn hàng nào</td></tr>
              )}
              {currentOrders.map((o) => (
                <tr key={o.id}>
                  <td><span className="id-badge">#{o.id}</span></td>
                  <td>User {o.user_id}</td>
                  <td>Event {o.event_id}</td>
                  <td className="price-cell">{formatCurrency(o.total_amount)}</td>
                  <td>{renderStatusBadge(o.status)}</td>
                  <td className="date-cell">{o.created_at ? new Date(o.created_at).toLocaleDateString('vi-VN') : '—'}</td>
                  <td>
                    {o.payment_id ? <div className="payment-badge"><CreditCard size={12}/> ...{o.payment_id.slice(-4)}</div> : '—'}
                  </td>
                  <td>
                    <button className="btn-icon edit" onClick={() => handleEdit(o)}><Edit size={16}/></button>
                    <button className="btn-icon delete" onClick={() => handleDelete(o.id)}><Trash2 size={16}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Thanh Phân Trang */}
        {totalPages > 1 && (
          <div className="pagination">
            <button 
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} 
                disabled={currentPage === 1}
            >
                Prev
            </button>

            {/* Chỉ hiển thị số trang hợp lý */}
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
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} 
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

export default Orders;