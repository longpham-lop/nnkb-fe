import React, { useState } from 'react';
import './Filter.css';
import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';

// --- COMPONENT DROPDOWN CHỌN NGÀY ---
const CalendarMonth = ({ year, month, selectedDates, onDateClick }) => {
    const monthNames = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    
    const generateDays = () => {
        const days = [];
        const date = new Date(year, month, 1);
        
       
        const firstDayOfWeek = (date.getDay() === 0) ? 6 : date.getDay() - 1;
        
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();

        for (let i = 0; i < firstDayOfWeek; i++) {
            days.push(
                <span key={`prev-${i}`} className="day-cell muted">
                    {daysInPrevMonth - firstDayOfWeek + 1 + i}
                </span>
            );
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const fullDate = new Date(year, month, i);
            const time = fullDate.getTime();

            const isToday = time === today.getTime();
            // Kiểm tra xem ngày có trong mảng selectedDates không
            const isSelected = selectedDates.includes(time);

            days.push(
                <span 
                    key={`current-${i}`} 
                    className={`day-cell ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                    onClick={() => onDateClick(fullDate)}
                >
                    {i}
                </span>
            );
        }

        // 3. Lấy các ngày của tháng sau (màu mờ)
        const totalCells = days.length;
        const remainingCells = totalCells > 35 ? 42 - totalCells : 35 - totalCells; 
        
        for (let i = 1; i <= remainingCells; i++) {
            days.push(
                <span key={`next-${i}`} className="day-cell muted">
                    {i}
                </span>
            );
        }
        return days;
    };

    return (
        <div className="calendar-month">
            <div className="calendar-header">{`${monthNames[month]}, ${year}`}</div>
            <div className="calendar-grid days">
                <span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span>CN</span>
            </div>
            <div className="calendar-grid">
                {generateDays()}
            </div>
        </div>
    );
};


// --- COMPONENT DROPDOWN CHỌN NGÀY  ---
const DatePickerDropdown = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState('all');
    
    // Bắt đầu với tháng/năm hiện tại
    const [displayDate, setDisplayDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));

    // State cho các ngày được chọn (bắt đầu rỗng)
    const [selectedDates, setSelectedDates] = useState([]);

    // HÀM QUAN TRỌNG: Xử lý khi click vào một ngày
    const handleDateClick = (date) => {
        const time = date.getTime();
        // Kiểm tra xem ngày đã được chọn chưa
        if (selectedDates.includes(time)) {
            // Nếu đã chọn -> Lọc ra (bỏ chọn)
            setSelectedDates(dates => dates.filter(d => d !== time));
        } else {
            // Nếu chưa chọn -> Thêm vào (chọn)
            setSelectedDates(dates => [...dates, time]);
        }
    };

    // Hàm chuyển tháng
    const goToPrevMonth = () => {
        setDisplayDate(current => new Date(current.getFullYear(), current.getMonth() - 1, 1));
    };
    const goToNextMonth = () => {
        setDisplayDate(current => new Date(current.getFullYear(), current.getMonth() + 1, 1));
    };

    // Tính toán ngày cho lịch bên phải
    const rightCalendarDate = new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 1);

    return (
        <div className="date-picker-dropdown">
            {/* Thanh Tabs */}
            <div className="date-tabs">
                <button 
                    className={`date-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveTab('all')}
                >
                    Tất cả các ngày
                </button>
                <button 
                    className={`date-tab-btn ${activeTab === 'today' ? 'active' : ''}`}
                    onClick={() => setActiveTab('today')}
                >
                    Hôm nay
                </button>
                <button 
                    className={`date-tab-btn ${activeTab === 'tomorrow' ? 'active' : ''}`}
                    onClick={() => setActiveTab('tomorrow')}
                >
                    Ngày mai
                </button>
                <button 
                    className={`date-tab-btn ${activeTab === 'weekend' ? 'active' : ''}`}
                    onClick={() => setActiveTab('weekend')}
                >
                    Cuối tuần này
                </button>
                <button 
                    className={`date-tab-btn ${activeTab === 'month' ? 'active' : ''}`}
                    onClick={() => setActiveTab('month')}
                >
                    Tháng này
                </button>
            </div>
            
            {/* Nội dung lịch */}
            <div className="date-picker-content">
                {/* Nút điều hướng TRÁI */}
                <button onClick={goToPrevMonth} className="calendar-nav-btn prev">‹</button>
                
                {/* Lịch bên trái */}
                <CalendarMonth 
                    year={displayDate.getFullYear()} 
                    month={displayDate.getMonth()}
                    selectedDates={selectedDates}
                    onDateClick={handleDateClick}
                />
                
                {/* Lịch bên phải */}
                <CalendarMonth 
                    year={rightCalendarDate.getFullYear()} 
                    month={rightCalendarDate.getMonth()}
                    selectedDates={selectedDates}
                    onDateClick={handleDateClick}
                />
                
                {/* Nút điều hướng PHẢI */}
                <button onClick={goToNextMonth} className="calendar-nav-btn next">›</button>
            </div>
            
            {/* Footer */}
            <div className="dropdown-footer">
                <button className="reset-btn" onClick={() => setSelectedDates([])}>Thiết lập lại</button>
                <button className="apply-btn" onClick={onClose}>Áp dụng</button>
            </div>
        </div>
    );
};

// --- COMPONENT DROPDOWN BỘ LỌC CHÍNH ---
const MainFilterDropdown = ({ onClose, activeCategory, setActiveCategory }) => {
    
    const categories = [
        { id: 'music', name: 'Nhạc sống' },
        { id: 'art', name: 'Sân khấu & Nghệ thuật' },
        { id: 'sport', name: 'Thể thao' },
        { id: 'other', name: 'Khác' }
    ];

    const handleReset = () => {
        setActiveCategory(null);
    };

    return (
        <div className="main-filter-dropdown">
            {/* Vị trí */}
            <div className="filter-section">
                <h4>Vị trí</h4>
                <div className="radio-group">
                    {/* ... (Giữ nguyên các radio buttons cho Vị trí) ... */}
                    <label>
                        <input type="radio" name="location" value="all" defaultChecked />
                        <span>Toàn quốc</span>
                    </label>
                    <label>
                        <input type="radio" name="location" value="hcm" />
                        <span>TP.Hồ Chí Minh</span>
                    </label>
                     <label>
                        <input type="radio" name="location" value="hn" />
                        <span>Hà Nội</span>
                    </label>
                     <label>
                        <input type="radio" name="location" value="dn" />
                        <span>Đà Nẵng</span>
                    </label>
                     <label>
                        <input type="radio" name="location" value="dl" />
                        <span>Đà Lạt</span>
                    </label>
                     <label>
                        <input type="radio" name="location" value="k" />
                        <span>Khác</span>
                    </label>
                    
                </div>
            </div>
            {/* Giá bán */}
            <div className="filter-section">
                <h4>Giá bán</h4>
                <div className="toggle-switch">
                    <label>Miễn phí</label>
                    <label className="switch">
                        <input type="checkbox" />
                        <span className="slider round"></span>
                    </label>
                </div>
            </div>
            
            {/* Thể loại (CẬP NHẬT STYLE) */}
            <div className="filter-section">
                <h4>Thể loại</h4>
                {/* Thay thế .category-tags bằng style mới */}
                <div className="category-text-buttons">
                    {categories.map(cat => (
                        <button 
                            key={cat.id}
                            className={`category-text-btn ${activeCategory === cat.id ? 'active' : ''}`}
                            onClick={() => setActiveCategory(cat.id === activeCategory ? null : cat.id)}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>
            <div className="dropdown-footer">
                <button className="reset-btn" onClick={handleReset}>Thiết lập lại</button>
                <button className="apply-btn" onClick={onClose}>Áp dụng</button>
            </div>
        </div>
    );
};


// --- COMPONENT TRANG CHÍNH ---
const FilterPage = () => {
    // State để quản lý việc mở/đóng dropdown
    const [openDropdown, setOpenDropdown] = useState(null); // 'date', 'filter', or null
    const [searchParams] = useSearchParams();
    const [activeCategory, setActiveCategory] = useState(
        searchParams.get('category') || null
    );
     const [selectedDates, setSelectedDates] = useState([]); // lưu danh sách ngày timestamp
    const [dateButtonText, setDateButtonText] = useState("Tất cả các ngày");
    useEffect(() => {
        if (selectedDates.length === 0) {
            setDateButtonText("Tất cả các ngày");
            return;
        }
        const sorted = [...selectedDates].sort((a, b) => a - b);
        const start = new Date(sorted[0]);
        const end = new Date(sorted[sorted.length - 1]);
        const format = d => `${d.getDate()} Tháng ${d.getMonth() + 1}, ${d.getFullYear()}`;
        setDateButtonText(`${format(start)} - ${format(end)}`);
    }, [selectedDates]);

    // Dữ liệu sự kiện giả
    const events = [
        { id: 1, img: "https://via.placeholder.com/300x180.png?text=Event+1", title: "TOUR VĂN MIẾU - VĂN MIẾU NIGHT TOUR", price: "Từ 0đ", date: "18 Tháng 10, 2025" },
        { id: 2, img: "https://via.placeholder.com/300x180.png?text=Event+2", title: "GÕN Show Tháng 10 - Hà Nội", price: "Từ 800.000đ", date: "23 Tháng 10, 2025" },
        { id: 3, img: "https://via.placeholder.com/300x180.png?text=Event+3", title: "La Traviata", price: "Từ 800.000đ", date: "24 Tháng 10, 2025" },
        { id: 4, img: "https://via.placeholder.com/300x180.png?text=Event+4", title: "1900 Future Hits #75: Thanh Duy", price: "Từ 600.000đ", date: "24 Tháng 10, 2025" },
        { id: 5, img: "https://via.placeholder.com/300x180.png?text=Event+5", title: "Show thực cảnh THÁNH THIÊN NỮ TƯỜNG", price: "Từ 700.000đ", date: "18 Tháng 10, 2025" },
        { id: 6, img: "https://via.placeholder.com/300x180.png?text=Event+6", title: "THOMAS ANDERS FROM MODERN TALKING", price: "Từ 1.650.000đ", date: "25 Tháng 10, 2025" },
    ];
   

    // Hàm xóa từng tag lọc
    const removeFilter = (type) => {
        if (type === 'date') setSelectedDates([]);
        if (type === 'category') setActiveCategory(null);
    };

    return (
        <div className="filter-page-container">
            {/* Thanh bộ lọc */}
            <div className="filter-bar">
                <div className="filter-bar-left">
                    <h2>Kết quả tìm kiếm</h2>
                </div>
                <div className="filter-bar-right">
                    <button 
                        className="filter-btn" 
                        onClick={() => setOpenDropdown(openDropdown === 'date' ? null : 'date')}
                    >
                        Tất cả các ngày
                        <span className={`arrow-icon ${openDropdown === 'date' ? 'up' : ''}`}>▼</span>
                    </button>
                    <button 
                        className="filter-btn" 
                        onClick={() => setOpenDropdown(openDropdown === 'filter' ? null : 'filter')}
                    >
                        Bộ lọc
                        <span className={`arrow-icon ${openDropdown === 'filter' ? 'up' : ''}`}>▼</span>
                    </button>
                    {/* Render dropdown tương ứng */}
                    {openDropdown === 'date' && <DatePickerDropdown onClose={() => setOpenDropdown(null)} />}
                        
                    {/* 4. Truyền state và hàm setter xuống component con */}
                    {openDropdown === 'filter' && (
                        <MainFilterDropdown 
                            onClose={() => setOpenDropdown(null)} 
                            activeCategory={activeCategory}
                            setActiveCategory={setActiveCategory}
                        />
                    )}
                </div>
            </div>

            <div className="active-filters">
                {selectedDates.length > 0 && (
                    <span className="filter-tag">
                        {dateButtonText}    
                        <button className="remove-tag" onClick={() => removeFilter('date')}>×</button>
                    </span>
                )}
                {activeCategory && (
                    <span className="filter-tag">
                        {activeCategory === 'art' ? 'Sân khấu & Nghệ thuật' :
                            activeCategory === 'music' ? 'Nhạc sống' :
                                activeCategory === 'sport' ? 'Thể thao' : 'Khác'}
                        <button className="remove-tag" onClick={() => removeFilter('category')}>×</button>
                    </span>
                )}
            </div>
            
            {/* Lưới sự kiện */}
            <div className="event-grid">
                {/* Thay `events` bằng `filteredEvents` nếu bạn đã làm bước lọc ở trên */}
                {events.map(event => (
                    <div className="event-card-filter" key={event.id}>
                        <img src={event.img} alt={event.title} />
                        <h3>{event.title}</h3>
                        <p className="price">{event.price}</p>
                        <p className="date">{event.date}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FilterPage;