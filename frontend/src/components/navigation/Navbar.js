import React, { useEffect, useState } from "react";
import NavItem from "./NavItem";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";
import { getNotificationsByUserId, getPhoto, getUserById, userProfile } from "../../api/app";

export default function Navbar(props) {
    const auth = useAuth()

    const [avatar, setAvatar] = useState(null)
    const [notifications, setNotification] = useState([])
    
    useEffect(() => {
        const getAvatar = async () => {
            try {
                const data = await getPhoto()
                setAvatar(data.data.image)
            } catch(err){
                console.error(err)
            }
        }
        getAvatar()
    },[])

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (userId) {
            getNotificationsByUserId(Number(userId))
                .then((res) => {
                    setNotification(res.data);
                })
                .catch((error) => {
                    console.error("Error fetching notifications:", error);
                });
        }
    }, []);

    return (
        <div>
            <div className={`nav-bar radius elevation-1 ${props.isScrolling && "scroll"}`}>
                <NavItem
                    url="/"
                    text="Home"
                    line="mingcute:home-4-line"
                    fill="mingcute:home-4-fill"
                />
                <NavItem
                    url="/jobs"
                    text="Jobs"
                    line="majesticons:suitcase-line"
                    fill="majesticons:suitcase"
                />
                <NavItem
                    url={useLocation().pathname}
                    text="Post"
                    line="zondicons:add-outline"
                    fill="zondicons:add-solid"
                    click={props.showNewPost}
                    post="nav-post"
                />
                <NavItem
                    url="/messages"
                    text="Messages"
                    line="mingcute:message-2-line"
                    fill="mingcute:message-2-fill"
                    hidden={true}
                />
                <NavItem
                    url="/notifications"
                    text="Notifications"
                    line="mingcute:notification-line"
                    fill="mingcute:notification-fill"
                    notifications={notifications}
                    notificationCount={props.NotificationCount}
                />
                <NavItem
                    url={`profile/${localStorage.getItem('userId')}`}
                    text="Profile"
                    img={avatar}
                />
                <NavItem
                    url="/settings"
                    text="Settings"
                    line="ion:settings-outline"
                    fill="ion:settings"
                    hidden={true}
                />
                <NavItem
                    url={useLocation().pathname}
                    text="Logout"
                    line="ic:baseline-logout"
                    fill="ic:baseline-logout"
                    hidden={true}
                    post="nav-post"
                    click={auth.logout}
                />
            </div>
        </div>
        
    )
}