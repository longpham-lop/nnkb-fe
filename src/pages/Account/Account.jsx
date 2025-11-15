import React, { useState } from 'react';
import './Account.css';
import { Link } from 'react-router-dom';
import emptyTicketIcon from '../../assets/longavt.png';

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

      // Cập nhật localStorage
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



// --- COMPONENT CON CHO GIAO DIỆN "VÉ CỦA TÔI" ---
const MyTickets = () => {
    // Tạo một mảng dữ liệu giả
    const recommendedEvents = [
        {
            id: 1,
            image: 'https://via.placeholder.com/280x160.png?text=Super+Week',
            title: 'SUPER WEEK - ĐẠI LỘ DÂN CHƠI GỌI TÊN...',
            price: 'Từ 899,000₫',
            date: '28 Tháng 11, 2025'
        },
        {
            id: 2,
            image: 'https://via.placeholder.com/280x160.png?text=Garden+Arts',
            title: '[GARDEN ARTS] - ART WORKSHOP "FRUIT...',
            price: 'Từ 400,000₫',
            date: '18 Tháng 10, 2025'
        },
        {
            id: 3,
            image: 'https://via.placeholder.com/280x160.png?text=The+Masked+Singer',
            title: 'THE MASKED SINGER VIETNAM ALL-STAR...',
            price: 'Từ 1,000,000₫',
            date: '16 Tháng 12, 2025'
        },
        {
            id: 4,
            image: 'https://via.placeholder.com/280x160.png?text=Perfume',
            title: 'WORKSHOP NƯỚC HOA SOLID PERFUME...',
            price: 'Từ 449,000₫',
            date: '18 Tháng 10, 2025'
        }
    ];

    return (
        <>
            <h1>Vé của tôi</h1>
            <hr className="divider" />
            <div className="ticket-tabs">
                <button className="tab active">Tất cả</button>
                <button className="tab">Thành công</button>
                <button className="tab">Đang xử lý</button>
                <button className="tab">Đã hủy</button>
            </div>
            <div className="ticket-list-container">
                <div className="ticket-status-section">
                    <h2>Sắp diễn ra</h2>
                    <div className="empty-tickets">
                        <img src={emptyTicketIcon} alt="Empty tickets"/>
                        <p>Bạn chưa có vé nào</p>
                        <button className="buy-now-btn">Mua vé ngay</button>
                    </div>
                </div>
                <div className="ticket-status-section">
                    <h2>Đã kết thúc</h2>
                </div>
            </div>

            {/* PHẦN MỚI ĐƯỢC THÊM VÀO */}
            <div className="recommendations">
                <h3>Có thể bạn quan tâm</h3>
                <div className="recommendation-grid">
                    {recommendedEvents.map(event => (
                        <div key={event.id} className="reco-card">
                            <img src={event.image} alt={event.title} />
                            <h4>{event.title}</h4>
                            <p className="reco-price">{event.price}</p>
                            <p className="reco-date">{event.date}</p>
                        </div>
                    ))}
                </div>
                <div className="see-more-container">
                 
                    <Link to="/home" className="see-more-btn">Xem thêm sự kiện</Link>
                </div>
            </div>
           
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
                        className={`nav-item ${activeView === 'tickets' ? 'active' : ''}`}
                        onClick={() => setActiveView('tickets')}
                    >
                        Vé của tôi
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