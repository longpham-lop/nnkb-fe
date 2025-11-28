import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./MintAndTransferTicket.css"; // Tận dụng file CSS cũ

const CONTRACT_ADDRESS = "0x6830550Aaf8484c64E0bb6B51247bAc1Bfda7a17"; // ⚠️ ĐIỀN ĐỊA CHỈ CONTRACT CỦA BẠN

// ABI chỉ lấy những hàm cần thiết cho trang này
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
    if (!window.ethereum) return alert("Cài MetaMask đi!");
    const _provider = new ethers.BrowserProvider(window.ethereum);
    const _signer = await _provider.getSigner();
    const _account = await _signer.getAddress();
    
    setProvider(_provider);
    setSigner(_signer);
    setAccount(_account);
    fetchMyTickets(_account, _provider);
  };

  // 2. LẤY DANH SÁCH VÉ CỦA TÔI
  // Lưu ý: Vì ERC721 chuẩn không có hàm lấy list ID, ta quét thủ công 50 ID đầu để demo
  // Thực tế nên dùng TheGraph hoặc lưu DB Backend để lấy list ID nhanh hơn.
  const fetchMyTickets = async (userAddress, prov) => {
    setLoading(true);
    setStatus("Đang quét blockchain để tìm vé của bạn...");
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, prov);
    const tickets = [];

    try {
      // Demo: Quét thử 20 ID đầu tiên xem cái nào là của mình
      // (Nếu bạn mint nhiều hơn 20 vé thì tăng số này lên)
      for (let i = 1; i <= 20; i++) {
        try {
          const owner = await contract.ownerOf(i);
          if (owner.toLowerCase() === userAddress.toLowerCase()) {
            // Nếu là của mình -> Check xem dùng chưa
            const isUsed = await contract.isTicketUsed(i);
            tickets.push({ id: i, isUsed: isUsed });
          }
        } catch (e) {
          // Lỗi thường do Token chưa mint -> Bỏ qua
        }
      }
      setMyTickets(tickets);
      setStatus(`Tìm thấy ${tickets.length} vé.`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 3. HÀM CHUYỂN VÉ
  const handleTransfer = async () => {
    if (!selectedTokenId || !transferTo) return alert("Vui lòng chọn vé và điền ví nhận!");
    if (!ethers.isAddress(transferTo)) return alert("Địa chỉ ví nhận không hợp lệ!");

    try {
      setLoading(true);
      setStatus("⏳ Đang thực hiện chuyển nhượng...");

      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      // Cú pháp đặc biệt của Ethers.js khi gọi hàm Overloaded
      // safeTransferFrom có 2 phiên bản, ta phải chỉ định rõ phiên bản có data
      const tx = await contract["safeTransferFrom(address,address,uint256)"](
        account, 
        transferTo, 
        selectedTokenId
      );

      await tx.wait();
      setStatus("✅ Chuyển vé thành công!");
      
      // Làm mới danh sách
      fetchMyTickets(account, provider);
      setTransferTo("");
      setSelectedTokenId(null);

    } catch (err) {
      console.error(err);
      if (err.message.includes("Ve da check-in")) {
        setStatus("❌ Lỗi: Vé này đã check-in rồi, không thể bán lại!");
      } else {
        setStatus("❌ Lỗi: " + (err.reason || err.message));
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
      <h1 className="page-title">Ví Vé Của Tôi (Transfer)</h1>

      <div className="wallet-box">
        <p><strong>Ví đang kết nối:</strong> {account}</p>
        <p><strong>Số lượng vé tìm thấy:</strong> {myTickets.length}</p>
      </div>

      <div className="grid-layout" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        
        {/* CỘT TRÁI: DANH SÁCH VÉ */}
        <div className="section-box">
          <h2 className="section-title">🎫 Kho Vé Của Bạn</h2>
          {loading && <p>Đang tải dữ liệu...</p>}
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
            {myTickets.map((ticket) => (
              <div 
                key={ticket.id}
                onClick={() => !ticket.isUsed && setSelectedTokenId(ticket.id)}
                className={`ticket-card ${selectedTokenId === ticket.id ? 'selected' : ''}`}
                style={{
                  border: selectedTokenId === ticket.id ? '2px solid blue' : '1px solid #ddd',
                  padding: 10,
                  borderRadius: 8,
                  cursor: ticket.isUsed ? 'not-allowed' : 'pointer',
                  opacity: ticket.isUsed ? 0.6 : 1,
                  background: ticket.isUsed ? '#f0f0f0' : '#fff'
                }}
              >
                
                <h3 style={{margin: '5px 0'}}>Vé #{ticket.id}</h3>
                {ticket.isUsed ? (
                  <span style={{ color: 'red', fontWeight: 'bold', fontSize: '0.8rem' }}>ĐÃ DÙNG (KHOÁ)</span>
                ) : (
                  <span style={{ color: 'green', fontWeight: 'bold', fontSize: '0.8rem' }}>CÓ THỂ CHUYỂN</span>
                )}
              </div>
            ))}
          </div>
          
          {myTickets.length === 0 && !loading && <p>Bạn chưa có vé nào (trong phạm vi 20 ID đầu).</p>}
        </div>

        {/* CỘT PHẢI: FORM CHUYỂN VÉ */}
        <div className="section-box" style={{height: 'fit-content'}}>
          <h2 className="section-title">🚀 Chuyển Nhượng</h2>
          
          <div style={{marginBottom: 15}}>
            <label>Vé đang chọn:</label>
            <div style={{fontSize: '1.2rem', fontWeight: 'bold', color: '#3498db'}}>
              {selectedTokenId ? `#${selectedTokenId}` : "Chưa chọn"}
            </div>
          </div>

          <div style={{marginBottom: 15}}>
            <label>Địa chỉ người nhận:</label>
            <input 
              className="input" 
              placeholder="0x..." 
              value={transferTo}
              onChange={(e) => setTransferTo(e.target.value)}
            />
          </div>

          <button 
            onClick={handleTransfer}
            disabled={loading || !selectedTokenId}
            className="btn-warning"
            style={{width: '100%', padding: 10}}
          >
            {loading ? "Đang xử lý..." : "Gửi Vé Ngay"}
          </button>

          <p style={{marginTop: 15, fontSize: '0.9rem', color: '#666'}}>
            ℹ️ Lưu ý: Vé đã Check-in sẽ bị khóa vĩnh viễn (Soulbound), không thể chuyển nhượng.
          </p>
        </div>
      </div>

      <div className="status-box" style={{marginTop: 20}}>
        Trạng thái: {status}
      </div>
    </div>
  );
}