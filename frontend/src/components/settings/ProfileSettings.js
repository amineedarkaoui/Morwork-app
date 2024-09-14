import { Icon } from "@iconify/react";
import React, { createContext, useContext, useEffect, useState } from "react";
import { HeaderContext } from "./Settings";

export default function ProfileSettings() {
    const {setHeader} = useContext(HeaderContext)
    useEffect(() => setHeader("Profile"),[])
    
    return (
        <div>
            <Icon icon="et:profile-male" />
        </div>
    )
}