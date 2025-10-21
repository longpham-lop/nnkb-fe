// File này đóng vai trò là một "Backend giả".
// Nó chứa dữ liệu cho nhiều sự kiện với các loại layout khác nhau.

const mockEventsData = {
  // Sự kiện 1: Dùng OrderTicket.jsx của bạn
  "gs25-music-festival": {
    eventName: "GS25 MUSIC FESTIVAL 2025",
    layoutType: "list", // <-- Quan trọng!
    tickets: [
      { id: 'ga1', name: 'Gói Dậy Sớm + GA 1', desc: 'Full Day Access + GA 1', price: 499000 },
      { id: 'ga2', name: 'Gói Dậy Sớm + GA 2', desc: 'Full Day Access + GA 2', price: 699000 },
      { id: 'fz1', name: 'Gói Dậy Sớm + FanZone 1', desc: 'Full Day Access + FanZone 1', price: 799000 },
    ]
  },

  // Sự kiện 2: Layout kiểu Sơ đồ khu vực
  "lang-nghe-mua-thu": {
    eventName: "Lắng nghe con mùa thu",
    layoutType: "zonemap", // <-- Quan trọng!
    zones: [
        { id: 'zoneA', name: 'SVIP', color: '#8E44AD', price: 5000000 },
        { id: 'zoneB', name: 'VIP', color: '#3498DB', price: 3500000 },
        { id: 'zoneC', name: 'KHU A', color: '#2ECC71', price: 2000000 },
        { id: 'zoneD', name: 'KHU B', color: '#F1C40F', price: 1500000 },
        { id: 'stage', name: 'SÂN KHẤU', color: '#34495E', price: 0 },
    ]
  },

  // Sự kiện 3: Layout kiểu Sơ đồ ghế ngồi
  "eifman-ballet": {
    eventName: "Eifman Ballet World Tour in Vietnam",
    layoutType: "seating", // <-- Quan trọng!
    seats: generateSeats(10, 20), // Tạo 10 hàng, mỗi hàng 20 ghế
  }
};

// Hàm helper để tự động tạo dữ liệu ghế ngồi cho đẹp
function generateSeats(rows, seatsPerRow) {
    const seats = [];
    const rowChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < rows; i++) {
        for (let j = 1; j <= seatsPerRow; j++) {
            const status = Math.random() > 0.7 ? 'sold' : 'available';
            const price = 2000000 + (rows - i) * 500000;
            seats.push({
                id: `${rowChars[i]}${j}`,
                row: rowChars[i],
                number: j,
                price,
                status,
            });
        }
    }
    return seats;
}


// Hàm này giả lập việc gọi API đến backend
export const getEventDetailsById = (eventId) => {
  console.log(`[Mock API] Fetching data for event: ${eventId}`);
  
  return new Promise((resolve, reject) => {
    // Giả lập độ trễ mạng (0.5 giây)
    setTimeout(() => {
      const eventData = mockEventsData[eventId];
      if (eventData) {
        console.log("[Mock API] Data found:", eventData);
        resolve(eventData); // Trả về dữ liệu nếu tìm thấy
      } else {
        console.error(`[Mock API] Error: Event with ID "${eventId}" not found.`);
        reject(new Error("Event not found")); 
      }
    }, 500);
  });
};

