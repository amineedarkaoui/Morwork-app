import React, { useState, useEffect } from "react";
import Navbar from "../navigation/Navbar";
import Header from "../navigation/header";
import { Outlet } from "react-router-dom";
import NewPost from "../post-feed/NewPost";
import { getNotificationsByUserId } from "../../api/app";

export default function Main() {
    const [newPost, setNewPost] = useState("hidden");
    const [scrolling, setScrolling] = useState(false);
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [unseenNotificationCount, setUnseenNotificationCount] = useState(0);

    React.useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (userId) {
            const fetchNotifications = async () => {
                try {
                    const res = await getNotificationsByUserId(Number(userId));
                    setNotifications(res.data);
                    const count = res.data.reduce((count, notification) => {
                        return count + (notification.seen ? 0 : 1);
                    }, 0);
                    setUnseenNotificationCount(prev => count);
                } catch (error) {
                    console.error("Error fetching notifications:", error);
                }
            };
    
            fetchNotifications();
            
            const intervalId = setInterval(fetchNotifications, 7000);
    
            return () => clearInterval(intervalId);
        }
    }, []);
    
    

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.pageYOffset;
            setScrolling(prevScrollPos < currentScrollPos);
            setPrevScrollPos(currentScrollPos);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [prevScrollPos]);

    const restartNotificationCounter = () => {
        setUnseenNotificationCount(0); 
    };

    return (
        <>
            <Header isVisible={!scrolling} />
            <div className="main-cont">
                <Navbar
                    showNewPost={() => setNewPost("")}
                    isScrolling={scrolling}
                    NotificationCount={unseenNotificationCount} 
                />
                <Outlet context={{ restartNotificationCounter }} />
                <NewPost isVisible={newPost} hide={() => setNewPost("hidden")} />
            </div>
        </>
    );
}
