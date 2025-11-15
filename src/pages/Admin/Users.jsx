import React, { useState } from "react";
import { Search, Edit2, Trash2 } from "lucide-react";

const initialUsers = [
  { id: 1, name: "Nguyễn Văn A", email: "a@example.com", role: "Admin" },
  { id: 2, name: "Trần Thị B", email: "b@example.com", role: "User" },
  { id: 3, name: "Phạm C", email: "c@example.com", role: "User" },
];

export default function Users() {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="main-header">
        <h1>Quản lý Người dùng</h1>
        <div className="header-actions">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input placeholder="Tìm kiếm người dùng..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Tên</th>
              <th>Email</th>
              <th>Vai trò</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(u => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <button className="btn-edit"><Edit2 size={18}/></button>
                  <button className="btn-delete" onClick={()=>handleDelete(u.id)}><Trash2 size={18}/></button>
                </td>
              </tr>
            ))}
            {filteredUsers.length===0 && <tr><td colSpan="4" className="no-data">Không tìm thấy người dùng nào.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
