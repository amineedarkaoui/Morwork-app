import React, { useState, useEffect } from "react";
import NotificationItem from "./NotificationItem";
import NotificationSkeleton from "./NotificationSkeleton";
import { updateToSeen } from "../../api/app";
import { useOutletContext } from "react-router-dom";

export default function Notification(props) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initialLoadingTimeout = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(initialLoadingTimeout)
    }, [])

    useEffect(() => {
        updateToSeen();
    }, []);


    const sortedNotifications = props.notifications.slice().sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });

    const updateCounter = useOutletContext()
    
    updateCounter.restartNotificationCounter()
    return (
        <div className="notification radius">
            <h1 className="large-title" style={{marginBottom:10}}>Notifications</h1>
            {isLoading ? (
                <NotificationSkeleton />
            ) : (
                sortedNotifications.map((notification) => (
                    <NotificationItem key={notification.id} notification={notification} />
                ))
            )}
        </div>
    );
}
