import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Filter.css';
import { useSearchParams } from 'react-router-dom';
import { getAllEvents } from '../../api/event';
import { getAllCategories } from '../../api/category';
import { getAllLocations } from '../../api/location';
import { getAllTickets } from '../../api/ticket';

const CalendarMonth = ({ year, month, selectedDates, onDateClick }) => {
  const monthNames = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const generateDays = () => {
    const days = [];
    const date = new Date(year, month, 1);
    const firstDayOfWeek = date.getDay() === 0 ? 6 : date.getDay() - 1;
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
      const isSelected = selectedDates.includes(time);

      days.push(
        <span
          key={`day-${i}`}
          className={`day-cell ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
          onClick={() => onDateClick(fullDate)}
        >
          {i}
        </span>
      );
    }

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
      <div className="calendar-header">{monthNames[month]} {year}</div>
      <div className="calendar-grid days">
        <span>T2</span><span>T3</span><span>T4</span><span>T5</span>
        <span>T6</span><span>T7</span><span>CN</span>
      </div>
      <div className="calendar-grid">{generateDays()}</div>
    </div>
  );
};


const DatePickerDropdown = ({ onClose, selectedDates, setSelectedDates }) => {
  const [displayDate, setDisplayDate] = useState(new Date());

  const handleDateClick = (date) => {
    const time = date.getTime();
    if (selectedDates.includes(time)) {
      setSelectedDates(d => d.filter(x => x !== time));
    } else {
      setSelectedDates(d => [...d, time]);
    }
  };

  return (
    <div className="date-picker-dropdown">
      <div className="date-picker-content">
        <CalendarMonth
          year={displayDate.getFullYear()}
          month={displayDate.getMonth()}
          selectedDates={selectedDates}
          onDateClick={handleDateClick}
        />
      </div>

      <div className="dropdown-footer">
        <button className="reset-btn" onClick={() => setSelectedDates([])}>Reset</button>
        <button className="apply-btn" onClick={onClose}>Áp dụng</button>
      </div>
    </div>
  );
};

// =================== MAIN FILTER ===================
const MainFilterDropdown = ({ onClose, activeCategory, setActiveCategory }) => {
  const categories = [
    { id: 'music', name: 'Nhạc sống' },
    { id: 'art', name: 'Sân khấu & Nghệ thuật' },
    { id: 'sport', name: 'Thể thao' },
    { id: 'other', name: 'Khác' }
  ];

  return (
    <div className="main-filter-dropdown">
      <div className="filter-section">
        <h4>Thể loại</h4>
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
        <button className="reset-btn" onClick={() => setActiveCategory(null)}>Reset</button>
        <button className="apply-btn" onClick={onClose}>Áp dụng</button>
      </div>
    </div>
  );
};

// =================== PAGE ===================
const FilterPage = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedDates, setSelectedDates] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);

  const [searchParams] = useSearchParams();

  // ========== FETCH API ==========
  useEffect(() => {
    const fetchData = async () => {
        try {
            const [eventRes, categoryRes, locationRes, ticketRes] = await Promise.all([
            getAllEvents(),
            getAllCategories(),
            getAllLocations(),
            getAllTickets()
            ]);
            setEvents(eventRes.data);
            setCategories(categoryRes.data);
            setLocations(locationRes.data);
            setTickets(ticketRes.data);
        } catch (error) {
            console.error("Lỗi load dữ liệu:", error);
        } finally {
            setLoading(false);
        }
        };
    fetchData();
  }, []);

    const getLocationNameByEventId = (eventId) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return "";

    const location = locations.find(l => l.id === event.location_id);
    return location?.name || "";
    };

    const chose =(id)=>{
        localStorage.setItem("eventid",id);
        
        navigate("/ticketdetail");
    }
    //min
    const navigate = useNavigate();
    const getMinTicketPrice = (eventId) => {
        const eventTickets = tickets.filter(t => t.event_id === eventId);

        if (eventTickets.length === 0) return null;

        const minPrice = Math.min(...eventTickets.map(t => Number(t.price)));

        return minPrice;
    };

  // ========== FILTER LOGIC ==========
  const filteredEvents = events.filter(event => {
    let pass = true;

    // Filter by category
    if (activeCategory) {
      pass = event.category === activeCategory;
    }

    // Filter by date
    if (selectedDates.length > 0) {
      const eventDate = new Date(event.start_date);
      eventDate.setHours(0, 0, 0, 0);
      const eventTime = eventDate.getTime();

      pass = pass && selectedDates.includes(eventTime);
    }

    return pass;
  });

  if (loading) return <p style={{ padding: 20 }}>Đang tải dữ liệu...</p>;

  return (
    <div className="filter-page-container">

      {/* FILTER BAR */}
      <div className="filter-bar">
        <div className="filter-bar-right">
          <button
            className="filter-btn"
            onClick={() => setOpenDropdown(openDropdown === 'date' ? null : 'date')}
          >
            Chọn ngày ▼
          </button>

          <button
            className="filter-btn"
            onClick={() => setOpenDropdown(openDropdown === 'filter' ? null : 'filter')}
          >
            Bộ lọc ▼
          </button>

          {openDropdown === 'date' && (
            <DatePickerDropdown
              onClose={() => setOpenDropdown(null)}
              selectedDates={selectedDates}
              setSelectedDates={setSelectedDates}
            />
          )}

          {openDropdown === 'filter' && (
            <MainFilterDropdown
              onClose={() => setOpenDropdown(null)}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
            />
          )}
        </div>
      </div>

      {/* EVENT GRID */}
      <div className="event-grid">
        {filteredEvents.length === 0 && <p>Không có sự kiện</p>}

        {filteredEvents.map(event => (
          <div className="event-card-filter" key={event.id} onClick={() => chose(event.id)} style={{ cursor: 'pointer' }} >
            <img src={event.cover_image} alt={event.name} />
            <h3>{event.name}-{getLocationNameByEventId(event.id)}</h3>
            <p className="price">
            {getMinTicketPrice(event.id)? `Từ ${getMinTicketPrice(event.id).toLocaleString('vi-VN')}đ`: 'Liên hệ'}</p>
            <p className="date">
              {new Date(event.start_date).toLocaleDateString("vi-VN")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterPage;
