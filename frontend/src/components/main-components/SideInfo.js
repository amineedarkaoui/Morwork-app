import React from "react";
import ProfileCard from "./ProfileCard";

export default function SideInfo(props) {
    return (
        // hidden className hides the component from mobile layout
        <div className="side-info hidden">
            <ProfileCard />
        </div>
    )
}