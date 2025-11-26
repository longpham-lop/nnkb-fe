import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./MintAndTransferTicket.css";
import { createBlockTicket } from "../../api/blockTicket"; // Đảm bảo đường dẫn API đúng

// --- CẤU HÌNH ---
const CONTRACT_ADDRESS = "0x9167D3D0dEF21275e374b2A49a066741EF78aE2f";
const FIXED_PRICE_ETH = "0.001"; // <--- CỐ ĐỊNH GIÁ 0.001 ETH TẠI ĐÂY

const CONTRACT_ABI = [
  "function mintTicket(uint256 eventId, uint256 quantity) payable returns (uint256)",
  "function safeTransferFrom(address from, address to, uint256 tokenId)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function balanceOf(address owner) view returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
];

export default function TicketManagerFixedPrice() {
  // --- STATE ---
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState("");
  const [myBalance, setMyBalance] = useState("0");
  
  // UI State
  const [status, setStatus] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Transfer & Check State
  const [transferTokenId, setTransferTokenId] = useState("");
  const [transferTo, setTransferTo] = useState("");
  const [checkTokenId, setCheckTokenId] = useState("");

  // --- 1. KẾT NỐI VÍ & CHECK MẠNG ---
  const connectWallet = async (silent = false) => {
    try {
      if (!window.ethereum) {
        if (!silent) alert("Vui lòng cài MetaMask!");
        return;
      }

      const _provider = new ethers.BrowserProvider(window.ethereum);
      
      // Silent mode: Chỉ lấy account nếu đã connect từ trước
      if (silent) {
        const accounts = await _provider.listAccounts();
        if (accounts.length === 0) return;
      } else {
        await _provider.send("eth_requestAccounts", []);
      }

      // Ép mạng Sepolia (ChainId: 11155111)
      const network = await _provider.getNetwork();
      if (network.chainId !== 11155111n) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0xaa36a7" }],
          });
        } catch (e) {
          console.warn("Switch network failed", e);
        }
      }

      const _signer = await _provider.getSigner();
      const _account = await _signer.getAddress();

      setProvider(_provider);
      setSigner(_signer);
      setAccount(_account);
      
      // Lấy số dư vé ngay
      fetchBalance(_account, _provider);
      
      if (!silent) setStatus(`✅ Đã kết nối: ${_account}`);
    } catch (err) {
      console.error(err);
      if (!silent) setStatus("Lỗi kết nối: " + err.message);
    }
  };

  const fetchBalance = async (addr, prov) => {
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, prov);
      const bal = await contract.balanceOf(addr);
      setMyBalance(bal.toString());
    } catch (e) {
      console.log("Lỗi đọc balance (có thể do chưa connect)");
    }
  };

  useEffect(() => {
    connectWallet(true);
  }, []);

  // --- 2. XỬ LÝ MINT GIỎ HÀNG (QUAN TRỌNG NHẤT) ---
  const handleMintCart = async () => {
    if (!signer) return alert("Vui lòng kết nối ví!");
    
    // Lấy giỏ hàng
    const cartRaw = localStorage.getItem("ticketsInCart");
    const cart = cartRaw ? JSON.parse(cartRaw) : [];
    
    if (cart.length === 0) {
      setStatus("⚠️ Giỏ hàng trống!");
      return;
    }

    setIsProcessing(true);
    const orderId = localStorage.getItem("oderid") || `ORD-${Date.now()}`;

    // B1: GOM NHÓM (Để tránh mint lẻ tẻ nếu có 2 dòng cùng ID)
    const grouped = cart.reduce((acc, item) => {
      const key = item.id;
      if (!acc[key]) acc[key] = { ...item, totalQty: 0 };
      acc[key].totalQty += parseInt(item.quantity);
      return acc;
    }, {});

    const queue = Object.values(grouped); // Biến thành mảng để lặp
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    const iface = new ethers.Interface(CONTRACT_ABI);

    let successCount = 0;

    try {
      // B2: VÒNG LẶP MINT TỪNG LOẠI VÉ
      for (let i = 0; i < queue.length; i++) {
        const item = queue[i];
        const { id: eventId, totalQty, name } = item; // name, price gốc trong JSON chỉ để hiển thị/lưu DB

        setStatus(`🔔 [${i + 1}/${queue.length}] Đang mua ${totalQty} vé "${name}" (ID: ${eventId})...`);

        try {
          // TÍNH GIÁ: 0.001 * Số lượng (Bất kể giá gốc là bao nhiêu)
          const priceWei = ethers.parseEther(FIXED_PRICE_ETH); 
          const totalValue = priceWei * BigInt(totalQty);

          // Gửi Transaction
          const tx = await contract.mintTicket(eventId, totalQty, {
            value: totalValue,
            gasLimit: 500000, // Gas dư dả chút cho an toàn
          });

          setStatus(`⏳ [${i + 1}/${queue.length}] Chờ xác nhận Tx...`);
          const receipt = await tx.wait();

          // Lọc Log để lấy Token ID
          const mintedTokenIds = [];
          for (const log of receipt.logs) {
            try {
              const parsed = iface.parseLog(log);
              if (parsed.name === "Transfer" && parsed.args.to === account) {
                mintedTokenIds.push(parsed.args.tokenId.toString());
              }
            } catch (e) {}
          }

          // Fallback cho ERC721A (Nếu chỉ trả về 1 Log gộp)
          if (mintedTokenIds.length === 1 && totalQty > 1) {
            const startId = BigInt(mintedTokenIds[0]);
            for (let k = 1; k < totalQty; k++) {
              mintedTokenIds.push((startId + BigInt(k)).toString());
            }
          }

          // Lưu DB Backend
          const savePromises = mintedTokenIds.map((tokenId, idx) => 
            createBlockTicket({
                ticket_unique_id: `${eventId}_${orderId}_${tokenId}`,
                token_id: tokenId,
                order_id: orderId,
                ticket_id: eventId,
                quantity: 1,
                unit_price: item.price, // Lưu giá gốc VND vào DB để đối soát
                tx_hash: tx.hash,
                wallet_address: account,
                
            })
          );
          
          await Promise.all(savePromises);
          successCount++;
          console.log(`✅ Xong ID ${eventId}`);

        } catch (subError) {
          console.error(`Lỗi Mint ID ${eventId}`, subError);
          // Hỏi user có muốn tiếp tục không, hoặc tự động skip
          const cont = window.confirm(`Lỗi khi mua vé "${name}". Bạn có muốn thử tiếp các vé còn lại không?`);
          if (!cont) break; 
        }
      }

      // Kết thúc vòng lặp
      if (successCount === queue.length) {
        setStatus("🎉 Đã thanh toán xong toàn bộ giỏ hàng!");
        // localStorage.removeItem("ticketsInCart"); // Mở dòng này nếu muốn xóa giỏ
        fetchBalance(account, provider); // Cập nhật số dư hiển thị
      } else {
        setStatus(`⚠️ Hoàn tất ${successCount}/${queue.length} loại vé.`);
      }

    } catch (err) {
      console.error(err);
      setStatus("❌ Lỗi hệ thống: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // --- 3. CHUYỂN NHƯỢNG ---
  const handleTransfer = async () => {
    if (!signer) return alert("Chưa kết nối ví");
    if (!transferTokenId || !transferTo) return alert("Thiếu thông tin");

    try {
      setStatus(`🚀 Đang chuyển Token #${transferTokenId}...`);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const tx = await contract["safeTransferFrom(address,address,uint256)"](
        account, transferTo, transferTokenId, { gasLimit: 200000 }
      );
      await tx.wait();
      setStatus(`✅ Chuyển thành công #${transferTokenId}!`);
      fetchBalance(account, provider); // Trừ số dư
    } catch (err) {
      setStatus("❌ Lỗi chuyển: " + (err.reason || err.message));
    }
  };

  // --- 4. CHECK OWNER ---
  const handleCheckOwner = async () => {
    if (!checkTokenId) return;
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      setStatus(`🔍 Đang check #${checkTokenId}...`);
      const owner = await contract.ownerOf(checkTokenId);
      setStatus(`👤 Chủ sở hữu #${checkTokenId}: ${owner}`);
    } catch (err) {
      setStatus("❌ Token không tồn tại hoặc lỗi mạng.");
    }
  };

  // --- GIAO DIỆN ---
  return (
    <div className="page-container">
      <h1 className="page-title">Cổng Thanh Toán Vé NFT</h1>

      {/* INFO BOX */}
      <div className="wallet-box">
        {!account ? (
          <button onClick={() => connectWallet(false)} className="btn-primary">Kết Nối MetaMask</button>
        ) : (
          <div style={{ textAlign: "left", paddingLeft: 20 }}>
            <div style={{ color: "green", fontWeight: "bold" }}>● Online: {account.slice(0,6)}...{account.slice(-4)}</div>
            <div style={{ fontSize: "1.4rem", marginTop: 5 }}>
              🎫 Số dư vé của bạn: <strong>{myBalance}</strong>
            </div>
          </div>
        )}
      </div>

      {/* MAIN ACTIONS */}
      <div className="grid-layout" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        
        {/* CỘT TRÁI: MINT CART */}
        <section className="section-box">
          <h2 className="section-title">1. Thanh Toán Giỏ Hàng</h2>
          <div style={{ marginBottom: 15, padding: 10, background: "#f0f8ff", borderRadius: 8 }}>
            ℹ️ Phí cố định: <strong>{FIXED_PRICE_ETH} ETH / vé</strong>
          </div>
          <button 
            onClick={handleMintCart} 
            disabled={!account || isProcessing}
            className={`btn-success ${isProcessing ? "disabled" : ""}`}
            style={{ width: "100%", padding: "15px", fontSize: "1.1rem" }}
          >
            {isProcessing ? "⏳ Đang xử lý giao dịch..." : "🚀 Mua Toàn Bộ Giỏ Hàng"}
          </button>
        </section>

        {/* CỘT PHẢI: TRANSFER */}
        <section className="section-box">
          <h2 className="section-title">2. Chuyển Vé (Tặng)</h2>
          <input 
            className="input" type="number" placeholder="Token ID (VD: 105)"
            value={transferTokenId} onChange={(e) => setTransferTokenId(e.target.value)}
          />
          <input 
            className="input" placeholder="Địa chỉ người nhận (0x...)"
            value={transferTo} onChange={(e) => setTransferTo(e.target.value)}
            style={{ marginTop: 10 }}
          />
          <button onClick={handleTransfer} className="btn-warning" style={{ marginTop: 10, width: "100%" }}>
            Gửi Vé
          </button>
        </section>
      </div>

      {/* CHECK OWNER SECTION */}
      <section className="section-box" style={{ marginTop: 20 }}>
        <h2 className="section-title">3. Kiểm Tra Vé</h2>
        <div style={{ display: "flex", gap: 10 }}>
          <input 
            className="input" type="number" placeholder="Nhập Token ID để kiểm tra"
            value={checkTokenId} onChange={(e) => setCheckTokenId(e.target.value)}
            style={{ flex: 1 }}
          />
          <button onClick={handleCheckOwner} className="btn-secondary">Kiểm tra</button>
        </div>
      </section>

      {/* STATUS BAR */}
      <div className="status-box">
        <strong>Trạng thái hệ thống:</strong>
        <p style={{ margin: "5px 0 0 0", color: isProcessing ? "#e67e22" : "#333" }}>
          {status || "Sẵn sàng."}
        </p>
      </div>
    </div>
  );
}