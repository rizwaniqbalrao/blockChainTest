import "./DeliveryAddress.css";
import { useUserData } from "../../../../contexts/UserDataProvider.js";
import { v4 as uuid } from "uuid";
import { ethers } from "ethers";

import React from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "../../../../contexts/AuthProvider.js";
import { useNavigate } from "react-router-dom";

export const DeliveryAddress = () => {
  const { userDataState, dispatch, clearCartHandler } = useUserData();

  const {
    cartProducts,
    addressList,
    orderDetails: { cartItemsDiscountTotal, orderAddress },
  } = userDataState;

  const KEY_ID = "rzp_test_VAxHG0Dkcr9qc6";

  const totalAmount = cartItemsDiscountTotal;

  const navigate = useNavigate();

  const userContact = addressList?.find(
    ({ _id }) => _id === orderAddress?._id
  )?.phone;

  const { auth, setCurrentPage } = useAuth();

  const simulatePayment = async () => {
    if (!window.ethereum) return alert("MetaMask not found");
  
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      console.log("network", network);
  
      if (network.chainId !== 97n) {
        return alert("Please switch to BNB Testnet (Chain ID 97)");
      }
  
      const signer = await provider.getSigner();
      const sender = await signer.getAddress();
  
      const tx = await signer.sendTransaction({
        to: sender,
        value: ethers.parseEther("0"), // 0.001 BNB
      });
  
      console.log("Transaction Sent:", tx.hash);
      alert(`Payment sent! Tx Hash: ${tx.hash}`);
  
      await tx.wait(); 
      console.log("Transaction confirmed.");
  
      // ✅ Send transaction details to the API
      const response = await fetch("/api/paymentsss", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          txHash: tx.hash,
          from: sender,
          chainId: Number(network.chainId),
          timestamp: new Date().toISOString()
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to notify backend.");
      }
  
      const data = await response.json();
      console.log("API response:", data);
      alert("Backend notified successfully!");
      
    } catch (err) {
      if (err.code === 4001) {
        alert("User rejected transaction.");
      } else {
        console.error("Payment error:", err);
        alert("Payment failed. See console for details.");
      }
    }
  };
  const successHandler =async () => {
    const paymentId = "asdasd";
    const orderId = uuid();
    const order = {
      paymentId,
      orderId,
      amountPaid: totalAmount,
      orderedProducts: [...cartProducts],
      deliveryAddress: { ...orderAddress },
    };
    await simulatePayment()
    dispatch({ type: "SET_ORDERS", payload: order });
    clearCartHandler(auth.token);
    setCurrentPage("orders");
    navigate("/profile/orders");
  };

  const razorpayOptions = {
    key: KEY_ID,
    currency: "INR",
    amount: Number(totalAmount) * 100,
    name: "Art Waves Unleashed",
    description: "Order for products",
    prefill: {
      name: auth.firstName,
      email: auth.email,
      contact: userContact,
    },
    notes: { address: orderAddress },
    theme: { color: "#000000" },
    handler: (response) => successHandler(response),
  };

  const placeOrderHandler = () => {
    if (orderAddress) {
      successHandler()
      // const razorpayInstance = new window.Razorpay(razorpayOptions);
      // razorpayInstance.open();
    } else {
      toast("Please select an address!");
    }
  };

  return (
    <div className="delivery-address-container">
      <p>Delivering To</p>

      <div className="delivery-address-description">
        <span className="name">
          Name: {userDataState.orderDetails?.orderAddress?.name}
        </span>
        <span className="address">
          Address: {orderAddress?.street}, {orderAddress?.city},{" "}
          {orderAddress?.state}, {orderAddress?.country},{" "}
          {orderAddress?.pincode}
        </span>
        <span className="contact">Contact: {orderAddress?.phone}</span>
        <button onClick={placeOrderHandler} className="place-order-btn">
          Place Order
        </button>
      </div>
    </div>
  );
};
