import React, { useState } from 'react';
import './ZoneMap.css';

const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN').format(amount);

const ZoneMapComponent = ({ zones }) => {
  const [selectedZone, setSelectedZone] = useState(null);

  const handleZoneClick = (zone) => {
    if (zone.price > 0) {
      setSelectedZone(zone);
    }
  };

  return (
    <div className="zonemap-container">
      <div className="zonemap-stage">SÂN KHẤU</div>
      <div className="zonemap-layout">
        {zones.filter(z => z.price > 0).map(zone => (
          <div
            key={zone.id}
            className={`zone-area zone-${zone.id} ${selectedZone?.id === zone.id ? 'selected' : ''}`}
            style={{ backgroundColor: zone.color }}
            onClick={() => handleZoneClick(zone)}
          >
            {zone.name}
          </div>
        ))}
      </div>
      <div className="zonemap-info">
        {selectedZone ? (
          <>
            <h3>{selectedZone.name}</h3>
            <p>Giá vé: <strong>{formatCurrency(selectedZone.price)} VND</strong></p>
            {/* Thêm nút +/- và Mua vé ở đây */}
          </>
        ) : (
          <p>Vui lòng chọn một khu vực trên sơ đồ</p>
        )}
      </div>
    </div>
  );
};

export default ZoneMapComponent;
