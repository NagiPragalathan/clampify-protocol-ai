import { useState, useEffect, useRef } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import { BrowserRouter as Router } from "react-router-dom";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, base } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"; 
import { AuthProvider } from './components/AuthContext';

const config = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: "YOUR_PROJECT_ID",
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: true,
});

const queryClient = new QueryClient();

function App() {
  const [startMeeting, setStartMeeting] = useState(false);
  const [isJitsiLoaded, setIsJitsiLoaded] = useState(false);
  const jitsiContainerRef = useRef(null);

  // Load Jitsi script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://meet.jit.si/external_api.js';
    script.async = true;
    script.onload = () => setIsJitsiLoaded(true);
    document.body.appendChild(script);
  }, []);

  // Initialize Jitsi when meeting starts
  useEffect(() => {
    let api = null;
    if (startMeeting && isJitsiLoaded) {
      const domain = 'meet.jit.si';
      const options = {
        roomName: 'ReactViteJitsiRoom123',
        parentNode: jitsiContainerRef.current,
        width: '100%',
        height: 600,
        userInfo: { displayName: 'Priyanka' },
        configOverwrite: { startWithAudioMuted: true },
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'desktop', 'fullscreen',
            'fodeviceselection', 'hangup', 'chat', 'settings'
          ],
        },
      };
      api = new window.JitsiMeetExternalAPI(domain, options);
    }

    return () => api?.dispose();
  }, [startMeeting, isJitsiLoaded]);

  return (
    <>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <AuthProvider>
              <Router>
                <Dashboard />
              </Router>
            </AuthProvider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </>
  );
}

export default App;
