import { useWeb3Auth } from "@web3auth/modal-react-hooks";
import React from "react";

// ConnectWeb3AuthButton Component
const ConnectWeb3AuthButton = () => {
  const { isConnected, connect } = useWeb3Auth();

  // If already connected, return nothing
  if (isConnected) {
    return null;
  }

  // Button to connect to Web3Auth
  return (
    <div
      className="flex flex-row rounded-full px-6 py-3 text-white justify-center align-center cursor-pointer"
      style={{ backgroundColor: "#0364ff" }}
      onClick={connect}
    >
      Connect to Web3Auth
    </div>
  );
};

export default ConnectWeb3AuthButton;
