import QRCode from "qrcode";

export async function generateNFTTicket(data) {
  const ticketId = "NFT-" + Date.now();

  const qrData = JSON.stringify({
    ticketId,
    event: data.eventName,
    buyer: data.buyer,
    tx: data.txHash,
    quantity: data.quantity,
  });

  const qrImage = await QRCode.toDataURL(qrData);

  return {
    id: ticketId,
    event: data.eventName,
    buyer: data.buyer,
    quantity: data.quantity,
    txHash: data.txHash,
    qr: qrImage,
    createdAt: new Date().toISOString(),
  };
}
