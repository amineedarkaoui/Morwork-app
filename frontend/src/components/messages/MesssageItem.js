import React from "react";



export default function MessageItem(props){

    return(
        <>
            <div className={`message ${props.messageSource === "me" ? "message-from-me" : "message-from-others"}`}>
                {props.content}
            </div>
            
        </>
    )
}