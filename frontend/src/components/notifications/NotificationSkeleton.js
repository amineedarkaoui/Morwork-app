import React from "react";
import Skeleton from 'react-loading-skeleton';

const NotificationSkeleton = () => {
    return (
        <div className="notificationItem">
            <div className="left">
                <div className={"isSeen"}></div>
                <div className="user-image-container">
                    <Skeleton circle width={40} height={40} />
                </div>
                <div className="notification-info">
                    <Skeleton width={150} />
                </div>
            </div> 
            <div className="right normal-text">
                <Skeleton width={40} />
            </div>
        </div>
    );
};

export default NotificationSkeleton;
