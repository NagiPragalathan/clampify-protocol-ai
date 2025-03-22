import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Home from "./Home";
import Tasks from "./Tasks";
import Agents from "./Agents";
import JitsiMeeting from "./JitsiMeeting";   // ✅ Import JitsiMeeting page
import { CustomLoginButton } from "../components/CustomLoginButton";
import Settings from "../components/Settings";

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1000);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleResize = () => {
    setIsMobile(window.innerWidth < 1000);
    if (window.innerWidth >= 1000) {
      setIsOpen(false); // Close sidebar when resizing to a larger screen
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleOutsideClick = (e) => {
    if (isOpen && isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <div className="flex h-screen relative">
      <Sidebar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        toggleSidebar={toggleSidebar}
        openSettings={() => setIsSettingsOpen(true)}
      />

      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-[#ffffff97] bg-opacity-50 z-20 lg:hidden"
          onClick={handleOutsideClick}
        ></div>
      )}

      <main className={`flex-1 overflow-auto h-screen transition-all duration-300`}>
        <header
          className={`${
            isOpen ? "lg:pl-64" : "pl-4"
          } fixed top-0 left-0 right-0 flex items-center justify-between w-full px-4 py-2 bg-white border-b-[.5px] border-[#E2E8F0] z-10`}
        >
          <button
            onClick={toggleSidebar}
            className="cursor-pointer border-[1px] lg:hidden border-[#E2E8F0] p-1.5 rounded-md hover:border-gray-300 hover:bg-[#e2e8f0af]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-panel-right-open h-4 w-4"
            >
              <rect width="18" height="18" x="3" y="3" rx="2"></rect>
              <path d="M15 3v18"></path>
              <path d="m10 15-3-3 3-3"></path>
            </svg>
          </button>
          {!isOpen && (
            <button
              onClick={toggleSidebar}
              className="cursor-pointer border-[1px] hidden lg:block border-[#E2E8F0] p-1.5 rounded-md hover:border-gray-300 hover:bg-[#e2e8f0af]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-panel-right-open h-4 w-4"
              >
                <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                <path d="M15 3v18"></path>
                <path d="m10 15-3-3 3-3"></path>
              </svg>
            </button>
          )}
          <p className="text-[1.25rem] font-semibold text-center flex-1">Theo</p>
          <CustomLoginButton />
        </header>

        {/* ✅ Routing including Jitsi Meeting */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/meeting" element={<JitsiMeeting />} /> 
        </Routes>
      </main>

      {isSettingsOpen && <Settings onClose={() => setIsSettingsOpen(false)} />}
    </div>
  );
};

export default Dashboard;
