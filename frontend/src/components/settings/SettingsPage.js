import { Icon } from "@iconify/react";
import React, { createContext, useContext, useEffect, useState } from "react";
import { HeaderContext } from "./Settings";


export default function SettingsPage() {
    const { setHeader } = useContext(HeaderContext)

    useEffect(() => setHeader("Settings"),[])

    return (
        <div className="flexy">
            <div className="settings-cont">
                <Icon className="settings-icon" icon="iwwa:settings" />
                <p className="medium-title">Settings</p>
            </div>
        </div>
    )
}