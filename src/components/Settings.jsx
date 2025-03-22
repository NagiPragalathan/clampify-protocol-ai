import React,{useState} from 'react'
import { IoClose } from "react-icons/io5";
import { LuCopy } from "react-icons/lu";
import { HiOutlineExternalLink } from "react-icons/hi";
import bitcoin from '../images/bitcoin.png'
import cosmos from "../images/cosmos.png";
import suilcoin from "../images/suilcoin.png";
import aptos from "../images/aptos.png";


const Settings = ({ onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(1); // Default value
  const [selectedPriceValue, setSelectedPriceValue] = useState("Medium"); // Default value
  const [selectedOption, setSelectedOption] = useState("Exact");
  const [value, setValue] = useState(50);
  const options = [0.1, 0.5, 1, 2];
  const priceOptions = ["Slow (Cheapest)", "Medium", "Fast"]
  const handleSelect = (value) => {
    setSelectedValue(value);
    setIsOpen(false);
  };
  const handlePriceSelect = (value) => {
    setSelectedPriceValue(value);
    setIsPriceOpen(false);
  };
  return (
    <div className="fixed inset-0 bg-[#000000c3] bg-opacity-50 flex items-center justify-center z-50 py-8 px-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-lg relative h-full  ">
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 text-xl text-gray-400 rounded hover:text-gray-500 cursor-pointer  absolute right-0 -top-1"
        >
          <IoClose />
        </button>
        <div className="overflow-y-auto custom-scroll h-full">
          <div>
            <h2 className="text-3xl font-bold ">Settings</h2>
          </div>
          <div className="border-[1px] border-[#E2E8F0] p-7 rounded-md mt-5">
            <p className="text-2xl font-semibold leading-4 ">Privy Wallets</p>
            <p className="text-sm text-gray-500 font-normal pt-3 mb-5">
              Your Managed-Wallet Configuration
            </p>
            <div className="border-[1px] border-[#E2E8F0] p-1 rounded-md ">
              <div className="flex pb-1.5">
                <p className="font-bold text-md">EVM:</p>
                <p className="font-normal text-md pl-1">0xC957...967CF7</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="font-normal text-xl px-3 text-gray-700 border-[1px] border-[#E2E8F0] p-2 rounded-md cursor-pointer">
                  <LuCopy />
                </div>
                <div className="font-normal text-xl px-3 text-gray-700 border-[1px] border-[#E2E8F0] p-2 rounded-md cursor-pointer">
                  <HiOutlineExternalLink />
                </div>
                <button className=" px-2.5 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 font-semibold cursor-pointer">
                  Export
                </button>
                <button className=" px-2.5 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 font-semibold cursor-pointer">
                  Fund Wallet
                </button>
                <button className="px-2.5 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 font-semibold cursor-pointer">
                  Enable
                </button>
              </div>
            </div>
            <div className="border-[1px] border-[#E2E8F0] p-1 rounded-md mt-3">
              <div className="flex pb-1.5">
                <p className="font-bold text-md">EVM:</p>
                <p className="font-normal text-md pl-1">0xC957...967CF7</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="font-normal text-xl px-3 text-gray-700 border-[1px] border-[#E2E8F0] p-2 rounded-md cursor-pointer">
                  <LuCopy />
                </div>
                <div className="font-normal text-xl px-3 text-gray-700 border-[1px] border-[#E2E8F0] p-2 rounded-md cursor-pointer">
                  <HiOutlineExternalLink />
                </div>
                <button className=" px-2.5 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 font-semibold cursor-pointer">
                  Export
                </button>
                <button className=" px-2.5 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 font-semibold cursor-pointer">
                  Fund Wallet
                </button>
                <button className="px-2.5 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 font-semibold cursor-pointer">
                  Enable
                </button>
              </div>
            </div>
          </div>

          <div className="border-[1px] border-[#E2E8F0] p-7 rounded-md mt-5">
            <p className="text-2xl font-semibold leading-4 ">Connect Wallets</p>
            <p className="text-sm text-gray-500 font-normal pt-3 mb-5">
              Your Personal Connected Wallets
            </p>
            <div className="flex-col gap-3 flex">
              <div className="border-[1px] border-[#E2E8F0] py-2 px-3 rounded-md hover:bg-gray-100 cursor-pointer">
                <div className="flex gap-2 text-md font-medium text-[#000000d1]">
                  <img src={cosmos} alt="" className="rounded-full h-6 w-6" />
                  Cosmos
                </div>
              </div>
              <div className="border-[1px] border-[#E2E8F0] py-2 px-3 rounded-md hover:bg-gray-100 cursor-pointer">
                <div className="flex gap-2 text-md font-medium text-[#000000d1]">
                  <img src={suilcoin} alt="" className="rounded-full h-6 w-6" />
                  Sui
                </div>
              </div>

              <div className="border-[1px] border-[#E2E8F0] py-2 px-3 rounded-md hover:bg-gray-100 cursor-pointer">
                <div className="flex gap-2 text-md font-medium text-[#000000d1]">
                  <img src={bitcoin} alt="" className="rounded-full h-6 w-6" />
                  Bitcoin
                </div>
              </div>

              <div className="border-[1px] border-[#E2E8F0] py-2 px-3 rounded-md hover:bg-gray-100 cursor-pointer">
                <div className="flex gap-2 text-md font-medium text-[#000000d1]">
                  <img src={aptos} alt="" className="rounded-full h-6 w-6" />
                  Aptos
                </div>
              </div>
            </div>
          </div>

          <div className="border-[1px] border-[#E2E8F0] p-7 rounded-md mt-5">
            <p className="text-2xl font-semibold leading-4 ">
              Trading Preferences
            </p>
            <p className="text-sm text-gray-500 font-normal pt-3 mb-5">
              Configure your trading parameters
            </p>

            <p className="text-md font-medium text-[#000000d1] mb-2">
              Slippage Tolerance (%)
            </p>
            <div className="relative w-full">
              {/* Dropdown Toggle */}
              <div
                className="border-[1px] border-[#E2E8F0] py-1.5 px-3 rounded-md flex items-center justify-between cursor-pointer text-sm font-normal"
                onClick={() => setIsOpen(!isOpen)}
              >
                <p>{selectedValue}%</p>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 opacity-50"
                  aria-hidden="true"
                >
                  <path
                    d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>

              {/* Dropdown Options */}
              {isOpen && (
                <div className="absolute left-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-md z-10 p-1">
                  {options.map((option) => (
                    <div
                      key={option}
                      className="py-1.5 rounded-md px-3 flex items-center justify-between hover:bg-gray-100 cursor-pointer text-sm font-normal"
                      onClick={() => handleSelect(option)}
                    >
                      <p>{option}%</p>
                      {selectedValue === option && (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 opacity-50"
                          aria-hidden="true"
                        >
                          <path
                            d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
                            fill="currentColor"
                            fillRule="evenodd"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <p className="text-md font-medium text-[#000000d1] my-3 ">
                Allowance
              </p>
              <div className="flex space-x-4 ">
                {/* Exact Option */}
                <div
                  onClick={() => setSelectedOption("Exact")}
                  className={`cursor-pointer border-2 px-4 py-2 rounded-full ${
                    selectedOption === "Exact"
                      ? "border-blue-500 text-blue-500"
                      : "border-gray-300 text-gray-500"
                  }`}
                >
                  Exact
                </div>

                {/* Unlimited Option */}
                <div
                  onClick={() => setSelectedOption("Unlimited")}
                  className={`cursor-pointer border-2 px-4 py-2 rounded-full ${
                    selectedOption === "Unlimited"
                      ? "border-blue-500 text-blue-500"
                      : "border-gray-300 text-gray-500"
                  }`}
                >
                  Unlimited
                </div>
              </div>
            </div>
          </div>

          <div className="border-[1px] border-[#E2E8F0] p-7 rounded-md mt-5">
            <p className="text-2xl font-semibold leading-4 ">Gas Settings</p>
            <p className="text-sm text-gray-500 font-normal pt-3 mb-5">
              Manage your transaction gas preferences
            </p>
            <div className="relative w-full">
              {/* Dropdown Toggle */}
              <div
                className="border-[1px] border-[#E2E8F0] py-1.5 px-3 rounded-md flex items-center justify-between cursor-pointer text-sm font-normal"
                onClick={() => setIsPriceOpen(!isPriceOpen)}
              >
                <p>{selectedPriceValue}</p>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 opacity-50"
                  aria-hidden="true"
                >
                  <path
                    d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>

              {/* Dropdown Options */}
              {isPriceOpen && (
                <div className="absolute left-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-md z-10 p-1">
                  {priceOptions.map((option) => (
                    <div
                      key={option}
                      className="py-1.5 rounded-md px-3 flex items-center justify-between hover:bg-gray-100 cursor-pointer text-sm font-normal"
                      onClick={() => handlePriceSelect(option)}
                    >
                      <p>{option}</p>
                      {selectedPriceValue === option && (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 opacity-50"
                          aria-hidden="true"
                        >
                          <path
                            d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
                            fill="currentColor"
                            fillRule="evenodd"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="border-[1px] border-[#E2E8F0] p-7 rounded-md mt-5">
            <p className="text-2xl font-semibold leading-4 ">
              Automation Settings
            </p>
            <p className="text-sm text-gray-500 font-normal pt-3 mb-5">
              Configure your automated trading preferences
            </p>
            <p className="text-md font-medium text-[#000000d1] mb-2">
              Risk Tolerance
            </p>
            <div className="relative w-full">
              {/* Background track */}
              <div className="absolute top-1/2 w-full h-2 bg-gray-300 rounded-lg transform -translate-y-1/2"></div>

              {/* Filled portion */}
              <div
                className="absolute top-1/2 h-2 bg-blue-500 rounded-lg transform -translate-y-1/2"
                style={{ width: `${value}%` }}
              ></div>

              {/* Transparent slider input */}
              <input
                type="range"
                min="0"
                max="100"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="relative w-full h-2 opacity-0 cursor-pointer"
              />
            </div>
            <p className="text-sm text-gray-500 font-normal  ">
              Current: {value}% (Higher value indicates higher risk tolerance)
            </p>
          </div>
        </div>

        <div className="  absolute right-0 left-0 bottom-0 pt-3 w-full bg-white mb-3">
          <div className="pt-3  border-t-[1px] px-5 border-[#E2E8F0] flex gap-2 float-right">
            <button className="border-[1px] border-[#E2E8F0] p-2 rounded-md text-md font-medium text-[#000000d1] bg-white hover:bg-gray-100 cursor-pointer">
              Save Settings
            </button>
            <button className="border-[1px] border-[#E2E8F0] p-2 rounded-md text-md font-medium text-[#000000d1] bg-white hover:bg-gray-100 cursor-pointer">
              Use Defaults
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings
