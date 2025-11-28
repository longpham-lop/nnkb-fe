import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./MintAndTransferTicket.css"; // Giữ nguyên file CSS cũ của bạn
import { createBlockTicket } from "../../api/blockTicket"; 

// --- CẤU HÌNH ---
// ⚠️ Thay địa chỉ Contract MỚI NHẤT của bạn vào đây
const CONTRACT_ADDRESS = "0x6830550Aaf8484c64E0bb6B51247bAc1Bfda7a17"; 

// ABI MỚI (Khớp với Smart Contract SophiaEventTicket đã sửa)
const CONTRACT_ABI = [
  "function mintTicket(uint256 quantity) payable",
  "function checkIn(uint256 tokenId)",
  "function withdraw()",
  "function isTicketUsed(uint256 tokenId) view returns (bool)",
  "function safeTransferFrom(address from, address to, uint256 tokenId)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function balanceOf(address owner) view returns (uint256)",
  "function hasRole(bytes32 role, address account) view returns (bool)",
  "function grantRole(bytes32 role, address account)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
  "event TicketCheckedIn(uint256 indexed tokenId, address indexed checkedBy, uint256 timestamp)"
];

// Mã Hash của Role (Tính sẵn để đỡ phải tính lại)
const GATEKEEPER_ROLE = ethers.id("GATEKEEPER_ROLE");
const DEFAULT_ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";

export default function TicketSystem() {
  // --- STATE ---
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState("");
  const [myBalance, setMyBalance] = useState("0");
  
  // Roles
  const [isGatekeeper, setIsGatekeeper] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // UI State
  const [status, setStatus] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Inputs
  const [customEthPrice, setCustomEthPrice] = useState("0.001"); // Để test chỉnh giá
  const [checkInTokenId, setCheckInTokenId] = useState("");
  const [staffAddress, setStaffAddress] = useState(""); // Để cấp quyền
  const [transferTokenId, setTransferTokenId] = useState("");
  const [transferTo, setTransferTo] = useState("");
  const [checkTokenId, setCheckTokenId] = useState("");
  const [checkStatusRes, setCheckStatusRes] = useState(null);

  // --- 1. KẾT NỐI VÍ ---
  const connectWallet = async () => {
    if (!window.ethereum) return alert("Cài MetaMask đi bạn ơi!");
    
    try {
      const _provider = new ethers.BrowserProvider(window.ethereum);
      const _signer = await _provider.getSigner();
      const _account = await _signer.getAddress();

      setProvider(_provider);
      setSigner(_signer);
      setAccount(_account);

      // Check quyền hạn & Số dư
      checkRoles(_account, _provider);
      fetchBalance(_account, _provider);

      setStatus(`✅ Đã kết nối: ${_account.slice(0,6)}...`);
    } catch (err) {
      console.error(err);
      setStatus("Lỗi kết nối: " + err.message);
    }
  };

  const checkRoles = async (userAddress, prov) => {
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, prov);
      const _isGatekeeper = await contract.hasRole(GATEKEEPER_ROLE, userAddress);
      const _isAdmin = await contract.hasRole(DEFAULT_ADMIN_ROLE, userAddress);
      
      setIsGatekeeper(_isGatekeeper);
      setIsAdmin(_isAdmin);
    } catch (e) {
      console.log("Không check được role (có thể do sai mạng)");
    }
  };

  const fetchBalance = async (addr, prov) => {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, prov);
    const bal = await contract.balanceOf(addr);
    setMyBalance(bal.toString());
  };

  useEffect(() => { connectWallet(); }, []);


  // --- 2. MINT VÉ (THANH TOÁN) ---
  const handleMintCart = async () => {
    if (!signer) return alert("Kết nối ví trước!");
    
    // Lấy giỏ hàng từ LocalStorage
    const cartRaw = localStorage.getItem("ticketsInCart");
    const cart = cartRaw ? JSON.parse(cartRaw) : [];
    if (cart.length === 0) return setStatus("⚠️ Giỏ hàng trống!");

    setIsProcessing(true);
    const orderId = localStorage.getItem("oderid") || `ORD-${Date.now()}`;
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    // Tính tổng số lượng vé trong giỏ
    const totalQuantity = cart.reduce((sum, item) => sum + parseInt(item.quantity), 0);
    
    setStatus(`💸 Đang mua tổng ${totalQuantity} vé...`);

    try {
      // Tính tiền: (Giá nhập từ Client để test) * Tổng số lượng
      const pricePerTicket = ethers.parseEther(customEthPrice); 
      const totalValue = pricePerTicket * BigInt(totalQuantity);

      // GỌI SMART CONTRACT (Chỉ truyền quantity, contract mới đã bỏ eventId)
      const tx = await contract.mintTicket(totalQuantity, {
        value: totalValue, // Gửi ETH theo
        gasLimit: 500000
      });

      setStatus("⏳ Đang xác nhận trên Blockchain...");
      const receipt = await tx.wait();

      // --- XỬ LÝ LOG ĐỂ LẤY TOKEN ID ---
      // Logic: Lấy tất cả Token ID vừa được mint ra từ event Transfer
      const iface = new ethers.Interface(CONTRACT_ABI);
      const mintedIds = [];
      
      receipt.logs.forEach((log) => {
        try {
          const parsed = iface.parseLog(log);
          if (parsed.name === "Transfer" && parsed.args.to === account) {
            mintedIds.push(parsed.args.tokenId.toString());
          }
        } catch(e) {}
      });

      // --- LƯU DB BACKEND ---
      // Map ngược lại: Vé đầu tiên trong DB ứng với ID đầu tiên trong mảng mintedIds
      let idCounter = 0;
      const savePromises = [];

      for (const item of cart) {
        for (let k = 0; k < item.quantity; k++) {
          if (idCounter < mintedIds.length) {
            const tokenId = mintedIds[idCounter];
            savePromises.push(createBlockTicket({
                ticket_unique_id: `${item.id}_${orderId}_${tokenId}`,
                token_id: tokenId,
                order_id: orderId,
                ticket_id: item.id, // Event ID lưu ở DB
                quantity: 1,
                unit_price: item.price,
                tx_hash: tx.hash,
                wallet_address: account,
            }));
            idCounter++;
          }
        }
      }

      await Promise.all(savePromises);
      setStatus("🎉 Mua vé thành công! Đã lưu vào DB.");
      fetchBalance(account, provider);
      // localStorage.removeItem("ticketsInCart"); // Xóa giỏ nếu muốn

    } catch (err) {
      console.error(err);
      // Nếu lỗi do thiếu tiền (revert từ contract)
      if (err.message.includes("Khong du tien")) {
        setStatus("❌ Lỗi: Bạn gửi thiếu tiền ETH rồi!");
      } else {
        setStatus("❌ Lỗi Mint: " + (err.reason || err.message));
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // --- 3. CHECK-IN (DÀNH CHO GATEKEEPER) ---
  const handleCheckIn = async () => {
    if (!checkInTokenId) return alert("Nhập ID vé cần soát");
    if (!isGatekeeper && !isAdmin) return alert("Bạn không có quyền soát vé!");

    try {
      setIsProcessing(true);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      
      setStatus(`🔍 Đang soát vé #${checkInTokenId}...`);
      const tx = await contract.checkIn(checkInTokenId);
      
      setStatus("⏳ Đang ghi nhận Check-in...");
      await tx.wait();
      
      setStatus(`✅ Check-in THÀNH CÔNG vé #${checkInTokenId}. Mời khách vào!`);
      setCheckInTokenId("");
    } catch (err) {
      console.error(err);
      if (err.message.includes("Ve nay da duoc su dung")) {
        setStatus("⛔ CẢNH BÁO: Vé này đã dùng rồi! Đuổi về ngay.");
      } else if (err.message.includes("AccessControl")) {
        setStatus("⛔ Lỗi: Ví này không có quyền soát vé.");
      } else {
        setStatus("❌ Lỗi: " + (err.reason || "Không xác định"));
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // --- 4. ADMIN: RÚT TIỀN ---
  const handleWithdraw = async () => {
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const tx = await contract.withdraw();
      setStatus("⏳ Đang rút tiền về ví...");
      await tx.wait();
      setStatus("💰 Rút tiền thành công!");
    } catch (err) {
      setStatus("❌ Lỗi rút tiền: " + err.reason);
    }
  };

  // --- 5. ADMIN: CẤP QUYỀN NHÂN VIÊN ---
  const handleGrantRole = async () => {
    if (!staffAddress) return;
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const tx = await contract.grantRole(GATEKEEPER_ROLE, staffAddress);
      setStatus("⏳ Đang cấp quyền...");
      await tx.wait();
      setStatus(`👮 Đã cấp quyền Soát vé cho ${staffAddress}`);
    } catch (err) {
      setStatus("❌ Lỗi cấp quyền: " + err.reason);
    }
  };

  // --- 6. KIỂM TRA TRẠNG THÁI VÉ (PUBLIC) ---
  const handleCheckStatus = async () => {
    if (!checkTokenId) return;
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      const owner = await contract.ownerOf(checkTokenId);
      const isUsed = await contract.isTicketUsed(checkTokenId);
      
      setCheckStatusRes({ owner, isUsed });
      setStatus("Đã lấy thông tin vé.");
    } catch (err) {
      setCheckStatusRes(null);
      setStatus("❌ Vé không tồn tại.");
    }
  };

  // --- UI RENDER ---
  return (
    <div className="page-container">
      <h1 className="page-title">Hệ Thống Vé Blockchain Demo</h1>

      {/* WALLET INFO */}
      <div className="wallet-box">
        {!account ? (
          <button onClick={connectWallet} className="btn-primary">Kết Nối Ví Admin/User</button>
        ) : (
          <div style={{textAlign:'left', paddingLeft: 20}}>
            <p><strong>Ví:</strong> {account} {isAdmin && "👑 ADMIN"} {isGatekeeper && "👮 STAFF"}</p>
            <p><strong>Số dư vé của tôi:</strong> {myBalance} ticket</p>
          </div>
        )}
      </div>

      <div className="grid-layout" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:20}}>
        
        {/* CỘT 1: KHÁCH HÀNG MUA VÉ */}
        <section className="section-box">
          <h2 className="section-title">🛒 Khách Hàng: Thanh Toán</h2>
          
          <div style={{marginBottom:10}}>
             <label>Giá vé (ETH) - Chỉnh để test:</label>
             <input 
               className="input" 
               type="number" 
               step="0.0001"
               value={customEthPrice}
               onChange={e => setCustomEthPrice(e.target.value)}
             />
             <small style={{display:'block', color:'#666'}}>Giá gốc trong contract là 0.001. Thử chỉnh thấp hơn xem có lỗi không?</small>
          </div>

          <button 
            onClick={handleMintCart} 
            disabled={isProcessing || !account}
            className="btn-success" 
            style={{width:'100%', padding:15}}
          >
            {isProcessing ? "⏳ Đang xử lý..." : "🚀 Mua Giỏ Hàng"}
          </button>
        </section>

        {/* CỘT 2: KIỂM TRA VÉ (PUBLIC) */}
        <section className="section-box">
          <h2 className="section-title">🔍 Kiểm tra Vé</h2>
          <div style={{display:'flex', gap:10}}>
            <input 
              className="input" 
              placeholder="ID Vé (VD: 1)" 
              value={checkTokenId}
              onChange={e => setCheckTokenId(e.target.value)}
            />
            <button onClick={handleCheckStatus} className="btn-secondary">Check</button>
          </div>
          
          {checkStatusRes && (
            <div style={{marginTop:10, padding:10, background:'#eee', borderRadius:5}}>
              <p><strong>Chủ sở hữu:</strong> {checkStatusRes.owner.slice(0,10)}...</p>
              <p>
                <strong>Trạng thái: </strong> 
                {checkStatusRes.isUsed ? (
                  <span style={{color:'red', fontWeight:'bold'}}>ĐÃ SỬ DỤNG (USED)</span>
                ) : (
                  <span style={{color:'green', fontWeight:'bold'}}>CÓ HIỆU LỰC (ACTIVE)</span>
                )}
              </p>
            </div>
          )}
        </section>

      </div>

      {/* KHU VỰC NHÂN VIÊN SOÁT VÉ (Ẩn nếu không có quyền) */}
      {(isGatekeeper || isAdmin) && (
        <section className="section-box" style={{marginTop:20, border:'2px solid #e67e22'}}>
          <h2 className="section-title" style={{color:'#e67e22'}}>👮 Khu Vực Soát Vé (Gatekeeper)</h2>
          <p>Chức năng này chỉ hiện lên nếu ví của bạn có quyền Gatekeeper.</p>
          
          <div style={{display:'flex', gap:10}}>
            <input 
              className="input" 
              placeholder="Nhập Token ID cần soát (Quét QR)" 
              value={checkInTokenId}
              onChange={e => setCheckInTokenId(e.target.value)}
            />
            <button onClick={handleCheckIn} className="btn-warning" disabled={isProcessing}>
              CHECK-IN (Bấm lỗ)
            </button>
          </div>
        </section>
      )}

      {/* KHU VỰC ADMIN (Ẩn nếu không phải Admin) */}
      {isAdmin && (
        <section className="section-box" style={{marginTop:20, border:'2px solid #c0392b'}}>
          <h2 className="section-title" style={{color:'#c0392b'}}>👑 Khu Vực Admin</h2>
          
          <div style={{display:'flex', gap:20, alignItems:'flex-start'}}>
            <div style={{flex:1}}>
              <h3>Thêm Nhân Viên Soát Vé</h3>
              <input 
                className="input" 
                placeholder="Địa chỉ ví nhân viên (0x...)" 
                value={staffAddress}
                onChange={e => setStaffAddress(e.target.value)}
              />
              <button onClick={handleGrantRole} className="btn-secondary" style={{marginTop:5}}>
                Cấp Quyền
              </button>
            </div>
            
            <div style={{flex:1, borderLeft:'1px solid #ccc', paddingLeft:20}}>
              <h3>Doanh Thu</h3>
              <p>Tiền đang nằm trong Smart Contract.</p>
              <button onClick={handleWithdraw} className="btn-primary">
                💰 Rút Toàn Bộ Về Ví Này
              </button>
            </div>
          </div>
        </section>
      )}

      {/* STATUS BAR */}
      <div className="status-box" style={{marginTop:20, padding:15, background:'#333', color:'#fff', borderRadius:5}}>
        <strong>Thông báo hệ thống:</strong> {status}
      </div>

    </div>
  );
}