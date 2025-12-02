import React, { useState, useEffect } from 'react';
import './Account.css';
import { uploadImage } from '../../api/upload';
import { updateUser ,ref,chang} from '../../api/auth';
import { FaCamera, FaEye, FaEyeSlash, FaUser, FaLock, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';

// --- COMPONENT CON: THÔNG TIN TÀI KHOẢN ---
const AccountInfo = ({ userData, refreshUser }) => {
  const [avata, setAvata] = useState(userData.avata || "https://via.placeholder.com/150");
  
 
  const [formData, setFormData] = useState({
    name: userData.name || "",
    phone: userData.phone || "",
    dob: userData.dob || "",
    countryside: userData.countryside || "", 
  });

  const [passData, setPassData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [showPass, setShowPass] = useState({
    current: false,
    new: false,
    confirm: false
  });

  useEffect(() => {
    setAvata(userData.avata);
    setFormData({
      name: userData.name || "",
      phone: userData.phone || "",
      dob: userData.dob || "",
      countryside: userData.countryside || ""
    });
  }, [userData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handlePassChange = (e) => {
    setPassData({ ...passData, [e.target.id]: e.target.value });
  };

  const toggleShowPass = (field) => {
    setShowPass({ ...showPass, [field]: !showPass[field] });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const res = await uploadImage(file);
      const imageUrl = res.data.url;
      setAvata(imageUrl);
      
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      currentUser.avata = imageUrl;
      localStorage.setItem("user", JSON.stringify(currentUser));
      refreshUser();
    } catch (err) {
      console.error("Upload lỗi:", err);
      alert("Lỗi upload ảnh!");
    }
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        // 1 — Update thông tin chung
        const updateInfo = {
          name: formData.name,
          phone: formData.phone,
          countryside: formData.countryside,
          avatar_url :avata
        };

        await ref(updateInfo);

        // 2 — Nếu có nhập mật khẩu → gọi API đổi mật khẩu
        if (passData.newPassword || passData.currentPassword) {

            if (!passData.currentPassword) {
                alert("Vui lòng nhập mật khẩu hiện tại!");
                return;
            }

            if (passData.newPassword !== passData.confirmPassword) {
                alert("Mật khẩu mới không khớp!");
                return;
            }

            await chang({
                old_password: passData.currentPassword,
                new_password: passData.newPassword
            });

            // Reset mật khẩu UI
            setPassData({
              currentPassword: "",
              newPassword: "",
              confirmPassword: ""
            });
        }

        // Lưu localStorage
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        const newUser = { ...currentUser, ...updateInfo };

        localStorage.setItem("user", JSON.stringify(newUser));
        refreshUser();

        alert("Cập nhật thành công!");

    } catch (err) {
        console.error(err);
        alert("Lỗi khi cập nhật. Vui lòng kiểm tra thông tin.");
    }
  };

  return (
    <div className="account-info-wrapper">
      <div className="info-header">
        <h2>Hồ sơ của tôi</h2>
        <p>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
      </div>

      <form className="info-body-layout" onSubmit={handleSubmit}>
        <div className="info-inputs">
            <h3 className="section-title">Thông tin chung</h3>
            <div className="form-group">
                <label htmlFor="name">Họ và tên</label>
                <input type="text" id="name" className="form-control" value={formData.name} onChange={handleChange} />
            </div>

            <div className="form-row">
                <div className="form-group half">
                    <label htmlFor="phone">Số điện thoại</label>
                    <input type="text" id="phone" className="form-control" value={formData.phone} onChange={handleChange} />
                </div>
                <div className="form-group half">
                    <label htmlFor="dob">Ngày sinh</label>
                    <input type="date" id="dob" className="form-control" value={formData.dob} onChange={handleChange} />
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="countryside">Quê quán / Địa chỉ</label>
                <div className="input-with-icon">
                    <FaMapMarkerAlt className="input-icon-left" />
                    <input 
                        type="text" 
                        id="countryside" 
                        className="form-control pl-40" 
                        value={formData.countryside} 
                        onChange={handleChange} 
                        placeholder="Ví dụ: Hoàn Kiếm, Hà Nội"
                    />
                </div>
            </div>

            <hr className="divider" />

            {/* PHẦN 2: BẢO MẬT / ĐỔI MẬT KHẨU */}
            <h3 className="section-title">Bảo mật & Đổi mật khẩu</h3>
            <div className="password-section">
                <div className="form-group">
                    <label htmlFor="currentPassword">Mật khẩu hiện tại</label>
                    <div className="password-wrapper">
                        <input 
                            type={showPass.current ? "text" : "password"} 
                            id="currentPassword" 
                            className="form-control" 
                            value={passData.currentPassword} 
                            onChange={handlePassChange}
                            placeholder="Nhập mật khẩu cũ nếu muốn đổi mới"
                        />
                        <span className="eye-icon" onClick={() => toggleShowPass('current')}>
                            {showPass.current ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group half">
                        <label htmlFor="newPassword">Mật khẩu mới</label>
                        <div className="password-wrapper">
                            <input 
                                type={showPass.new ? "text" : "password"} 
                                id="newPassword" 
                                className="form-control" 
                                value={passData.newPassword} 
                                onChange={handlePassChange}
                            />
                            <span className="eye-icon" onClick={() => toggleShowPass('new')}>
                                {showPass.new ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                    </div>
                    <div className="form-group half">
                        <label htmlFor="confirmPassword">Nhập lại mật khẩu</label>
                        <div className="password-wrapper">
                            <input 
                                type={showPass.confirm ? "text" : "password"} 
                                id="confirmPassword" 
                                className="form-control" 
                                value={passData.confirmPassword} 
                                onChange={handlePassChange}
                            />
                            <span className="eye-icon" onClick={() => toggleShowPass('confirm')}>
                                {showPass.confirm ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <button type="submit" className="save-btn">Lưu thay đổi</button>
        </div>

        {/* CỘT PHẢI: AVATAR */}
        <div className="info-avatar">
            <div className="avatar-preview">
                <img src={avata} alt="Avatar" />
                <label htmlFor="file-upload" className="upload-trigger">
                    <FaCamera />
                </label>
                <input id="file-upload" type="file" accept="image/*" onChange={handleFileChange} hidden />
            </div>
            <div className="avatar-desc">
                <p>Dụng lượng file tối đa 1 MB</p>
                <p>Định dạng: .JPEG, .PNG</p>
            </div>
        </div>

      </form>
    </div>
  );
};

// --- COMPONENT CHÍNH ---
const Account = () => {
    const [activeView, setActiveView] = useState('info');
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "{}"));

    const refreshUser = () => setUser(JSON.parse(localStorage.getItem("user") || "{}"));

    return (
        <div className="account-page">
            <div className="container">
                <aside className="sidebar">
                    <div className="profile-summary">
                        <img src={user.avata || "https://via.placeholder.com/150"} alt="User" />
                        <div>
                            <strong>{user.name || "Thành viên"}</strong>
                            <p>Sửa hồ sơ</p>
                        </div>
                    </div>
                    <nav className="menu">
                        <button className={activeView === 'info' ? 'active' : ''} onClick={() => setActiveView('info')}>
                            <FaUser /> Tài khoản của tôi
                        </button>
                        <button className={activeView === 'events' ? 'active' : ''} onClick={() => setActiveView('events')}>
                            <FaCalendarAlt /> Sự kiện của tôi
                        </button>
                    </nav>
                </aside>

                <main className="main-content">
                    {activeView === 'info' && <AccountInfo userData={user} refreshUser={refreshUser} />}
                    {activeView === 'events' && <div className="placeholder"><h2>Sự kiện của tôi</h2><p>Chức năng đang cập nhật...</p></div>}
                </main>
            </div>
        </div>
    );
};

export default Account;