import React, { useEffect, useState } from "react";
import LoadingScreen from "../main-components/LoadingScreen";
import { getUserLastMessage } from "../../api/app";
import dayjs from "dayjs";

export default function ChatItem(props){
    const [lastMessage, setLastMessage] = useState(null)
    const [isLoading, setLoading] = useState(true)
    const now = dayjs()

    useEffect(() => {
        const getData = async () => {
            const message = await getUserLastMessage(props.id)
            setLoading(false)
            if (message instanceof Error) {
                //dd
            } else {
                setLastMessage(message)
            } 
        }
    
        getData()
      }, [])
    return isLoading ? <LoadingScreen /> : (
        <div onClick={() => props.goToUser(props.id)}>
            <div className="chat-item" style={{cursor:"pointer"}}>
                <div className="left">
                    
                    <div className="user-image-container">
                        <img src={props.profilePicture} className="userImage-messageList"/>
                    </div>
                    <div className="chatItem-info">
                        <span className="normal-text"><b>{props.firstName} {props.lastName}</b></span>
                        <div className="large-label">{lastMessage?.content}</div>
                    </div>
                </div> 
                <div className="right small-text">{now.diff(dayjs(lastMessage?.date), "minute")} mins</div>
            </div>
        </div>
    )
}