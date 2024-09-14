import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { demoRequest, isUserSignedUp } from "../api/app";
import LoadingScreen from "../components/main-components/LoadingScreen";
import SignUpSequence from "../components/authentication/signup-sequence/SignUpSequence";

const PrivateRoute = () => {
  const user = useAuth();
  const [isSignedUp, setSignedUp] = useState(null);
  const [response, setResponse] = useState(null)
 
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await demoRequest()
        setResponse(response)
        const result = await isUserSignedUp();
        setSignedUp(result);
      } catch (error) {
        console.error("Error checking sign-up status:", error);
        setSignedUp(false);
      }
    };

    getData();
  }, []);

  if (!user || !user.token) {
    return <Navigate to="/login" />;
  }

  if (isSignedUp === null || response === null) {
    return <LoadingScreen />;
  }

  if (response instanceof Error && response.response?.status === 403) return <Navigate to="/login" />

  if (!isSignedUp) {
    return <SignUpSequence />;
  }

  return <Outlet />;
};

export default PrivateRoute;