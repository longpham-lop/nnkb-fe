import React, {useState} from 'react';
import './TicketDetail.css';
import { Link } from 'react-router-dom';
// Import ảnh (thay thế bằng ảnh thật của bạn)
import eventPoster from '../../assets/banner1.png';
import ticketGa from '../../assets/banner2.png';
import ticketFanZone from '../../assets/banner3.png';
import Vpbank from '../../assets/vpbank.png';
import Banner1 from '../../assets/banner1.png';

const TicketDetail = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isTicketSectionExpanded, setIsTicketSectionExpanded] = useState(true);
    // Dữ liệu vé giả để render
    const tickets = [
        { id: 1, type: 'GA', name: 'Gói Dậy Sớm + GA 1', desc: 'Full Day Access + GA 1', price: '499.000₫', image: ticketGa },
        { id: 2, type: 'GA', name: 'Gói Dậy Sớm + GA 2', desc: 'Full Day Access + GA 2', price: '699.000₫', image: ticketGa },
        { id: 3, type: 'FanZone', name: 'Gói Dậy Sớm + FanZone 1', desc: 'Full Day Access + FanZone 1', price: '799.000₫', image: ticketFanZone },
        { id: 4, type: 'GA', name: 'Gói Dậy Sớm + GA 2', desc: 'Full Day Access + GA 2', price: '699.000₫', image: ticketGa },
        { id: 5, type: 'FanZone', name: 'Gói Dậy Sớm + FanZone 2', desc: 'Full Day Access + FanZone 2', price: '999.000₫', image: ticketFanZone }
    ];

    return (
        <div className="ticket-detail-container">
            {/* THAY THẾ KHỐI <main> CŨ BẰNG KHỐI MỚI NÀY */}
            <main className="main-detail-content">
                {/* PHẦN NỀN ĐEN (Phía trên) */}
                <section className="event-top-half">
                    <div className="breadcrumbs">
                        Trang chủ &gt; Nhạc sống &gt; GS25 MUSIC FESTIVAL 2025
                    </div>
                    <div className="event-main-header">
                        <div className="event-info">
                            <h1>GS25 MUSIC FESTIVAL 2025</h1>
                            <p className="event-time">🕒 15:00 - 22:00 | 23 Tháng 11, 2025</p>
                            <p className="event-location">📍 Đường Nguyễn Thiện Thành, Phường Thủ Thiêm, Quận 2, Thành phố Hồ Chí Minh</p>
                            <div className="price-box">
                                <span>Giá từ</span>
                                <p>499.000 ₫</p>
                            </div>
                        </div>
                        <div className="event-poster">
                            <img src={eventPoster} alt="Event Poster" />
                        </div>
                    </div>
                </section>

                {/* PHẦN NỀN TRẮNG (Phía dưới) */}
                <section className="event-bottom-half">
                    <section className="event-description">
                        <h3>Giới thiệu</h3>
                        {/* Thay thế bằng ảnh banner mô tả của bạn */}
                        <img 
                            src={Banner1}
                            alt="Event description banner" 
                            className="description-banner"
                        />
                        
                        {/* Thêm class 'collapsed' khi state là false */}
                        <div className={`description-content ${!isExpanded ? 'collapsed' : ''}`}>
                            <div class ="description-text">
                            <p>GS25 MUSIC FESTIVAL 2025 là một sự kiện âm nhạc đỉnh cao, quy tụ dàn nghệ sĩ hàng đầu trong nước và quốc tế. Với sân khấu hoành tráng, âm thanh ánh sáng hiện đại, sự kiện hứa hẹn mang đến những giây phút bùng nổ và trải nghiệm âm nhạc không thể nào quên.</p>
                            <p>Đến với GS25 MUSIC FESTIVAL, bạn không chỉ được thưởng thức âm nhạc mà còn được tham gia vào các hoạt động bên lề hấp dẫn, các gian hàng ẩm thực đa dạng và cơ hội giao lưu cùng thần tượng. Đây là sự kiện không thể bỏ lỡ trong năm 2025!</p>
                            <p>Sự kiện được tổ chức tại một trong những địa điểm đẹp nhất thành phố, đảm bảo không gian rộng rãi và an toàn cho hàng chục ngàn khán giả. Hãy chuẩn bị sẵn sàng để "cháy" hết mình cùng chúng tôi!</p>
                             </div>
                        </div>
                        
                        {/* Nút bấm thay đổi state, icon mũi tên sẽ xoay 180 độ */}
                        <button 
                            className="toggle-expand-btn" 
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            {isExpanded ? 'Thu gọn' : 'Xem thêm'}
                            <span 
                                className="arrow-icon"
                                style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                            >
                                ▼
                            </span>
                        </button>
                    </section>
                    <div className="ticket-selection-section">
                        {/* Thay đổi cấu trúc header của vé */}
                        <div className="ticket-list-header">
                            <div 
                                className="ticket-header-left" 
                                onClick={() => setIsTicketSectionExpanded(!isTicketSectionExpanded)}
                            >
                                <div className="info-block">
                                    <h4>Thông tin vé</h4>
                                    <p>15:00 - 22:00 | 23 Tháng 11, 2025</p>
                                </div>
                                <span 
                                    className="arrow-icon"
                                    style={{ transform: isTicketSectionExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                                >
                                    ▼
                                </span>
                            </div>
                            <button className="buy-ticket-now-btn">Mua vé ngay</button>
                        </div>
                        
                        {/* Thêm class 'collapsed' vào danh sách vé */}
                        <div className={`ticket-list ${!isTicketSectionExpanded ? 'collapsed' : ''}`}>
                            {tickets.map(ticket => (
                                <div key={ticket.id} className="ticket-item">
                                    <img src={ticket.image} alt={`${ticket.type} ticket`} className="ticket-type-img" />
                                    <div className="ticket-details">
                                        <h4>{ticket.name}</h4>
                                        <p>{ticket.desc}</p>
                                    </div>
                                    <div className="ticket-price">{ticket.price}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <section className="event-organizer">
                        <h3>Ban tổ chức</h3>
                        <hr className="faint-divider" /> {/* Thêm đường kẻ mờ */}
                        {/* Thay bằng ảnh banner của ban tổ chức */}
                        <div className="organizer-content">
                            <div class ="description-text">
                            <p><strong>CÔNG TY TNHH TOPTICKET</strong></p>
                            <p>Topticket là nền tảng phân phối vé sự kiện hàng đầu Việt Nam, mang đến giải pháp toàn diện cho cả nhà tổ chức và người tham dự. Chúng tôi cam kết mang lại trải nghiệm mua vé dễ dàng, an toàn và tiện lợi.</p>
                            <p>Với sự kiện GS25 MUSIC FESTIVAL, chúng tôi tự hào là đối tác đồng hành, góp phần tạo nên một lễ hội âm nhạc thành công và đáng nhớ.</p>
                        </div>
                        </div>
                    </section>

                     <div className="recommendations">
                <h3>Có thể bạn quan tâm</h3>
                <div className="recommendation-grid">
                    {tickets.map(event => (
                        <div key={event.id} className="reco-card">
                            <img src={event.image} alt={event.title} />
                            <h4>{event.title}</h4>
                            <p className="reco-price">{event.price}</p>
                            <p className="reco-date">{event.date}</p>
                        </div>
                    ))}
                </div>
                <div className="see-more-container">
                    {/* Sử dụng component <Link> để điều hướng */}
                    <Link to="/home" className="see-more-btn">Xem thêm sự kiện</Link>
                </div>
            </div>
                    {/* --- KẾT THÚC PHẦN BAN TỔ CHỨC --- */}
                </section>
            </main>
            
            {/* Cột quảng cáo bên phải */}
            <aside className="sidebar-ads">
                <div className="ad-card">
                    <h4>VÉ RẺ BẤT NGỜ</h4>
                    <img src={Vpbank} alt="Ad"/>
                </div>
            </aside>
        </div>


    );
};

export default TicketDetail;