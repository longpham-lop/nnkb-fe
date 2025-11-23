import React, { useState, useEffect } from "react";
import "./Users.css";
import { getAllUsers, updateUser } from "../../api/auth";
import { 
  Users as UsersIcon, Search, Shield, ShieldAlert, 
  CheckCircle, Ban, Filter, Phone, Mail 
} from "lucide-react";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();      
      setUsers(res.data);  
    } catch (err) {
      console.error("Lỗi lấy danh sách users:", err);
    }
  };

  const handleToggleBan = async (userId, currentStatus) => {
    const action = currentStatus === "active" ? "khóa" : "mở khóa";
    if (!confirm(`Bạn có chắc muốn ${action} tài khoản này?`)) return;

    try {
      const newStatus = currentStatus === "active" ? "locked" : "active";
      await updateUser(userId, { status: newStatus });

      setUsers(users.map(u => 
        u.id === userId ? { ...u, status: newStatus } : u
      ));
    } catch (err) {
      console.error("Lỗi ban/unban user:", err);
      alert("Thao tác thất bại");
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    if (!confirm(`Đổi vai trò người dùng này thành ${newRole}?`)) return;
    
    try {
      await updateUser(userId, { role: newRole });
      setUsers(users.map(u =>
        u.id === userId ? { ...u, role: newRole } : u
      ));
    } catch (err) {
      console.error("Lỗi đổi vai trò:", err);
      alert("Đổi vai trò thất bại");
    }
  };

  // Helper render role badge
  const renderRoleBadge = (role) => {
    if (role === 'admin') {
        return <span className="role-badge admin"><ShieldAlert size={12}/> Admin</span>;
    }
    return <span className="role-badge user"><Shield size={12}/> User</span>;
  };

  // Filter logic
  const filteredUsers = users.filter(u => {
    const matchSearch = 
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.phone?.includes(searchTerm);
    
    const matchRole = roleFilter === 'all' || u.role === roleFilter;

    return matchSearch && matchRole;
  });

  return (
    <div className="dashboard-wrapper">
      <div className="page-header">
        <h2><UsersIcon className="header-icon"/> Quản lý Người dùng</h2>
      </div>

      {/* TOOLBAR */}
      <div className="toolbar-section">
        <div className="search-bar">
            <Search className="search-icon" size={18} />
            <input 
                type="text" 
                placeholder="Tìm theo tên, email, SĐT..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>

        <div className="filter-dropdown">
            <Filter size={16} className="filter-icon"/>
            <select 
                value={roleFilter} 
                onChange={(e) => setRoleFilter(e.target.value)}
                className="custom-select"
            >
                <option value="all">Tất cả vai trò</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
            </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="card table-card">
        <div className="table-responsive">
          <table className="admin-table user-table">
            <thead>
              <tr>
                <th>THÔNG TIN NGƯỜI DÙNG</th>
                <th>LIÊN HỆ</th>
                <th>VAI TRÒ</th>
                <th>TRẠNG THÁI</th>
                <th className="text-center">HÀNH ĐỘNG</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.length === 0 && (
                 <tr><td colSpan="5" className="text-center">Không tìm thấy người dùng</td></tr>
              )}
              {filteredUsers.map((user) => (
                <tr key={user.id} className={user.status === 'locked' ? 'row-locked' : ''}>
                  <td>
                    <div className="user-info-cell">
                        <div className="avatar-circle">{user.name.charAt(0).toUpperCase()}</div>
                        <div className="info-text">
                            <div className="user-name">{user.name}</div>
                            <div className="user-id">ID: {user.id}</div>
                        </div>
                    </div>
                  </td>
                  <td>
                    <div className="contact-cell">
                        <div className="contact-row" title={user.email}>
                            <Mail size={12}/> {user.email}
                        </div>
                        <div className="contact-row">
                            <Phone size={12}/> {user.phone || "—"}
                        </div>
                    </div>
                  </td>

                  {/* Vai trò (Select) */}
                  <td>
                    <div className="role-select-wrapper">
                        {user.role === 'admin' ? <ShieldAlert size={14} className="role-icon admin"/> : <Shield size={14} className="role-icon user"/>}
                        <select
                            value={user.role}
                            onChange={(e) => handleChangeRole(user.id, e.target.value)}
                            className={`role-select ${user.role}`}
                            disabled={user.role === "admin" && user.id === 1} // Chặn sửa Super Admin (ví dụ ID 1)
                        >
                            <option value="admin">Quản trị viên</option>
                            <option value="user">Người dùng</option>
                        </select>
                    </div>
                  </td>

                  {/* Trạng thái */}
                  <td>
                    {user.status === "active" ? (
                        <span className="status-badge success"><CheckCircle size={12}/> Hoạt động</span>
                    ) : (
                        <span className="status-badge danger"><Ban size={12}/> Bị khóa</span>
                    )}
                  </td>

                  {/* Nút hành động */}
                  <td className="action-buttons text-center">
                    <button
                      onClick={() => handleToggleBan(user.id, user.status)}
                      className={`btn-action-pill ${user.status === "active" ? "ban" : "unban"}`}
                      disabled={user.role === "admin"} // Không cho ban Admin khác
                      title={user.status === "active" ? "Khóa tài khoản" : "Mở khóa"}
                    >
                      {user.status === "active" ? <Ban size={14}/> : <CheckCircle size={14}/>}
                      {user.status === "active" ? "Khóa" : "Mở"}
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

export default Users;