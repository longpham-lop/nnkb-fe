import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./MintAndTransferTicket.css";


// --- CONFIG - Thay bằng giá trị thật của bạn ---
const contractAddress = "0xE0132baf29CAFaF3aD3133ed0035EFab7b4DB359";
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
  console.log("Chain ID:", chainId);
  // Form / page data (some read from URL params)
  const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const initialEventId = params?.get("eventId") || "1";
  const initialPrice = params?.get("price") || "0.01"; // giá per ticket (ETH/MATIC)
  const initialQuantity = params?.get("quantity") || "1";

  const [eventId, setEventId] = useState(initialEventId);
  const [pricePerTicket, setPricePerTicket] = useState(initialPrice);
  const [quantity, setQuantity] = useState(initialQuantity);

  // UX state
  const [status, setStatus] = useState("");
  const [txHash, setTxHash] = useState("");
  const [lastTokenId, setLastTokenId] = useState(null);

  // Transfer form
  const [transferTokenId, setTransferTokenId] = useState("");
  const [transferTo, setTransferTo] = useState("");

  // Contract instance (signer connected)
  const [contract, setContract] = useState(null);

  // Connect wallet (MetaMask)
  async function connectWallet() {
    try {
      if (!window.ethereum) throw new Error("MetaMask not found. Install it first.");
      const _provider = new ethers.BrowserProvider(window.ethereum);
      await _provider.send("eth_requestAccounts", []);
      const _signer = await _provider.getSigner();
      const _account = await _signer.getAddress();
      const network = await _provider.getNetwork();
      setProvider(_provider);
      setSigner(_signer);
      setAccount(_account);
      setChainId(network.chainId);
      const _contract = new ethers.Contract(contractAddress, contractABI, _signer);
      setContract(_contract);
      setStatus("Wallet connected: " + _account);

      // listen for account/chain changes
      window.ethereum.on && window.ethereum.on("accountsChanged", (accounts) => {
        setAccount(accounts[0] || "");
      });
      window.ethereum.on && window.ethereum.on("chainChanged", () => window.location.reload());
    } catch (err) {
      console.error(err);
      setStatus("Connect failed: " + (err.message || err));
    }
  }

  // Mint NFT tickets (user pays value & gas via their wallet)
  async function handleMint() {
    try {
      if (!contract || !signer) throw new Error("Wallet not connected");
      setStatus("Preparing mint...");

      // Calculate total value
      const priceBN = ethers.parseEther(String(pricePerTicket));
      const totalValue = priceBN * BigInt(Number(quantity));

      setStatus("Sending transaction to mint...");
      // Assumes contract.mintTicket returns (optionally) tokenId or emits Transfer events
      const tx = await contract.mintTicket(BigInt(eventId), BigInt(quantity), {
        value: totalValue,
      });
      setStatus("Tx sent: waiting for confirmation...");
      setTxHash(tx.hash);

      const receipt = await tx.wait();
      setStatus("Transaction confirmed");

      // Try to parse Transfer event to get tokenId
      const iface = new ethers.Interface(contractABI);
      let foundTokenId = null;
      for (const log of receipt.logs) {
        try {
          const parsed = iface.parseLog(log);
          if (parsed && parsed.name === "Transfer") {
            // Transfer(from, to, tokenId)
            foundTokenId = parsed.args[2].toString();
            break;
          }
        } catch (e) {
          console.log("Error",e)
        }
      }

      if (foundTokenId) {
        setLastTokenId(foundTokenId);
        setStatus("Mint successful — tokenId: " + foundTokenId);

        // Send token data to backend for off-chain storage
        try {
          await fetch("/api/save-ticket", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              tokenId: foundTokenId,
              txHash: tx.hash,
              owner: account,
              eventId,
              quantity,
            }),
          });
        } catch (err) {
          console.warn("Failed to notify backend:", err);
        }
      } else {
        setStatus("Mint confirmed but couldn't parse tokenId from logs. See tx: " + tx.hash);
      }
    } catch (err) {
      console.error(err);
      setStatus("Mint failed: " + (err.message || err));
    }
  }

  // Transfer ticket (safeTransferFrom)
  async function handleTransfer() {
    try {
      if (!contract || !signer) throw new Error("Wallet not connected");
      if (!transferTokenId || !transferTo) throw new Error("tokenId and recipient required");
      setStatus("Sending transfer tx...");

      // We use safeTransferFrom(from, to, tokenId). Use signer as "from" implicitly.
      const userAddress = await signer.getAddress();
      const tx = await contract.safeTransferFrom(userAddress, transferTo, BigInt(transferTokenId));
      setStatus("Transfer tx sent... waiting confirmation");
      setTxHash(tx.hash);
      await tx.wait();
      setStatus("Transfer successful — tokenId " + transferTokenId + " → " + transferTo);

      // Optionally notify backend
      try {
        await fetch("/api/transfer-ticket", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tokenId: transferTokenId, from: userAddress, to: transferTo, txHash: tx.hash }),
        });
      } catch (err) {
        console.warn("Failed to notify backend of transfer:", err);
      }
    } catch (err) {
      console.error(err);
      setStatus("Transfer failed: " + (err.message || err));
    }
  }

  // Quick owner check helper
  async function checkOwner(tokenIdToCheck) {
    try {
      if (!provider) throw new Error("Provider missing");
      const readContract = new ethers.Contract(contractAddress, contractABI, provider);
      const owner = await readContract.ownerOf(BigInt(tokenIdToCheck));
      return owner;
    } catch (err) {
      console.warn(err);
      return null;
    }
  }

  useEffect(() => {
    if (window.ethereum && !provider) {
      // do nothing
    }
  }, []);

  return (
    <div className="page-container">
      <h1 className="page-title">Mint & Transfer NFT Ticket (Sophia)</h1>

      <div className="wallet-box">
        <button onClick={connectWallet} className="btn-primary">
          {account ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : "Connect MetaMask"}
        </button>
      </div>

      <section className="section-box">
        <h2 className="section-title">Mint Ticket</h2>
        <div className="grid-box">
          <label className="label-group">
            Event ID
            <input value={eventId} onChange={(e) => setEventId(e.target.value)} className="input" />
          </label>
          <label className="label-group">
            Price per ticket (ETH/MATIC)
            <input value={pricePerTicket} onChange={(e) => setPricePerTicket(e.target.value)} className="input" />
          </label>
          <label className="label-group">
            Quantity
            <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="input" />
          </label>
        </div>
        <div style={{ marginTop: 12 }}>
          <button onClick={handleMint} className="btn-success">Mint &amp; Pay</button>
        </div>
      </section>

      <section className="section-box">
        <h2 className="section-title">Transfer Ticket</h2>
        <div className="grid-box">
          <label className="label-group">
            Token ID
            <input value={transferTokenId} onChange={(e) => setTransferTokenId(e.target.value)} className="input" />
          </label>
          <label className="label-group">
            Recipient Address
            <input value={transferTo} onChange={(e) => setTransferTo(e.target.value)} className="input" />
          </label>
        </div>
        <div style={{ marginTop: 12 }}>
          <button onClick={handleTransfer} className="btn-warning">Transfer</button>
        </div>
      </section>

      <section className="section-box">
        <h2 className="section-title">Quick Owner Check</h2>
        <div className="owner-check-row">
          <input placeholder="Token ID to check" className="input" id="ownerCheckInput" />
          <button
            onClick={async () => {
              const tokenId = document.getElementById("ownerCheckInput").value;
              if (!tokenId) return setStatus("Enter tokenId");
              setStatus("Checking owner...");
              const owner = await checkOwner(tokenId);
              setStatus(owner ? `Owner: ${owner}` : "Not found / error");
            }}
            className="btn-secondary"
          >
            Check Owner
          </button>
        </div>
      </section>

      <div className="status-box">
        <div>Status: {status}</div>
        {txHash && (
          <div style={{ marginTop: 8 }}>
            Tx: <a className="link" href={`https://etherscan.io/tx/${txHash}`} target="_blank" rel="noreferrer">{txHash}</a>
          </div>
        )}
        {lastTokenId && <div style={{ marginTop: 8 }}>Last minted tokenId: {lastTokenId}</div>}
      </div>

      <div className="notes">
        <strong>Notes:</strong>
        <ul>
          <li>Thay <code>contractAddress</code> và <code>contractABI</code> bằng contract của bạn.</li>
          <li>Page giả định function <code>mintTicket(uint256 eventId, uint256 quantity)</code> tồn tại.</li>
          <li>Backend endpoints <code>/api/save-ticket</code> và <code>/api/transfer-ticket</code> là optional.</li>
        </ul>
      </div>
    </div>
  );
}