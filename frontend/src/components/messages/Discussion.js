import { Icon } from "@mui/material";
import React, { useEffect, useState } from "react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MessageItem from "./MesssageItem";
import { sendMessage } from "../../api/app";

export default function Discussion (props){
    const messageContainerRef = React.useRef(null);
    const [content, setContent] = useState("")

    const send = async () => {
        if (content.length > 0) {
            const respoonse = await sendMessage(props.id, content)
            if (respoonse instanceof Error) {
                //dd
            } else {
                setContent("")
                props.update()
            } 
        }
    }

    useEffect(() => {
        setContent("")
    }, [props.id])
    return(
        <div className="discussion radius" style={{position:"relative"}}>
            <div className="discussion-header">
                <div className="chat-item">
                        <div className="left">
                        <ArrowBackIcon fontSize="medium" style={{color:"#555"}} />
                            <div className="user-image-container">
                                <img src={props?.user?.profilePicture} className="userImage-messageList"/>
                            </div>
                            <div className="chatItem-info">
                                <span className="medium-text"><b>{props?.user?.firstName} {props?.user?.lastName}</b></span>
                            </div>
                        </div> 
                        
                    <div className="options">
                        <MoreHorizIcon style={{color:"#555"}}/>
                    </div> 
                </div>
            </div>

            
            <div ref={messageContainerRef} style={{overflowY:"auto",display:"flex",flexDirection:"column", maxHeight:"450px",  scrollbarWidth:"none",scrollBehavior:"smooth", position:"absolute", bottom:"0",left:"0", width:"100%", minHeight:"50px", marginBottom:"47px"}}>

                {props?.chat.map((message, i) =>  <MessageItem content={message?.content} messageSource={message?.sender?.id === parseInt(localStorage.getItem("userId")) ? "me" : ""} key={i} />)}
               
                
            </div>

            <div className="comment-input-container">
                <input 
                    type="text" 
                    placeholder="Type your message" 
                    name="message" 
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="commentInput" 
                />
                <button className="primary-button comment-btn radius"
                onClick={send}>Send</button>
            </div>
            

            

            
            
        </div>
    )
}