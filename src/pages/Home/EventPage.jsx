import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEventDetailsById } from 'MockAPI';

// Import component chọn vé theo danh sách CỦA BẠN
import OrderTicket from '../component/OrderTicket'; // <-- GIẢ SỬ ĐÂY LÀ FILE CỦA BẠN

// Import các component mới
import ZoneMapComponent from '../components/ZoneMap';
import SeatingChartComponent from '../components/SeatingChart';

// Component Loading...
const LoadingSpinner = () => <div style={{ textAlign: 'center', padding: '50px' }}>Đang tải dữ liệu...</div>;

function EventPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    getEventDetailsById(eventId)
      .then(data => {
        setEventData(data);
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [eventId]);

  const handleBuyTickets = () => {
    // Logic điều hướng đến trang điền thông tin
    // Bạn có thể truyền dữ liệu vé đã chọn qua state
    navigate('/checkout', { state: { /* ...dữ liệu vé... */ }});
  };

  const renderTicketSelector = () => {
    if (!eventData) return null;

    switch (eventData.layoutType) {
      case 'list':
        // Sử dụng component OrderTicket.jsx của bạn ở đây
        // Bạn cần truyền props 'tickets' vào
        return <OrderTicket tickets={eventData.tickets} />;
      
      case 'zonemap':
        return <ZoneMapComponent zones={eventData.zones} />;
      
      case 'seating':
        return <SeatingChartComponent seats={eventData.seats} />;
      
      default:
        return <p>Loại layout không hợp lệ.</p>;
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Lỗi: {error} - Vui lòng kiểm tra lại ID sự kiện.</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>{eventData?.eventName}</h1>
      <hr />
      
      {renderTicketSelector()}

      {/* Nút này nên nằm ngoài các component con để thống nhất */}
      <button 
        onClick={handleBuyTickets} 
        style={{ 
            display: 'block', 
            width: '100%', 
            maxWidth: '800px',
            margin: '20px auto', 
            padding: '15px', 
            fontSize: '18px', 
            backgroundColor: '#2b9c6a', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px',
            cursor: 'pointer'
        }}
      >
        Mua vé ngay
      </button>
    </div>
  );
}

export default EventPage;

