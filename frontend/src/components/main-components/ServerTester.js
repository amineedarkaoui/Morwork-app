import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { demoRequest } from "../../api/app";
import ServerErrorPage from "./ServerErrorPage";
import LoadingScreen from "./LoadingScreen";

export default function ServerTester() {
    const [response, setResponse] = useState(null)
    const [reload, setReload] = useState(0)

    useEffect(() => {
        const getData = async () => {
            const response = await demoRequest();
            setResponse(response);
          };
      
          getData();
    }, [reload])
    
    if (response === null) return <LoadingScreen />
    if (response instanceof Error && response.code === "ERR_NETWORK") return <ServerErrorPage reload={() => setReload(prev => prev+1)}/>
    return <Outlet />
}