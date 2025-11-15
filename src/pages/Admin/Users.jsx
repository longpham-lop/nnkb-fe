import React, { useState, useEffect } from 'react';
// Tái sử dụng CSS của Events.css vì layout tương tự (bảng, header)
import './Events.css'; 

// Dữ liệu giả lập
const mockUsers = [
  { id: 1, name: 'Alice', email: 'alice@example.com', role: 'Admin', status: 'Hoạt động' },
  { id: 2, name: 'Bob', email: 'bob@example.com', role: 'User', status: 'Hoạt động' },
  { id: 3, name: 'Charlie', email: 'charlie@example.com', role: 'User', status: 'Bị cấm' },
];

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Thay thế bằng API call thật
    setUsers(mockUsers);
  }, []);

  const handleToggleBan = (userId) => {
    // Logic cấm/bỏ cấm người dùng
    setUsers(users.map(user => {
      if (user.id === userId) {
        return { ...user, status: user.status === 'Hoạt động' ? 'Bị cấm' : 'Hoạt động' };
      }
      return user;
    }));
    console.log('Toggle ban cho user:', userId);
  };

  const handleChangeRole = (userId, newRole) => {
    // Logic đổi vai trò
    setUsers(users.map(user => (user.id === userId ? { ...user, role: newRole } : user)));
    console.log(`Đổi vai trò user ${userId} thành ${newRole}`);
  };


  return (
    <div className="admin-page-content">
      <div className="page-header">
        <h2>Quản lý Người dùng</h2>
        {/* Có thể thêm nút "Thêm User" nếu admin có quyền */}
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Tên người dùng</th>
            <th>Email</th>
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
              <td>
                <select 
                  value={user.role} 
                  onChange={(e) => handleChangeRole(user.id, e.target.value)}
                  disabled={user.role === 'Admin'} // Không cho đổi vai trò Admin
                >
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
                </select>
              </td>
              <td>{user.status}</td>
              <td className="action-buttons">
                <button 
                  onClick={() => handleToggleBan(user.id)} 
                  className={`btn ${user.status === 'Hoạt động' ? 'btn-danger' : 'btn-secondary'}`}
                  disabled={user.role === 'Admin'} // Không cho cấm Admin
                >
                  {user.status === 'Hoạt động' ? 'Cấm' : 'Bỏ cấm'}
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