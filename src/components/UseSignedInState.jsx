import { useEffect, useState } from "react";

const UseSignedInState = () => {
  const [signedIn, setSignedIn] = useState(
    () => localStorage.getItem("signedIn") === "true"
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setSignedIn(localStorage.getItem("signedIn") === "true");
    };

    // Listen for storage changes across tabs
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return [signedIn, setSignedIn];
};

export default UseSignedInState;
