import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Logout from "./Logout";
import { useAuth } from "./AuthContext";
import { IoWalletOutline } from "react-icons/io5";
export const CustomLoginButton = () => {
 const { signedIn, setSignedIn } = useAuth();
  const [userAddress, setUserAddress] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length === 0) {
          console.log("MetaMask disconnected");
          localStorage.removeItem("signedIn");
          setSignedIn(false);
          setUserAddress("");
        }
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", () => {});
      }
    };
  }, []);

  const signInWithMetamask = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        const message = "Sign in to our platform";
        const signature = await signer.signMessage(message);
        console.log("Signed message:", signature);

        localStorage.setItem("signedIn", "true");
        setSignedIn(true);
        setUserAddress(address);
      } catch (error) {
        console.error("Sign-in failed:", error);
      }
    } else {
      console.error("MetaMask not detected");
    }
  };

  const logout = () => {
    localStorage.removeItem("signedIn");
    setSignedIn(false);
    setUserAddress("");
    setShowModal(false);
  };

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200 font-semibold cursor-pointer"
                  >
                    Connect Wallet
                  </button>
                );
              }

              if (signedIn) {
                return (
                  <>
                    <button
                      onClick={() => setShowModal(true)}
                      className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition duration-200 font-semibold cursor-pointer"
                    >
                       <IoWalletOutline />
                    </button>

                    {/* Modal */}
                    {showModal && (
                      <Logout
                        closeModal={() => setShowModal(false)}
                        logout={ logout }
                      />
                      
                    )}
                  </>
                );
              }

              return (
                <button
                  onClick={signInWithMetamask}
                  type="button"
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200 font-semibold cursor-pointer"
                >
                  Sign In
                </button>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
