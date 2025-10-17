import React from 'react';
import './TicketDetail.css';

// Import ảnh (thay thế bằng ảnh thật của bạn)
import eventPoster from '../../assets/banner1.png';
import ticketGa from '../../assets/banner2.png';
import ticketFanZone from '../../assets/banner3.png';
import Vpbank from '../../assets/vpbank.png';

const TicketDetail = () => {
    // Dữ liệu vé giả để render
    const tickets = [
        { id: 1, type: 'GA', name: 'Gói Dậy Sớm + GA 1', desc: 'Full Day Access + GA 1', price: '499.000₫', image: ticketGa },
        { id: 2, type: 'GA', name: 'Gói Dậy Sớm + GA 2', desc: 'Full Day Access + GA 2', price: '699.000₫', image: ticketGa },
        { id: 3, type: 'FanZone', name: 'Gói Dậy Sớm + FanZone 1', desc: 'Full Day Access + FanZone 1', price: '799.000₫', image: ticketFanZone },
        { id: 4, type: 'FanZone', name: 'Gói Dậy Sớm + FanZone 2', desc: 'Full Day Access + FanZone 2', price: '999.000₫', image: ticketFanZone }
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
                    <div className="ticket-selection-section">
                        <div className="ticket-list-header">
                            <div className="info-block">
                                <h4>Thông tin vé</h4>
                                <p>15:00 - 22:00 | 23 Tháng 11, 2025</p>
                            </div>
                            <button className="buy-ticket-now-btn">Mua vé ngay</button>
                        </div>
                        <div className="ticket-list">
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