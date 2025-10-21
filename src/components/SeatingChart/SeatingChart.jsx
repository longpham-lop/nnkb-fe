import React, { useState } from 'react';
import './SeatingChart.css';

const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN').format(amount);

const SeatingChartComponent = ({ seats }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);

  const handleSeatClick = (seat) => {
    if (seat.status === 'sold') return;

    setSelectedSeats(currentSelected => {
      const isSelected = currentSelected.find(s => s.id === seat.id);
      if (isSelected) {
        return currentSelected.filter(s => s.id !== seat.id);
      } else {
        return [...currentSelected, seat];
      }
    });
  };

  const total = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  return (
    <div className="seating-container">
      <div className="seating-stage">SÂN KHẤU</div>
      <div className="seating-chart">
        {seats.map(seat => {
          const isSelected = selectedSeats.some(s => s.id === seat.id);
          return (
            <div
              key={seat.id}
              className={`seat ${seat.status} ${isSelected ? 'selected' : ''}`}
              onClick={() => handleSeatClick(seat)}
              title={`Ghế ${seat.id} - ${formatCurrency(seat.price)} VND`}
            >
              {seat.number}
            </div>
          );
        })}
      </div>
      <div className="seating-legend">
        <div className="legend-item"><div className="seat available"></div> Còn trống</div>
        <div className="legend-item"><div className="seat selected"></div> Đang chọn</div>
        <div className="legend-item"><div className="seat sold"></div> Đã bán</div>
      </div>
      <div className="seating-summary">
        <h3>Ghế đã chọn: {selectedSeats.length}</h3>
        <ul>
          {selectedSeats.map(s => <li key={s.id}>Ghế {s.id} - {formatCurrency(s.price)} VND</li>)}
        </ul>
        <hr/>
        <p><strong>Tổng cộng: {formatCurrency(total)} VND</strong></p>
      </div>
    </div>
  );
};

export default SeatingChartComponent;
