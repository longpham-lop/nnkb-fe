import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./MintAndTransferTicket.css"; // Nhớ import file CSS mới
import { createBlockTicket } from "../../api/blockTicket"; 

// --- CẤU HÌNH ---
const CONTRACT_ADDRESS = "0x6830550Aaf8484c64E0bb6B51247bAc1Bfda7a17"; 

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
  const [customEthPrice, setCustomEthPrice] = useState("0.001");
  const [checkInTokenId, setCheckInTokenId] = useState("");
  const [staffAddress, setStaffAddress] = useState("");
  const [checkTokenId, setCheckTokenId] = useState("");
  const [checkStatusRes, setCheckStatusRes] = useState(null);


  const connectWallet = async () => {
    if (!window.ethereum) return alert("Vui lòng cài đặt MetaMask!");
    
    try {
      const _provider = new ethers.BrowserProvider(window.ethereum);
      const _signer = await _provider.getSigner();
      const _account = await _signer.getAddress();

      setProvider(_provider);
      setSigner(_signer);
      setAccount(_account);

      checkRoles(_account, _provider);
      fetchBalance(_account, _provider);

      setStatus(`✅ Đã kết nối: ${_account.slice(0,6)}...${_account.slice(-4)}`);
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
      console.log("Không check được role");
    }
  };

  const fetchBalance = async (addr, prov) => {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, prov);
    const bal = await contract.balanceOf(addr);
    setMyBalance(bal.toString());
  };

  useEffect(() => { connectWallet(); }, []);

  // --- 2. MINT VÉ ---
  const handleMintCart = async () => {
    if (!signer) return alert("Vui lòng kết nối ví trước!");
    
    const cartRaw = localStorage.getItem("ticketsInCart");
    const cart = cartRaw ? JSON.parse(cartRaw) : [];
    if (cart.length === 0) return setStatus("⚠️ Giỏ hàng đang trống!");

    setIsProcessing(true);
    const orderId = localStorage.getItem("oderid") || `ORD-${Date.now()}`;
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    const totalQuantity = cart.reduce((sum, item) => sum + parseInt(item.quantity), 0);
    setStatus(`💸 Đang xử lý mua ${totalQuantity} vé...`);

    try {
      const pricePerTicket = ethers.parseEther(customEthPrice); 
      const totalValue = pricePerTicket * BigInt(totalQuantity);

      const tx = await contract.mintTicket(totalQuantity, {
        value: totalValue,
        gasLimit: 500000
      });

      setStatus("⏳ Đang xác nhận trên Blockchain...");
      const receipt = await tx.wait();

      // Xử lý Logs
      const iface = new ethers.Interface(CONTRACT_ABI);
      const mintedIds = [];
      
      receipt.logs.forEach((log) => {
        try {
          const parsed = iface.parseLog(log);
          if (parsed.name === "Transfer" && parsed.args.to === account) {
            mintedIds.push(parsed.args.tokenId.toString());
          }
        } catch(e) {/**/ }
      });

      // Lưu DB
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
                ticket_id: item.id,
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
      setStatus("🎉 Mua vé thành công! Đã lưu vé.");
      fetchBalance(account, provider);

    } catch (err) {
      console.error(err);
      if (err.message && err.message.includes("Khong du tien")) {
        setStatus("❌ Lỗi: Không đủ ETH để thanh toán!");
      } else {
        setStatus("❌ Lỗi Mint: " + (err.reason || "Đã có lỗi xảy ra"));
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // --- 3. CHECK-IN ---
  const handleCheckIn = async () => {
    if (!checkInTokenId) return alert("Vui lòng nhập Token ID");
    if (!isGatekeeper && !isAdmin) return alert("Không có quyền!");

    try {
      setIsProcessing(true);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      
      setStatus(`🔍 Đang kiểm tra vé #${checkInTokenId}...`);
      const tx = await contract.checkIn(checkInTokenId);
      
      setStatus("⏳ Đang ghi nhận...");
      await tx.wait();
      
      setStatus(`✅ Check-in THÀNH CÔNG vé #${checkInTokenId}.`);
      setCheckInTokenId("");
    } catch (err) {
      if (err.message.includes("Ve nay da duoc su dung")) {
        setStatus("⛔ CẢNH BÁO: Vé đã được sử dụng!");
      } else {
        setStatus("❌ Lỗi Check-in: " + (err.reason || "Lỗi không xác định"));
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // --- 4. ADMIN ACTIONS ---
  const handleWithdraw = async () => {
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const tx = await contract.withdraw();
      setStatus("⏳ Đang rút tiền...");
      await tx.wait();
      setStatus("💰 Rút tiền thành công!");
    } catch (err) {
      setStatus("❌ Lỗi rút tiền: " + err.reason);
    }
  };

  const handleGrantRole = async () => {
    if (!staffAddress) return;
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const tx = await contract.grantRole(GATEKEEPER_ROLE, staffAddress);
      setStatus("⏳ Đang cấp quyền...");
      await tx.wait();
      setStatus(`👮 Đã cấp quyền Gatekeeper cho ví ${staffAddress.slice(0,6)}...`);
    } catch (err) {
      setStatus("❌ Lỗi cấp quyền: " + err.reason);
    }
  };

  // --- 5. CHECK STATUS (PUBLIC) ---
  const handleCheckStatus = async () => {
    if (!checkTokenId) return;
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      const owner = await contract.ownerOf(checkTokenId);
      const isUsed = await contract.isTicketUsed(checkTokenId);
      
      setCheckStatusRes({ owner, isUsed });
      setStatus("Thông tin vé đã được tải.");
    } catch (err) {
      setCheckStatusRes(null);
      setStatus("❌ Vé không tồn tại hoặc lỗi mạng.");
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1 className="page-title">HỆ THỐNG BLOCKCHAIN</h1>
        <p className="page-subtitle">Hệ thống quản lý và xác thực vé phi tập trung</p>
      </header>

      {/* WALLET SECTION */}
      <div className="wallet-box">
        <div className="wallet-info">
          <h3>Trạng Thái Kết Nối</h3>
          {!account ? (
            <p>Chưa kết nối ví</p>
          ) : (
            <div>
              <p>
                <strong>Address:</strong> {account.slice(0, 6)}...{account.slice(-4)}
                {isAdmin && <span className="role-badge admin">Admin</span>}
                {isGatekeeper && <span className="role-badge gatekeeper">Staff</span>}
              </p>
              <p style={{marginTop: 4}}><strong>Vé sở hữu:</strong> {myBalance}</p>
            </div>
          )}
        </div>
        {!account && (
          <button onClick={connectWallet} className="btn btn-primary">
            Kết Nối MetaMask
          </button>
        )}
      </div>

      <div className="dashboard-grid">
        
        {/* SECTION 1: MINTING */}
        <section className="card">
          <div className="card-header">
            <h2 className="card-title">🛒 Thanh Toán Vé</h2>
          </div>
          
          <div className="form-group">
            <label className="label">Giá vé test (ETH):</label>
            <input 
              className="input" 
              type="number" 
              step="0.0001"
              value={customEthPrice}
              onChange={e => setCustomEthPrice(e.target.value)}
            />
            <small className="input-helper">Giá gốc SC: 0.001 ETH</small>
          </div>

          <button 
            onClick={handleMintCart} 
            disabled={isProcessing || !account}
            className="btn btn-success btn-block" 
          >
            {isProcessing ? "⏳ Đang xử lý..." : "🚀 Thanh Toán Giỏ Hàng"}
          </button>
        </section>

        {/* SECTION 2: CHECK PUBLIC STATUS */}
        <section className="card">
          <div className="card-header">
            <h2 className="card-title">🔍 Tra Cứu Vé</h2>
          </div>
          
          <div className="form-group" style={{display: 'flex', gap: '10px'}}>
            <input 
              className="input" 
              placeholder="Nhập ID vé (VD: 1)" 
              value={checkTokenId}
              onChange={e => setCheckTokenId(e.target.value)}
            />
            <button onClick={handleCheckStatus} className="btn btn-secondary">
              Check
            </button>
          </div>
          
          {checkStatusRes && (
            <div className="result-box">
              <p><strong>Chủ sở hữu:</strong> {checkStatusRes.owner.slice(0, 10)}...</p>
              <p>
                <strong>Trạng thái: </strong> 
                {checkStatusRes.isUsed ? (
                  <span className="status-tag used">ĐÃ DÙNG</span>
                ) : (
                  <span className="status-tag active">HỢP LỆ</span>
                )}
              </p>
            </div>
          )}
        </section>

      </div>

      {/* STAFF ZONE */}
      {(isGatekeeper || isAdmin) && (
        <section className="card special-zone gatekeeper">
          <div className="card-header">
            <h2 className="card-title">👮 Khu Vực Soát Vé (Check-in)</h2>
          </div>
          <div style={{display: 'flex', gap: '10px'}}>
            <input 
              className="input" 
              placeholder="Token ID cần soát..." 
              value={checkInTokenId}
              onChange={e => setCheckInTokenId(e.target.value)}
            />
            <button onClick={handleCheckIn} className="btn btn-warning" disabled={isProcessing}>
              Bấm Lỗ Vé
            </button>
          </div>
        </section>
      )}

      {/* ADMIN ZONE */}
      {isAdmin && (
        <section className="card special-zone admin">
          <div className="card-header">
            <h2 className="card-title">👑 Quản Trị Hệ Thống</h2>
          </div>
          
          <div className="admin-controls">
            <div className="control-column">
              <label className="label">Thêm Nhân Viên (Gatekeeper)</label>
              <div style={{display: 'flex', gap: '10px'}}>
                <input 
                  className="input" 
                  placeholder="Ví nhân viên (0x...)" 
                  value={staffAddress}
                  onChange={e => setStaffAddress(e.target.value)}
                />
                <button onClick={handleGrantRole} className="btn btn-primary">
                  Thêm
                </button>
              </div>
            </div>
            
            <div className="control-column" style={{borderLeft: '1px solid #e5e7eb', paddingLeft: '20px'}}>
              <label className="label">Quản Lý Doanh Thu</label>
              <p className="input-helper">Rút toàn bộ ETH trong contract về ví này.</p>
              <button onClick={handleWithdraw} className="btn btn-danger">
                💰 Rút Tiền Về Ví
              </button>
            </div>
          </div>
        </section>
      )}

      {/* STATUS BAR (Notification) */}
      {status && (
        <div className="status-bar">
          <span style={{fontSize: '1.2rem'}}>🔔</span>
          <span>{status}</span>
        </div>
      )}

    </div>
  );
}