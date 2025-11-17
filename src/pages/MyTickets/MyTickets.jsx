import React, { useEffect, useState } from "react";
import "./MyTickets.css";

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("nftTickets") || "[]");
    setTickets(stored);
  }, []);

  return (
    <div className="mytickets-container">
      <h2>🎟 Vé NFT của bạn</h2>

      {tickets.length === 0 ? <p>Chưa có vé nào.</p> : null}

      <div className="ticket-grid">
        {tickets.map((t, i) => (
          <div className="ticket-card" key={i}>
            <h3>{t.event}</h3>
            <p>Người mua: {t.buyer}</p>
            <p>Số lượng: {t.quantity}</p>
            <p>TX Hash:</p>
            <small>{t.txHash}</small>

            <img src={t.qr} alt="qr-code" className="ticket-qr"/>

            <p><i>Mint lúc: {new Date(t.createdAt).toLocaleString()}</i></p>
          </div>
        ))}
      </div>
    </div>
  );
}
