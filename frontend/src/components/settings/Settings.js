import React, { createContext, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import SettingsNav from "./SettingsNav";
import Header from "../navigation/header";
import SettingsPage from "./SettingsPage";
import TextHeader from "../navigation/TextHeader";


export const HeaderContext = createContext()

export default function Settings() {
    const path = useLocation().pathname
    const [header, setHeader] = useState("")

    return (
        <>
            <Header isVisible={true} />
            <div className="main-cont">
                <SettingsNav />
                <div style={{zIndex:1000}}>
                    <div className="settings-page elevation-1 radius">
                        <TextHeader title={header} />
                        <HeaderContext.Provider value={{header, setHeader}} >
                            {path === '/settings' ?
                                <SettingsPage />
                                :
                                <Outlet /> 
                            }
                        </HeaderContext.Provider>
                    </div>
                </div>
                
            </div>
        </>
        
    )
}
