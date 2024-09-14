import React from "react";
import { Icon } from "@iconify/react";

export default function PostInteraction(props) {
    return (
        <div 
            onClick={props.onClick}
            className={`post-interaction ${props.active && 'active'}`}
        >
            <Icon icon={props.icon} className="icon" style={props.style}/>
            <p className="small-text" style={props.style}>{props.text}</p>
        </div>
    )
}