import "./WalletConnect.css";

import React, { useState } from "react";
import { ethers } from "ethers";

const WalletConnect = () => {
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Please install MetaMask!");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      console.log("Connected:", address);
      setAccount(address);
    } catch (err) {
      if (err.code === 4001) {
        console.warn("User rejected connection");
      } else {
        console.error("Connection error:", err);
      }
    }
  };

 
  
  
  const disconnectWallet = () => {
    // Just clear state (no on-chain disconnection)
    console.log("Disconnected");
    setAccount(null);
  };

  const handleClick = () => {
    if (account) {
      disconnectWallet();
    } else {
      connectWallet();
    }
  };

  return (
  <>
  <button className="wallet-connect-btn" onClick={handleClick}>
    {account ? `Connected: ${account.slice(0, 6)}...` : "Connect Wallet"}
  </button>

  {/* {account && (
    <button className="simulate-payment-btn" onClick={simulatePayment}>
      Simulate Payment
    </button>
  )} */}
</>

  );
};

export default WalletConnect;
