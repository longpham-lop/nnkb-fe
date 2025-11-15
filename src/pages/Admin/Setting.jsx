import React, { useState } from 'react';
import './Setting.css'; 

const Setting = () => {
  const [settings, setSettings] = useState({
    siteName: 'Trang web Bán vé Sự kiện',
    maintenanceMode: false,
    defaultCurrency: 'VND',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic lưu cài đặt (gọi API)
    console.log('Đã lưu cài đặt:', settings);
    alert('Đã lưu cài đặt thành công!');
  };

  return (
    <div className="admin-page-content">
      <h2>Cài đặt chung</h2>
      
      <form onSubmit={handleSubmit} className="settings-form">
        <div className="form-group">
          <label htmlFor="siteName">Tên trang web</label>
          <input
            type="text"
            id="siteName"
            name="siteName"
            value={settings.siteName}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="defaultCurrency">Tiền tệ mặc định</label>
          <select
            id="defaultCurrency"
            name="defaultCurrency"
            value={settings.defaultCurrency}
            onChange={handleChange}
          >
            <option value="VND">VND</option>
            <option value="USD">USD</option>
          </select>
        </div>
        
        <div className="form-group form-group-checkbox">
          <label htmlFor="maintenanceMode">Chế độ bảo trì</label>
          <input
            type="checkbox"
            id="maintenanceMode"
            name="maintenanceMode"
            checked={settings.maintenanceMode}
            onChange={handleChange}
          />
          <span className='checkbox-label'>Bật chế độ bảo trì (chỉ admin có thể truy cập)</span>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Lưu thay đổi
          </button>
        </div>
      </form>
    </div>
  );
};

export default Setting;