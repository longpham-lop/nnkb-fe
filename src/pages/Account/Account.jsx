import React, { useState } from 'react';
import './Account.css';
import { Link } from 'react-router-dom';

// --- COMPONENT CON CHO GIAO DIỆN "THÔNG TIN TÀI KHOẢN" ---
import { uploadImage } from '../../api/upload';
import { updateUser } from '../../api/auth';

const user = JSON.parse(localStorage.getItem("user") || "{}");

const AccountInfo = () => {
  const [avata, setAvata] = useState(user.avata);

  const [formData, setFormData] = useState({
    name: user.name || "",
    phone: user.phone || "",
    dob: user.dob || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };


  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const res = await uploadImage(file);
      const imageUrl = res.data.url;

      setAvata(imageUrl);

      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      userData.avata = imageUrl;
      localStorage.setItem("user", JSON.stringify(userData));

      console.log("Upload thành công:", imageUrl);
    } catch (err) {
      console.error("Upload lỗi:", err);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToUpdate = { ...formData, avata };
      await updateUser(user.id, dataToUpdate);

      const userData = { ...user, ...dataToUpdate };
      localStorage.setItem("user", JSON.stringify(userData));

      alert("Cập nhật thông tin thành công!");
    } catch (err) {
      console.error(err);
      alert("Cập nhật thất bại");
    }
  };

  return (
    <>
      <div className="avatar-wrapper">
        <img src={avata} alt="avatar" className="user-avatar-large" />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>

      <h1>Thông tin tài khoản</h1>
      <hr className="divider" />

      <form className="account-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Họ và tên</label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Số điện thoại</label>
          <input
            type="text"
            id="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="dob">Ngày tháng năm sinh</label>
          <input
            type="date"
            id="dob"
            value={formData.dob}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="save-button">Hoàn thành</button>
      </form>
    </>
  );
};

// --- COMPONENT CHÍNH ---
const Account = () => {

    const [activeView, setActiveView] = useState('info');

    return (
        <div className="account-page-container">
            {/* Cột menu bên trái */}
            <aside className="account-sidebar">
                <div className="user-profile">
                    <img src={user.avata} alt="User Avatar" className="user-avatar-small" />
                    <div className="user-name" value={user.name}>{user.name}</div>
                </div>
                <nav className="account-nav">
                
          
                    <div 
                        className={`nav-item ${activeView === 'info' ? 'active' : ''}`}
                        onClick={() => setActiveView('info')}
                    >
                        Thông tin tài khoản
                    </div>
                    
                    <div 
                        className={`nav-item ${activeView === 'events' ? 'active' : ''}`}
                        onClick={() => setActiveView('events')}
                    >
                        Sự kiện của tôi
                    </div>
                </nav>
            </aside>

        
            <main className="account-content">
                {activeView === 'info' && <AccountInfo />}
                {activeView === 'tickets' && <MyTickets />}
           
            </main>
        </div>
    );
};

export default Account;