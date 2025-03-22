import React,{useState} from 'react'
import { IoClose } from "react-icons/io5";
import { IoWalletOutline } from "react-icons/io5";
import { LuDownload } from "react-icons/lu";
import { useAuth } from './AuthContext';
const Logout = ({ closeModal, logout }) => {
  const [activeTab, setActiveTab] = useState("tokens");
  const { signedIn, setSignedIn } = useAuth();
  return (
    <div className="fixed inset-0 flex items-center justify-end  z-50 p-10">
      <div className="bg-white p-6 rounded-lg shadow-lg w-sm h-full border-[1px] border-[#E2E8F0] ">
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem("signedIn");
              setSignedIn(false);
              closeModal()
            }}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200 font-semibold cursor-pointer"
          >
            Log out
          </button>
          <button
            className=" px-3 py-2.5 text-xl text-gray-500 hover:bg-gray-100 rounded-md  cursor-pointer "
            onClick={closeModal}
          >
            <IoClose />
          </button>
        </div>
        <h1 className="font-bold text-[2rem] py-3">$0.00</h1>
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-4 px-3 py-2 rounded-md border-[1px] border-[#E2E8F0] cursor-pointer w-1/2 hover:bg-gray-100 text-md font-medium justify-center">
            <IoWalletOutline />
            Buy
          </div>
          <div className="flex items-center gap-4 px-3 py-2 rounded-md border-[1px] border-[#E2E8F0] cursor-pointer w-1/2 hover:bg-gray-100 text-md font-medium justify-center">
            <LuDownload />
            Receive
          </div>
        </div>

        <div className="w-full mt-6">
          {/* Tabs */}
          <div className="flex font-medium bg-gray-100 px-1 py-1 rounded-md space-x-2">
            {["tokens", "nfts"].map((tab) => (
              <p
                key={tab}
                className={`px-4 py-1.5 cursor-pointer transition duration-200 rounded-md ${
                  activeTab === tab ? "bg-white shadow-md" : "hover:bg-gray-200"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </p>
            ))}

            {["Pools", "Activity"].map((tab) => (
              <div key={tab} className="relative group">
                <p className="px-4 py-1.5 cursor-not-allowed text-gray-500">
                  {tab}
                </p>
                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black text-white text-xs px-2 py-1 rounded-md">
                  Coming Soon
                </span>
              </div>
            ))}
          </div>

          {/* Content */}
          <div className=" bg-white">
            {activeTab === "tokens" && <p></p>}
            {activeTab === "nfts" && (
              <p className="text-center py-2">No NFTs found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logout
