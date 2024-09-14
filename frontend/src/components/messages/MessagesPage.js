import React, { useEffect, useState } from "react";
import MessagesList from "./MessagesList";
import Discussion from "./Discussion";
import Header from "../navigation/header";

import SockJS from "sockjs-client";
import { over } from "stompjs";
import LoadingScreen from "../main-components/LoadingScreen";
import { getUserCard, getUserChat } from "../../api/app";

var stompClient=null;
export default function MessagesPage(){
    const [chat, setChat] = useState([])
    const [chatId, setChatId] = useState(null)
    const [user, setUser] = useState(null)
    const [update, setUpdate] = useState(false)
    const [isLoading, setLoading] = useState(true)


    useEffect(() => {
        const getData = async () => {
            const chat = await getUserChat(chatId)
            const user = await getUserCard(chatId)
            setLoading(false)
            if (chat instanceof Error) {
                //dd
            } else {
                console.log("chat: " + chat)
                setChat(chat)
                setUser(user)
            } 
        }
    
        if (chatId != 0) {
            getData()
        }
        
      }, [chatId, update])

    return isLoading ? <LoadingScreen /> : (
        <div style={{width:"100%", position:"fixed"}}>
            <Header isVisible={true} />
            <div className="Message-page">
                <MessagesList goToUser={(id) => setChatId(id)} updated={update} update={() => setUpdate(prev => !prev)} />
                <Discussion id={chatId} chat={chat} user={user} updated={update} update={() => setUpdate(prev => !prev)} />
            </div>
        </div>
    )
}