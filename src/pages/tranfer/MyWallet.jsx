import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./MintAndTransferTicket.css"; // Sử dụng chung file CSS với trang Mint

// ⚠️ ĐIỀN ĐỊA CHỈ CONTRACT CỦA BẠN
const CONTRACT_ADDRESS = "0x6830550Aaf8484c64E0bb6B51247bAc1Bfda7a17"; 

const CONTRACT_ABI = [
  "function safeTransferFrom(address from, address to, uint256 tokenId)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function balanceOf(address owner) view returns (uint256)",
  "function isTicketUsed(uint256 tokenId) view returns (bool)",
  "function tokenURI(uint256 tokenId) view returns (string)"
];

export default function MyWallet() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState("");
  
  // Data
  const [myTickets, setMyTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  // Input Form
  const [transferTo, setTransferTo] = useState("");
  const [selectedTokenId, setSelectedTokenId] = useState(null);

  // 1. KẾT NỐI VÍ
  const connectWallet = async () => {
    if (!window.ethereum) return alert("Vui lòng cài đặt MetaMask!");
    const _provider = new ethers.BrowserProvider(window.ethereum);
    const _signer = await _provider.getSigner();
    const _account = await _signer.getAddress();
    
    setProvider(_provider);
    setSigner(_signer);
    setAccount(_account);
    fetchMyTickets(_account, _provider);
  };

  // 2. LẤY DANH SÁCH VÉ CỦA TÔI
  const fetchMyTickets = async (userAddress, prov) => {
    setLoading(true);
    setStatus("⏳ Đang quét blockchain để tìm vé...");
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, prov);
    const tickets = [];

    try {
      // Demo: Quét 50 ID đầu tiên. (Thực tế nên dùng TheGraph hoặc API Backend)
      for (let i = 1; i <= 50; i++) {
        try {
          // Gọi song song để nhanh hơn một chút nếu cần, nhưng for loop an toàn hơn cho demo
          const owner = await contract.ownerOf(i);
          if (owner.toLowerCase() === userAddress.toLowerCase()) {
            const isUsed = await contract.isTicketUsed(i);
            tickets.push({ id: i, isUsed: isUsed });
          }
        } catch (e) {
          // Bỏ qua lỗi (thường do token ID chưa được mint)
        }
      }
      setMyTickets(tickets);
      setStatus(tickets.length > 0 ? "✅ Đã tải xong danh sách vé." : "⚠️ Không tìm thấy vé nào (trong 50 ID đầu).");
    } catch (err) {
      console.error(err);
      setStatus("❌ Lỗi khi tải vé.");
    } finally {
      setLoading(false);
    }
  };

  // 3. HÀM CHUYỂN VÉ
  const handleTransfer = async () => {
    if (!selectedTokenId) return alert("Vui lòng chọn vé cần chuyển!");
    if (!transferTo || !ethers.isAddress(transferTo)) return alert("Địa chỉ ví nhận không hợp lệ!");

    try {
      setLoading(true);
      setStatus("⏳ Đang xử lý chuyển nhượng trên Blockchain...");

      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      // Gọi hàm safeTransferFrom (Cú pháp ethers v6 cho overloaded function)
      const tx = await contract["safeTransferFrom(address,address,uint256)"](
        account, 
        transferTo, 
        selectedTokenId
      );

      await tx.wait();
      setStatus(`✅ Chuyển vé #${selectedTokenId} thành công!`);
      
      // Reset và load lại
      setTransferTo("");
      setSelectedTokenId(null);
      fetchMyTickets(account, provider);

    } catch (err) {
      console.error(err);
      if (err.message.includes("Ve da check-in")) {
        setStatus("⛔ Lỗi: Vé này đã Check-in, không thể chuyển!");
      } else {
        setStatus("❌ Lỗi: " + (err.reason || "Giao dịch thất bại"));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  return (
    <div className="page-container">
      <header className="page-header">
        <h1 className="page-title">Ví Vé Của Tôi</h1>
        <p className="page-subtitle">Quản lý và chuyển nhượng vé NFT</p>
      </header>

      {/* WALLET INFO BOX */}
      <div className="wallet-box">
        <div className="wallet-info">
          <h3>Thông Tin Ví</h3>
          {!account ? (
            <p>Đang kết nối...</p>
          ) : (
            <div>
              <p><strong>Địa chỉ:</strong> {account}</p>
              <p style={{marginTop: 5}}><strong>Số lượng vé:</strong> {myTickets.length} vé tìm thấy</p>
            </div>
          )}
        </div>
        <button 
          onClick={() => fetchMyTickets(account, provider)} 
          className="btn btn-secondary"
          disabled={loading}
        >
          {loading ? "Đang tải..." : "🔄 Làm mới danh sách"}
        </button>
      </div>

      <div className="dashboard-grid" style={{ gridTemplateColumns: "2fr 1fr" }}> {/* Override grid để cột trái to hơn */}
        
        {/* CỘT TRÁI: DANH SÁCH VÉ */}
        <section className="card">
          <div className="card-header">
            <h2 className="card-title">🎫 Kho Vé Của Bạn</h2>
          </div>

          {loading && myTickets.length === 0 ? (
            <div style={{textAlign: 'center', padding: 20, color: '#666'}}>Đang quét dữ liệu...</div>
          ) : (
            <div className="ticket-grid">
              {myTickets.map((ticket) => (
                <div 
                  key={ticket.id}
                  onClick={() => !ticket.isUsed && setSelectedTokenId(ticket.id)}
                  className={`ticket-item ${selectedTokenId === ticket.id ? 'selected' : ''} ${ticket.isUsed ? 'used' : ''}`}
                >
                  <span className="ticket-icon">🎟️</span>
                  <span className="ticket-id">Vé #{ticket.id}</span>
                  
                  {ticket.isUsed ? (
                    <span className="status-tag used">ĐÃ DÙNG</span>
                  ) : (
                    <span className="status-tag active">CÓ SẴN</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {!loading && myTickets.length === 0 && (
             <div style={{textAlign: 'center', padding: 40, color: '#999'}}>
                <p>Bạn chưa sở hữu vé nào (hoặc vé nằm ngoài phạm vi quét ID 1-50).</p>
             </div>
          )}
        </section>

        {/* CỘT PHẢI: FORM CHUYỂN VÉ */}
        <section className="card" style={{ height: "fit-content" }}>
          <div className="card-header">
            <h2 className="card-title">🚀 Chuyển Nhượng</h2>
          </div>
          
          <div className="form-group">
            <label className="label">Vé đang chọn:</label>
            <div style={{ 
              padding: 10, 
              background: selectedTokenId ? '#eef2ff' : '#f3f4f6', 
              borderRadius: 8, 
              textAlign: 'center',
              fontWeight: 'bold',
              color: selectedTokenId ? 'var(--primary-color)' : '#999',
              border: selectedTokenId ? '1px solid var(--primary-color)' : '1px dashed #ccc'
            }}>
              {selectedTokenId ? `💎 Vé #${selectedTokenId}` : "Chưa chọn vé nào"}
            </div>
          </div>

          <div className="form-group">
            <label className="label">Địa chỉ ví người nhận:</label>
            <input 
              className="input" 
              placeholder="0x123..." 
              value={transferTo}
              onChange={(e) => setTransferTo(e.target.value)}
            />
            <small className="input-helper">Hãy kiểm tra kỹ địa chỉ ví!</small>
          </div>

          <button 
            onClick={handleTransfer}
            disabled={loading || !selectedTokenId || !transferTo}
            className="btn btn-warning btn-block"
          >
            {loading ? "⏳ Đang gửi..." : "🎁 Gửi Vé Ngay"}
          </button>

          <div style={{ marginTop: 20, fontSize: '0.85rem', color: '#6b7280', background: '#fffbeb', padding: 10, borderRadius: 8 }}>
            <strong>Lưu ý:</strong> <br/>
            - Vé đã Check-in (Sử dụng) sẽ bị khoá và không thể chuyển nhượng.<br/>
            - Giao dịch cần một lượng nhỏ phí Gas (ETH).
          </div>
        </section>

      </div>

      {/* STATUS BAR */}
      {status && (
        <div className="status-bar">
          <span>🔔 {status}</span>
        </div>
      )}
    </div>
  );
}