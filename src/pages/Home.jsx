import React from 'react'
import Login from '../components/Login'
import { useAuth } from '../components/AuthContext';
import ChatBot from '../components/Chatbot';
const Home = () => {
  const { signedIn, setSignedIn } = useAuth();
  return (
    <div className="">
      {!signedIn && <Login />}
      {signedIn &&<ChatBot/>}
    </div>
  );
};

export default Home
