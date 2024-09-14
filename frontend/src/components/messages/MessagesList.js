import React, { useEffect, useState } from "react";
import { formatPostTime } from "../post-feed/Feed";
import ChatItem from "./ChatItem";
import { getChatUsers } from "../../api/app";
import LoadingScreen from "../main-components/LoadingScreen";


export default function MessagesList(props){
    const [users, setUsers] = useState(null)
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        const getData = async () => {
            const users = await getChatUsers()
            setLoading(false)
            if (users instanceof Error) {
                //dd
            } else {
                console.log("users: " + users)
                setUsers(users)
            } 
        }
    
        getData()
      }, [props.updated])
    return isLoading ? <LoadingScreen /> : (
        <div className="Message-list radius">
            <div className="large-title messages-list-header">
                Messages
            </div>
            <div style={{marginTop:"9px"}}>
                {users?.map(user => <ChatItem {...user} key={user.key} goToUser={(id) => props.goToUser(id)} />)}
            </div>
        </div>
    )
}