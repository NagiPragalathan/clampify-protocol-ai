import { useEffect, useRef, useState } from "react";

const JitsiMeeting = ({ roomName, displayName }) => {
  const jitsiContainerRef = useRef(null);
  const [selectedCheck, setSelectedCheck] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  useEffect(() => {
    const domain = "meet.jit.si";
    const options = {
      roomName: roomName,
      parentNode: jitsiContainerRef.current,
      width: "100%",
      height: 600,
      userInfo: {
        displayName: displayName,
      },
    };

    const api = new window.JitsiMeetExternalAPI(domain, options);

    return () => api?.dispose();
  }, [roomName, displayName]);

  // Helper functions to generate random values
  const generateBP = () => `${120 + Math.floor(Math.random() * 20)}/${80 + Math.floor(Math.random() * 10)} mmHg`;
  const generateHeartRate = () => `${60 + Math.floor(Math.random() * 40)} bpm`;
  const generateGlucose = () => `${80 + Math.floor(Math.random() * 40)} mg/dL`;

  // Common handler to run animation and show results
  const handleCheck = (type) => {
    setSelectedCheck(type);
    setLoading(true);
    setResult("");

    setTimeout(() => {
      let value = "";
      if (type === "bp") value = generateBP();
      else if (type === "heart") value = generateHeartRate();
      else if (type === "glucose") value = generateGlucose();

      setLoading(false);
      setResult(value);
    }, 5000); // 5 seconds animation
  };

  return (
    <div className="w-full flex flex-col items-center py-8">
      {/* Jitsi Meeting */}
      <div ref={jitsiContainerRef} className="w-full max-w-4xl mb-8" />

      {/* Health Check Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => handleCheck("bp")}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Check BP
        </button>
        <button
          onClick={() => handleCheck("heart")}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
        >
          Check Heart Rate
        </button>
        <button
          onClick={() => handleCheck("glucose")}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
        >
          Check Glucose
        </button>
      </div>

      {/* Animation / Result Display */}
      <div className="w-full max-w-2xl text-center mt-4">
        {selectedCheck && (
          <div className={`p-6 rounded-lg shadow-md ${
            selectedCheck === "bp" ? "bg-blue-100" :
            selectedCheck === "heart" ? "bg-green-100" :
            "bg-purple-100"
          }`}>
            {loading ? (
              <>
                {/* Add Lottie animation or spinner here */}
                <p className="text-xl font-semibold animate-pulse">
                  Checking {selectedCheck.toUpperCase()}...
                </p>
              </>
            ) : (
              <p className="text-2xl font-bold">Result : {result}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JitsiMeeting;
