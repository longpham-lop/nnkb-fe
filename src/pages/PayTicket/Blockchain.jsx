import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./MintAndTransferTicket.css";

// --- CONFIG - Thay bằng giá trị thật của bạn ---
const contractAddress = "0x9167D3D0dEF21275e374b2A49a066741EF78aE2f"; // Địa chỉ mới nhất của bạn

const contractABI = [
  "function mintTicket(uint256 eventId, uint256 quantity) payable returns (uint256)",
  "function safeTransferFrom(address from, address to, uint256 tokenId)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
];

export default function MintAndTransferTicket() {
  // Wallet/chain state
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState("");
  const [chainId, setChainId] = useState(null);

  // Form / page data
  const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  
  const [eventId, setEventId] = useState(params?.get("eventId") || "1");
  const [pricePerTicket, setPricePerTicket] = useState(params?.get("price") || "0.01");
  const [quantity, setQuantity] = useState(params?.get("quantity") || "1");

  // UX state
  const [status, setStatus] = useState("");
  const [txHash, setTxHash] = useState("");
  const [lastTokenId, setLastTokenId] = useState(null);

  // Transfer form
  const [transferTokenId, setTransferTokenId] = useState("");
  const [transferTo, setTransferTo] = useState("");

  // Owner Check Form
  const [checkTokenId, setCheckTokenId] = useState("");

  // Contract instance
  const [contract, setContract] = useState(null);

  // Helper: Lấy URL Explorer dựa trên ChainID
  const getExplorerUrl = (hash) => {
    const baseUrl = chainId === 11155111n ? "https://sepolia.etherscan.io" : 
                    chainId === 137n ? "https://polygonscan.com" : 
                    chainId === 80001n ? "https://mumbai.polygonscan.com" :
                    "https://etherscan.io";
    return `${baseUrl}/tx/${hash}`;
  };

  // --- CONNECT WALLET (ĐÃ SỬA: BẮT BUỘC SEPOLIA) ---
  async function connectWallet() {
    try {
      if (!window.ethereum) throw new Error("MetaMask not found. Please install it.");
      
      // 1. Kết nối provider ban đầu
      const _provider = new ethers.BrowserProvider(window.ethereum);
      await _provider.send("eth_requestAccounts", []);
      
      // 2. Kiểm tra và Ép chuyển mạng sang Sepolia
      const network = await _provider.getNetwork();
      if (network.chainId !== 11155111n) {
          try {
            await window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: "0xaa36a7" }], // Mã Hex của Sepolia
            });
          } catch (switchError) {
            // Nếu chưa có mạng Sepolia thì báo lỗi (thường MetaMask mặc định đã có)
            throw new Error("Please switch to Sepolia network in MetaMask manually.");
          }
      }

      // 3. Lấy lại Provider và Signer sau khi đã chuyển mạng thành công
      const _providerFinal = new ethers.BrowserProvider(window.ethereum);
      const _signer = await _providerFinal.getSigner();
      const _account = await _signer.getAddress();
      const _networkFinal = await _providerFinal.getNetwork();
      
      // Log kiểm tra số dư
      const balance = await _providerFinal.getBalance(_account);
      console.log("Connected:", _account);
      console.log("Balance:", ethers.formatEther(balance));

      setProvider(_providerFinal);
      setSigner(_signer);
      setAccount(_account);
      setChainId(_networkFinal.chainId);

      const _contract = new ethers.Contract(contractAddress, contractABI, _signer);
      setContract(_contract);
      
      setStatus(`Wallet connected: ${_account}`);

      // Listeners
      if (window.ethereum.on) {
        window.ethereum.removeAllListeners(); 
        window.ethereum.on("accountsChanged", (accounts) => {
             setAccount(accounts[0] || "");
             window.location.reload();
        });
        window.ethereum.on("chainChanged", () => window.location.reload());
      }

    } catch (err) {
      console.error(err);
      setStatus("Connect failed: " + (err.message || err));
    }
  }

  // --- MINT FUNCTION (ĐÃ SỬA: THÊM GAS LIMIT) ---
  async function handleMint() {
    try {
      if (!contract || !signer) throw new Error("Please connect wallet first");
      setStatus("Preparing mint transaction...");
      setTxHash("");
      setLastTokenId(null);

      const priceBN = ethers.parseEther(String(pricePerTicket));
      const totalValue = priceBN * BigInt(Number(quantity));

      // Gửi transaction với Gas Limit thủ công để tránh lỗi estimate
      const tx = await contract.mintTicket(BigInt(eventId), BigInt(quantity), {
        value: totalValue,
        gasLimit: 300000, // <-- QUAN TRỌNG: Ép gas limit
      });
      
      setStatus("Tx sent. Waiting for confirmation...");
      setTxHash(tx.hash);

      const receipt = await tx.wait();
      setStatus("Transaction confirmed!");

      // Phân tích Logs
      const iface = new ethers.Interface(contractABI);
      let foundTokenId = null;
      
      for (const log of receipt.logs) {
        try {
          const parsed = iface.parseLog({ topics: [...log.topics], data: log.data });
          if (parsed && parsed.name === "Transfer") {
            foundTokenId = parsed.args[2].toString();
            break;
          }
        } catch (e) {}
      }

      if (foundTokenId) {
        setLastTokenId(foundTokenId);
        setStatus(`Mint successful! Token ID: ${foundTokenId}`);
        notifyBackendMint(foundTokenId, tx.hash);
      } else {
        setStatus("Mint confirmed but Token ID not found in logs.");
      }

    } catch (err) {
      console.error("Mint error:", err);
      if (err.code === "ACTION_REJECTED") {
        setStatus("Transaction rejected by user.");
      } else {
        setStatus("Mint failed: " + (err.reason || err.message));
      }
    }
  }

  // --- TRANSFER FUNCTION ---
  async function handleTransfer() {
    try {
      if (!contract || !signer) throw new Error("Wallet not connected");
      if (!transferTokenId || !transferTo) throw new Error("Missing Token ID or Recipient");
      if (!ethers.isAddress(transferTo)) throw new Error("Invalid recipient address");

      setStatus("Preparing transfer...");
      const userAddress = await signer.getAddress();

      const tx = await contract["safeTransferFrom(address,address,uint256)"](
        userAddress, 
        transferTo, 
        BigInt(transferTokenId),
        { gasLimit: 100000 } // Thêm gas limit cho chắc ăn
      );

      setStatus("Transfer tx sent. Waiting...");
      setTxHash(tx.hash);
      
      await tx.wait();
      setStatus(`Transfer successful: Token ${transferTokenId} -> ${transferTo}`);
      notifyBackendTransfer(transferTokenId, userAddress, transferTo, tx.hash);

    } catch (err) {
      console.error("Transfer error:", err);
      if (err.code === "ACTION_REJECTED") {
        setStatus("Transfer rejected by user.");
      } else {
        setStatus("Transfer failed: " + (err.reason || err.message || err));
      }
    }
  }

  // --- CHECK OWNER FUNCTION ---
  async function handleCheckOwner() {
    if (!checkTokenId) {
      setStatus("Please enter a Token ID to check.");
      return;
    }
    try {
      setStatus(`Checking owner of ID ${checkTokenId}...`);
      if (!provider) throw new Error("Please connect wallet to read data.");
      
      const readContract = new ethers.Contract(contractAddress, contractABI, provider);
      const owner = await readContract.ownerOf(BigInt(checkTokenId));
      
      setStatus(`Owner of #${checkTokenId}: ${owner}`);
    } catch (err) {
      console.warn(err);
      setStatus("Check failed (Token may not exist or error).");
    }
  }

  // --- BACKEND API HELPERS ---
  const notifyBackendMint = async (tokenId, txHash) => {
    try {
      await fetch("/api/save-ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            tokenId, txHash, owner: account, eventId, quantity 
        }),
      });
    } catch (e) { console.warn("API error", e); }
  };

  const notifyBackendTransfer = async (tokenId, from, to, txHash) => {
    try {
      await fetch("/api/transfer-ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tokenId, from, to, txHash }),
      });
    } catch (e) { console.warn("API error", e); }
  };

  useEffect(() => {
    // Auto connect logic removed for simplicity/safety, user clicks button
  }, []);

  return (
    <div className="page-container">
      <h1 className="page-title">Mint & Transfer NFT Ticket</h1>

      <div className="wallet-box">
        <button onClick={connectWallet} className="btn-primary">
          {account 
            ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` 
            : "Connect MetaMask (Sepolia)"}
        </button>
        {chainId && <span className="chain-info"> Chain ID: {chainId.toString()}</span>}
      </div>

      {/* MINT SECTION */}
      <section className="section-box">
        <h2 className="section-title">1. Mint Ticket</h2>
        <div className="grid-box">
          <label className="label-group">
            Event ID
            <input 
                value={eventId} 
                onChange={(e) => setEventId(e.target.value)} 
                className="input" 
                type="number"
            />
          </label>
          <label className="label-group">
            Price (ETH)
            <input 
                value={pricePerTicket} 
                onChange={(e) => setPricePerTicket(e.target.value)} 
                className="input" 
            />
          </label>
          <label className="label-group">
            Quantity
            <input 
                type="number" 
                value={quantity} 
                onChange={(e) => setQuantity(e.target.value)} 
                className="input" 
            />
          </label>
        </div>
        <div style={{ marginTop: 12 }}>
          <button 
            onClick={handleMint} 
            className="btn-success"
            disabled={!account}
          >
            Mint Ticket
          </button>
        </div>
      </section>

      {/* TRANSFER SECTION */}
      <section className="section-box">
        <h2 className="section-title">2. Transfer Ticket</h2>
        <div className="grid-box">
          <label className="label-group">
            Token ID
            <input 
                value={transferTokenId} 
                onChange={(e) => setTransferTokenId(e.target.value)} 
                className="input" 
                type="number"
            />
          </label>
          <label className="label-group">
            Recipient Address (0x...)
            <input 
                value={transferTo} 
                onChange={(e) => setTransferTo(e.target.value)} 
                className="input" 
                placeholder="0x123..."
            />
          </label>
        </div>
        <div style={{ marginTop: 12 }}>
          <button 
            onClick={handleTransfer} 
            className="btn-warning"
            disabled={!account}
          >
            Transfer
          </button>
        </div>
      </section>

      {/* CHECK OWNER SECTION */}
      <section className="section-box">
        <h2 className="section-title">3. Check Owner</h2>
        <div className="owner-check-row">
          <input 
            value={checkTokenId}
            onChange={(e) => setCheckTokenId(e.target.value)}
            placeholder="Enter Token ID" 
            className="input" 
            type="number"
          />
          <button onClick={handleCheckOwner} className="btn-secondary">
            Check
          </button>
        </div>
      </section>

      {/* STATUS & LOGS */}
      <div className="status-box">
        <div style={{ fontWeight: "bold" }}>Status:</div>
        <div style={{ marginBottom: 10, color: "#333" }}>{status}</div>
        
        {txHash && (
          <div style={{ marginTop: 8 }}>
            Transaction: <a className="link" href={getExplorerUrl(txHash)} target="_blank" rel="noreferrer">View on Explorer</a>
          </div>
        )}
        
        {lastTokenId && (
          <div className="success-highlight">
             🎉 Minted Token ID: <strong>{lastTokenId}</strong>
          </div>
        )}
      </div>
    </div>
  );
}