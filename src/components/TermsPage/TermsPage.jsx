import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TermsPage.css'; // Chúng ta sẽ dùng file CSS mới bên dưới


function PageHeader() {}

// --- Component chính của trang ---
function TermsPage() {
  const navigate = useNavigate();
 
  const [activeTab, setActiveTab] = useState('terms');

  const renderContent = () => {
    switch (activeTab) {
      case 'terms':
        return (
          <section>
            <h1>Điều khoản sử dụng</h1>
            <p className="last-updated">Cập nhật lần cuối: 21/10/2025</p>

            <h2>Điều 1: Giới thiệu</h2>
            <p>
              Chào mừng bạn đến với TOPTICKET. Bằng cách truy cập hoặc sử dụng trang web
              này, bạn đồng ý tuân thủ và bị ràng buộc bởi các điều khoản và điều 
              kiện sử dụng sau đây. Vui lòng đọc kỹ các điều khoản này.
            </p>
            <h2>Điều 2: Tài khoản người dùng</h2>
            <p>
              Bạn chịu trách nhiệm duy trì tính bảo mật của tài khoản và mật khẩu 
              của mình và bạn đồng ý chấp nhận trách nhiệm cho tất cả các hoạt động
              xảy ra dưới tài khoản hoặc mật khẩu của bạn.
            </p>
            {/* Thêm nội dung... */}
          </section>
        );
      case 'privacy':
        return (
          <section>
            <h1>Chính sách bảo mật</h1>
            <p className="last-updated">Cập nhật lần cuối: 21/10/2025</p>

            <h2>1. Thu thập thông tin</h2>
            <p>
              Chúng tôi thu thập thông tin cá nhân của bạn khi bạn đăng ký tài 
              khoản, mua vé, hoặc liên hệ với chúng tôi. Thông tin này bao gồm 
              tên, email, số điện thoại, và địa chỉ.
            </p>
            <h2>2. Sử dụng thông tin</h2>
            <p>
              Thông tin của bạn được sử dụng để xử lý đơn hàng, cung cấp hỗ trợ
              khách hàng, và gửi các thông báo quan trọng về sự kiện hoặc tài 
              khoản của bạn.
            </p>
          </section>
        );
      case 'about':
        return (
          <section>
            <h1>Giới thiệu TOPTICKET</h1>
            <p className="last-updated">Cập nhật lần cuối: 21/10/2025</p>

            <h2>Sứ mệnh của chúng tôi</h2>
            <p>
              TOPTICKET là nền tảng phân phối vé sự kiện hàng đầu Việt Nam, 
              mang đến giải pháp toàn diện cho cả nhà tổ chức và người tham dự. 
              Chúng tôi cam kết mang lại trải nghiệm mua vé dễ dàng, an toàn và 
              tiện lợi.
            </p>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="terms-page-wrapper">
      <PageHeader />
      
      <div className="terms-container-layout">
        
        {/* === Sidebar Điều Hướng === */}
        <aside className="terms-sidebar">
          <button className="back-btn-terms" onClick={() => navigate(-1)}>
            ← Quay lại
          </button>
          
          <nav className="terms-nav">
            <h4>Về TOPTICKET</h4>
            <a
              className={activeTab === 'about' ? 'active' : ''}
              onClick={() => setActiveTab('about')}
            >
              Giới thiệu
            </a>
            <a
              className={activeTab === 'terms' ? 'active' : ''}
              onClick={() => setActiveTab('terms')}
            >
              Điều khoản sử dụng
            </a>
            <a
              className={activeTab === 'privacy' ? 'active' : ''}
              onClick={() => setActiveTab('privacy')}
            >
              Chính sách bảo mật
            </a>
            {/* Thêm các link khác tại đây */}
          </nav>
        </aside>

       
        <main className="terms-main-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default TermsPage;