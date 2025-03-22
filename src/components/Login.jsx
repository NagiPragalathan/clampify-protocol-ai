import React from "react";
import { CustomLoginButton } from "./CustomLoginButton";

const Login = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center flex flex-col items-center">
        <p className="text-2xl font-bold mb-2">Login</p>
        <p className="text-gray-600 mb-4">
          Login to get personalized money-making suggestions.
        </p>
       <CustomLoginButton/>
      </div>
    </div>
  );
};

export default Login;
