import React from "react";
import { formatPostTime } from "../post-feed/Feed";
import { NavLink } from "react-router-dom";

export default function NotificationItem(props){



    return (
        <NavLink to={`/comments/${props.notification?.post?.id}/${props.notification?.post?.originalPost ? "REPOSTED" : "STANDART_POST"}`} style={{textDecoration:"none"}}>
            <div className="notificationItem" style={{cursor:"pointer"}}>
                <div className="left">
                    <div className={!props.notification.seen ? "isSeen" : ""}></div>
                    <div className="user-image-container">
                        <img src={`http://localhost:8081/media/${props.notification.sender.profilePicture}`} className="userImage-notification"/>
                    </div>
                    <div className="notification-info">
                        <span className="normal-text"><b>{`${props.notification.sender.firstName} ${props.notification.sender.lastName}`}</b> {(props.notification.action).toLowerCase()} your {props.notification.typeAffected === "POST" ? "post" :  (props.notification.typeAffected === "COMMENT" ? "comment" : "reply")}</span>
                    </div>
                </div> 
                <div className="right normal-text">{formatPostTime(props.notification.date)}</div>
            </div>
        </NavLink>
    )
}