import React, { useState, useEffect } from "react";
import "./Events.css"; 
import { getAllUsers, updateUser } from "../../api/auth";

const Users = () => {
  const [users, setUsers] = useState([]);

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
    try {
      const newStatus = currentStatus === "active" ? "locked" : "active";

      await updateUser(userId, { status: newStatus });

      setUsers(users.map(u => 
        u.id === userId ? { ...u, status: newStatus } : u
      ));
    } catch (err) {
      console.error("Lỗi ban/unban user:", err);
    }
  };


  const handleChangeRole = async (userId, newRole) => {
    try {
      await updateUser(userId, { role: newRole });

      setUsers(users.map(u =>
        u.id === userId ? { ...u, role: newRole } : u
      ));
    } catch (err) {
      console.error("Lỗi đổi vai trò:", err);
    }
  };

  return (
    <div className="admin-page-content">
      <div className="page-header">
        <h2>Quản lý Người dùng</h2>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Tên người dùng</th>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Vai trò</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone || "—"}</td>

              {/* Vai trò */}
              <td>
                <select
                  value={user.role}
                  onChange={(e) => handleChangeRole(user.id, e.target.value)}
                  disabled={user.role === "admin"}  
                >
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </td>

              {/* Trạng thái */}
              <td>
                {user.status === "active" ? "Hoạt động" : "Bị khóa"}
              </td>

              {/* Nút hành động */}
              <td className="action-buttons">
                <button
                  onClick={() => handleToggleBan(user.id, user.status)}
                  className={`btn ${user.status === "active" ? "btn-danger" : "btn-secondary"}`}
                  disabled={user.role === "admin"}
                >
                  {user.status === "active" ? "Cấm" : "Bỏ cấm"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
};

export default Users;
