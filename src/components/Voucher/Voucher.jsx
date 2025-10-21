import React, { useState } from 'react';
import './Voucher.css';

// --- BẠN CẦN IMPORT LOGO ---
// import logoVictor from '../../assets/victor.png';
// import logoZalopay from '../../assets/zalopay.png';

// Placeholder cho demo
const logoVictor = 'https://via.placeholder.com/40x40?text=VT';
const logoZalopay = 'https://via.placeholder.com/40x40?text=ZLP';


// Dữ liệu voucher giả (bạn sẽ lấy từ API)
const mockVouchers = [
  { 
    id: 'v1', 
    name: 'Giảm 20.000₫', 
    provider: 'VICTOR', 
    logo: logoVictor, 
    minSpend: 800000, 
    expiry: '31/10/2025', 
    discount: 20000 
  },
  { 
    id: 'v2', 
    name: 'Giảm 20.000₫', 
    provider: 'ZaloPay', 
    logo: logoZalopay, 
    minSpend: 800000, 
    expiry: '31/10/2025', 
    discount: 20000 
  },
  { 
    id: 'v3', 
    name: 'Giảm 30.000₫', 
    provider: 'ZaloPay', 
    logo: logoZalopay, 
    minSpend: 1000000, 
    expiry: '31/10/2025', 
    discount: 30000 
  },
];

// Hàm format tiền
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

function VoucherModal({ onClose, onApply, currentOrderTotal }) {
  const [selectedVoucherId, setSelectedVoucherId] = useState(null);

  const handleApply = () => {
    const selectedVoucher = mockVouchers.find(v => v.id === selectedVoucherId);
    if (selectedVoucher) {
      if (currentOrderTotal >= selectedVoucher.minSpend) {
        onApply(selectedVoucher);
      } else {
        alert(`Đơn hàng tối thiểu ${formatCurrency(selectedVoucher.minSpend)} để áp dụng voucher này.`);
      }
    } else {
      onApply(null); // Không chọn gì
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        <div className="modal-header">
          <h3>Chọn tối đa 2 voucher</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="voucher-input-group">
            <input type="text" placeholder="Nhập mã voucher" />
            <button className="apply-code-btn">Áp dụng</button>
          </div>

          <p className="voucher-section-title">Voucher từ Bên tổ chức</p>
          <div className="voucher-list">
            {mockVouchers.map((voucher) => {
              const isDisabled = currentOrderTotal < voucher.minSpend;
              return (
                <label className={`voucher-item ${isDisabled ? 'disabled' : ''}`} key={voucher.id}>
                  <div className="voucher-logo">
                    <img src={voucher.logo} alt={voucher.provider} />
                  </div>
                  <div className="voucher-info">
                    <h4>{voucher.name}</h4>
                    <p>Đơn tối thiểu {formatCurrency(voucher.minSpend)}</p>
                    <p className="voucher-expiry">HSD: {voucher.expiry}</p>
                  </div>
                  <div className="voucher-radio">
                    <input 
                      type="radio" 
                      name="voucher" 
                      value={voucher.id}
                      checked={selectedVoucherId === voucher.id}
                      onChange={(e) => setSelectedVoucherId(e.target.value)}
                      disabled={isDisabled}
                    />
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Hủy bỏ</button>
          <button className="btn-confirm" onClick={handleApply}>Xong</button>
        </div>
      </div>
    </div>
  );
}

export default VoucherModal;
