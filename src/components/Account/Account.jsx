import React, { useState } from 'react';
import './Account.css';
import { Link } from 'react-router-dom';


import avatar from '../../assets/longavt.png';
import emptyTicketIcon from '../../assets/longavt.png';

// --- COMPONENT CON CHO GIAO DIỆN "THÔNG TIN TÀI KHOẢN" ---
const AccountInfo = () => (
  <>
    <h1>Thông tin tài khoản</h1>
    <hr className="divider" />

    <div className="profile-picture-section">
      <div className="avatar-large-wrapper">
        <img src={avatar} alt="User Avatar" className="user-avatar-large" />
        <div className="edit-icon">✎</div>
      </div>
      <p>Cung cấp thông tin chính xác sẽ hỗ trợ trong quá trình mua vé, hoặc khi cần xác thực vé.</p>
    </div>

    <form className="account-form">
        {/* Giữ nguyên form của bạn ở đây */}
        <div className="form-group">
            <label htmlFor="fullName">Họ và tên</label>
            <input type="text" id="fullName" defaultValue="Tuấn Long Phạm" />
        </div>
        <div className="form-group">
            <label htmlFor="phone">Số điện thoại</label>
            <div className="phone-input-group">
                <select className="country-code"><option>+84</option></select>
                <input type="text" id="phone" defaultValue="355442523" />
                <button type="button" className="clear-btn">×</button>
            </div>
        </div>
        <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-with-icon">
                <input type="email" id="email" defaultValue="tuanlongp070@gmail.com" readOnly />
                <span className="verified-icon">✓</span>
            </div>
        </div>
        <div className="form-group">
            <label htmlFor="dob">Ngày tháng năm sinh</label>
            <input type="text" id="dob" defaultValue="19/12/2004" />
        </div>
        <div className="form-group">
            <label>Giới tính</label>
            <div className="gender-options">
                <label><input type="radio" name="gender" value="male" defaultChecked /><span>Nam</span></label>
                <label><input type="radio" name="gender" value="female" /><span>Nữ</span></label>
                <label><input type="radio" name="gender" value="other" /><span>Khác</span></label>
            </div>
        </div>
        <button type="submit" className="save-button">Hoàn thành</button>
    </form>
  </>
);


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

    const [activeView, setActiveView] = useState('tickets');

    return (
        <div className="account-page-container">
            {/* Cột menu bên trái */}
            <aside className="account-sidebar">
                <div className="user-profile">
                    <img src={avatar} alt="User Avatar" className="user-avatar-small" />
                    <div className="user-name">Tuấn Long Phạm</div>
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