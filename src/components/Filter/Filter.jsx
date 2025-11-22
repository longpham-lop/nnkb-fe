import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllEvents } from '../../api/event';
import { getAllCategories } from '../../api/category';
import { getAllLocations } from '../../api/location';
import { getAllTickets } from '../../api/ticket';
import './Filter.css'; // Cập nhật CSS nếu cần

// =================== HELPER FUNCTIONS ===================
const isSameDay = (d1, d2) => {
  return d1.getDate() === d2.getDate() && 
         d1.getMonth() === d2.getMonth() && 
         d1.getFullYear() === d2.getFullYear();
};

const isBetween = (date, start, end) => {
  return date > start && date < end;
};

// =================== SINGLE CALENDAR MONTH COMPONENT ===================
const CalendarMonth = ({ year, month, startDate, endDate, onDateClick }) => {
  const monthNames = ["Tháng 1","Tháng 2","Tháng 3","Tháng 4","Tháng 5","Tháng 6","Tháng 7","Tháng 8","Tháng 9","Tháng 10","Tháng 11","Tháng 12"];
  const today = new Date();
  today.setHours(0,0,0,0);

  const generateDays = () => {
    const days = [];
    const date = new Date(year, month, 1);
    const firstDayOfWeek = date.getDay() === 0 ? 6 : date.getDay() - 1; // T2=0
    const daysInMonth = new Date(year, month+1, 0).getDate();

    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(<span key={`prev-${i}`} className="day-cell empty"></span>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const currentLoopDate = new Date(year, month, i);
      currentLoopDate.setHours(0,0,0,0);

      const isToday = isSameDay(currentLoopDate, today);
      const isStart = startDate && isSameDay(currentLoopDate, startDate);
      const isEnd = endDate && isSameDay(currentLoopDate, endDate);
      const isInRange = startDate && endDate && isBetween(currentLoopDate, startDate, endDate);

      let className = `day-cell ${isToday ? 'today' : ''}`;
      if (isStart) className += ' range-start selected';
      if (isEnd) className += ' range-end selected';
      if (isInRange) className += ' in-range';

      days.push(
        <span key={`day-${i}`} className={className} onClick={() => onDateClick(currentLoopDate)}>
          {i}
        </span>
      );
    }
    return days;
  };

  return (
    <div className="calendar-month">
      <div className="calendar-header-title">{monthNames[month]} {year}</div>
      <div className="calendar-grid days-header">
        <span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span>CN</span>
      </div>
      <div className="calendar-grid days-body">{generateDays()}</div>
    </div>
  );
};

// =================== DUAL CALENDAR DROPDOWN ===================
const DatePickerDropdown = ({ onClose, startDate, endDate, setDateRange }) => {
  const [viewDate, setViewDate] = useState(new Date());

  const changeMonth = (offset) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth()+offset, 1);
    setViewDate(newDate);
  };

  const handleDateClick = (date) => {
    if (!startDate || (startDate && endDate)) {
      setDateRange({ start: date, end: null });
    } else {
      if (date < startDate) setDateRange({ start: date, end: startDate });
      else setDateRange({ start: startDate, end: date });
    }
  };

  const handleQuickFilter = (type) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    let start=null, end=null;

    switch(type){
      case 'all': start=null; end=null; break;
      case 'today': start=new Date(today); end=new Date(today); break;
      case 'tomorrow': start=new Date(today); start.setDate(start.getDate()+1); end=new Date(start); break;
      case 'weekend': {
        const day = today.getDay();
        const diff = today.getDate() - day + (day===0?-6:1)+5;
        start=new Date(today.setDate(diff));
        end=new Date(today.setDate(diff+1));
        break;
      }
      case 'month': start=new Date(today.getFullYear(),today.getMonth(),1); end=new Date(today.getFullYear(),today.getMonth()+1,0); break;
      default: break;
    }
    setDateRange({ start, end });
  };

  const nextMonthDate = new Date(viewDate.getFullYear(), viewDate.getMonth()+1, 1);

  return (
    <div className="date-picker-dropdown expanded">
      <div className="quick-filters">
        <button onClick={()=>handleQuickFilter('all')} className={!startDate?'active':''}>Tất cả các ngày</button>
        <button onClick={()=>handleQuickFilter('today')}>Hôm nay</button>
        <button onClick={()=>handleQuickFilter('tomorrow')}>Ngày mai</button>
        <button onClick={()=>handleQuickFilter('weekend')}>Cuối tuần này</button>
        <button onClick={()=>handleQuickFilter('month')}>Tháng này</button>
      </div>
      <div className="calendar-container">
        <button className="nav-btn prev" onClick={()=>changeMonth(-1)}>&lt;</button>
        <div className="calendars-wrapper">
          <CalendarMonth year={viewDate.getFullYear()} month={viewDate.getMonth()} startDate={startDate} endDate={endDate} onDateClick={handleDateClick} />
          <CalendarMonth year={nextMonthDate.getFullYear()} month={nextMonthDate.getMonth()} startDate={startDate} endDate={endDate} onDateClick={handleDateClick} />
        </div>
        <button className="nav-btn next" onClick={()=>changeMonth(1)}>&gt;</button>
      </div>
      <div className="dropdown-footer">
        <button className="reset-btn" onClick={()=>setDateRange({start:null,end:null})}>Thiết lập lại</button>
        <button className="apply-btn" onClick={onClose}>Áp dụng</button>
      </div>
    </div>
  );
};

// =================== ADVANCED FILTER DROPDOWN ===================
const MainFilterDropdown = ({ onClose, filters, setFilters }) => {
  const locations = ["Toàn quốc","Hồ Chí Minh","Hà Nội","Đà Lạt","Vị trí khác"];
  const categories = [
    { id:'music', name:'Nhạc sống' },
    { id:'art', name:'Sân khấu & Nghệ thuật' },
    { id:'sport', name:'Thể thao' },
    { id:'other', name:'Khác' }
  ];
  
  const updateFilter = (key,value) => {
    setFilters(prev => ({...prev, [key]: value}));
  };

  return (
    
    <div className="main-filter-dropdown">
      <div className="filter-section">
        <h4>Vị trí</h4>
        <div className="radio-group-vertical">
          {locations.map(loc=>(
            <label key={loc} className="radio-label">
              <input type="radio" name="location" checked={filters.location===loc} onChange={()=>updateFilter('location',loc)} />
              <span className="radio-custom"></span>{loc}
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section price-section">
        <div className="price-header"><h4>Giá tiền</h4></div>
        <div className="price-row">
          <span>Miễn phí</span>
          <label className="switch">
            <input type="checkbox" checked={filters.isFree} onChange={e=>updateFilter('isFree',e.target.checked)} />
            <span className="slider round"></span>
          </label>
        </div>
      </div>

      <div className="filter-section">
        <h4>Thể loại</h4>
        <div className="category-chips">
          {categories.map(cat=>(
            <button key={cat.id} className={`chip-btn ${filters.category===cat.id?'active':''}`} onClick={()=>updateFilter('category', filters.category===cat.id?null:cat.id)}>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="dropdown-footer">
        <button className="reset-btn" onClick={()=>setFilters({location:'Toàn quốc', isFree:false, category:null})}>Thiết lập lại</button>
        <button className="apply-btn" onClick={onClose}>Áp dụng</button>
      </div>
    </div>
  );
};

// =================== PAGE COMPONENT ===================
const FilterPage = () => {
  const navigate = useNavigate();
  const [openDropdown,setOpenDropdown] = useState(null);

  // Data states
  const [events,setEvents] = useState([]);
  const [categories,setCategories] = useState([]);
  const [locations,setLocations] = useState([]);
  const [tickets,setTickets] = useState([]);
  const [loading,setLoading] = useState(true);

  // Filter states
  const [dateRange,setDateRange] = useState({start:null,end:null});
  const [advancedFilters,setAdvancedFilters] = useState({location:'Toàn quốc', isFree:false, category:null});

  // Fetch data
  useEffect(()=>{
    const fetchData = async ()=>{
      try{
        const [eventRes,categoryRes,locationRes,ticketRes] = await Promise.all([
          getAllEvents(), getAllCategories(), getAllLocations(), getAllTickets()
        ]);
        setEvents(eventRes.data);
        setCategories(categoryRes.data);
        setLocations(locationRes.data);
        setTickets(ticketRes.data);
      }catch(err){
        console.error("Lỗi load dữ liệu:",err);
      }finally{
        setLoading(false);
      }
    };
    fetchData();
  },[]);

  const getLocationNameByEventId = (eventId)=>{
    const event = events.find(e=>e.id===eventId);
    if(!event) return "";
    const loc = locations.find(l=>l.id===event.location_id);
    return loc?.name || "";
  };

  const getMinTicketPrice = (eventId)=>{
    const eventTickets = tickets.filter(t=>t.event_id===eventId);
    if(eventTickets.length===0) return null;
    return Math.min(...eventTickets.map(t=>Number(t.price)));
  };

  const goToDetail = (id)=>{
    localStorage.setItem("eventid",id);
    navigate("/ticketdetail");
  };

  // =================== FILTER LOGIC ===================
  const categoryNameMap = {
    'music':'Nhạc sống',
    'art':'Sân khấu & Nghệ thuật',
    'sport':'Thể thao',
    'other':'Khác'
  };

  const filteredEvents = events.filter(event=>{
    let pass = true;

    // Date Range
    if(dateRange.start){
      const eventDate = new Date(event.start_date);
      eventDate.setHours(0,0,0,0);
      const effectiveEnd = dateRange.end || dateRange.start;
      if(eventDate < dateRange.start || eventDate > effectiveEnd) pass=false;
    }

    // Category
    if(advancedFilters.category && pass){
      const eventCategoryId = event.category_id || event.category;
      if(eventCategoryId !== advancedFilters.category) pass = false;
    }

    // Location
    if(advancedFilters.location!=='Toàn quốc' && pass){
      const locName = getLocationNameByEventId(event.id);
      if(!locName.includes(advancedFilters.location)) pass=false;
    }

    // Free price
    if(advancedFilters.isFree && pass){
      const minPrice = getMinTicketPrice(event.id);
      if(minPrice && minPrice>0) pass=false;
    }

    return pass;
  });

  if(loading) return <div className="loading-container">Đang tải dữ liệu...</div>;

  // Date label
  const getDateLabel = ()=>{
    if(dateRange.start && dateRange.end){
      const d1 = dateRange.start.getDate() + "/" + (dateRange.start.getMonth()+1);
      const d2 = dateRange.end.getDate() + "/" + (dateRange.end.getMonth()+1);
      return `${d1} - ${d2}`;
    }
    if(dateRange.start) return `${dateRange.start.getDate()}/${dateRange.start.getMonth()+1}`;
    return "Tất cả các ngày";
  };

  const handleRemoveFilter = (type)=>{
    setAdvancedFilters(prev=>{
      const newFilters = {...prev};
      if(type==='location') newFilters.location='Toàn quốc';
      if(type==='category') newFilters.category=null;
      if(type==='isFree') newFilters.isFree=false;
      return newFilters;
    });
  };

  return (
    <div className="filter-page-container">
      <div className="filter-bar">
        <div className="filter-bar-right">
          <div className="dropdown-wrapper">
            <button className={`filter-btn ${openDropdown==='date'?'active':''}`} onClick={()=>setOpenDropdown(openDropdown==='date'?null:'date')}>
              📅 {getDateLabel()} ▼
            </button>
            {openDropdown==='date' && <DatePickerDropdown onClose={()=>setOpenDropdown(null)} startDate={dateRange.start} endDate={dateRange.end} setDateRange={setDateRange} />}
          </div>

          <div className="dropdown-wrapper">
            <button className={`filter-btn ${openDropdown==='filter'?'active':''}`} onClick={()=>setOpenDropdown(openDropdown==='filter'?null:'filter')}>
              ⚙️ Bộ lọc ▼
            </button>
            {openDropdown==='filter' && <MainFilterDropdown onClose={()=>setOpenDropdown(null)} filters={advancedFilters} setFilters={setAdvancedFilters} />}
          </div>

          {/* Location Chip */}
          {advancedFilters.location!=='Toàn quốc' && (
            <button className="filter-chip" onClick={()=>handleRemoveFilter('location')}>
              <span className="chip-close-icon">✕</span>{advancedFilters.location}
            </button>
          )}

          {/* Category Chip */}
          {advancedFilters.category && (
            <button className="filter-chip" onClick={()=>handleRemoveFilter('category')}>
              <span className="chip-close-icon">✕</span>{categoryNameMap[advancedFilters.category]}
            </button>
          )}

          {/* Price Chip */}
          {advancedFilters.isFree && (
            <button className="filter-chip" onClick={()=>handleRemoveFilter('isFree')}>
              <span className="chip-close-icon">✕</span>Miễn phí
            </button>
          )}
        </div>
      </div>

      {/* Event Grid */}
      <div className="event-grid">
        {filteredEvents.length===0 && <div className="no-data"><p>Không tìm thấy sự kiện phù hợp.</p></div>}
        {filteredEvents.map(event=>{
          const minPrice = getMinTicketPrice(event.id);
          return (
            <div className="event-card-filter" key={event.id} onClick={()=>goToDetail(event.id)}>
              <div className="img-wrapper"><img src={event.cover_image} alt={event.name} /></div>
              <div className="card-content">
                <h3 className="event-title">{event.name}</h3>
                <p className="event-location">📍 {getLocationNameByEventId(event.id)}</p>
                <div className="card-footer">
                  <p className="price">{minPrice===0?'Miễn phí':(minPrice?`Từ ${minPrice.toLocaleString('vi-VN')}đ`:'Liên hệ')}</p>
                  <p className="date">{new Date(event.start_date).toLocaleDateString("vi-VN")}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FilterPage;
