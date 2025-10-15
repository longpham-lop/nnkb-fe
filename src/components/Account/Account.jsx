import React from 'react';
import './Account.css';



// Giả sử bạn có một ảnh avatar
import avatar from '../../assets/longavt.png';

const Account = () => {
    
  return (
    <div className="account-page-container">
      {/* Cột menu bên trái */}
      <aside className="account-sidebar">
        <div className="user-profile">
          <img src={avatar} alt="User Avatar" className="user-avatar-small" />
          <div className="user-name">Tuấn Long Phạm</div>
        </div>
        <nav className="account-nav">
          <a href="#">Cài đặt tài khoản</a>
          <a href="#" className="active">Thông tin tài khoản</a>
          <a href="#">Vé của tôi</a>
          <a href="#">Sự kiện của tôi</a>
        </nav>
      </aside>

      {/* Phần nội dung chính bên phải */}
      <main className="account-content">
        
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
          <div className="form-group">
            <label htmlFor="fullName">Họ và tên</label>
            <input type="text" id="fullName" defaultValue="Tuấn Long Phạm" />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Số điện thoại</label>
            <div className="phone-input-group">
              <select className="country-code">
                <option>+84</option>
              </select>
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
              <label>
                <input type="radio" name="gender" value="male" defaultChecked />
                <span>Nam</span>
              </label>
              <label>
                <input type="radio" name="gender" value="female" />
                <span>Nữ</span>
              </label>
              <label>
                <input type="radio" name="gender" value="other" />
                <span>Khác</span>
              </label>
            </div>
          </div>

          <button type="submit" className="save-button">Hoàn thành</button>
        </form>
      </main>
    </div>
  );
};

export default Account;