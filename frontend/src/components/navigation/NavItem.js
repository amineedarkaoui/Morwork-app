import React from "react"
import { Icon } from '@iconify/react';
import { NavLink, useLocation } from "react-router-dom";
import { getNotificationsByUserId } from "../../api/app";

export default function NavItem(props) {
    const path = useLocation().pathname
    const active = (path===props.url && props.text!=="Post")

    const [notificationCount, setNotificationCount] = React.useState(0)
    const [Notifications, setNotifications] = React.useState([])

    React.useEffect(()=>{
        getNotificationsByUserId(Number(localStorage.getItem("userId")))
        .then(res => {
            setNotifications(res.data)
        })
    },[])

    React.useEffect(() => {
        // Count unread notifications
        const unreadCount = Notifications.filter(notification => !notification.seen).length;
        setNotificationCount(unreadCount);
    }, [Notifications]); // U
    

    return (
        <NavLink 
            to={props.url} 
            className={`${props.post} nav-item ${({isActive}) => (
            (isActive && props.text!=="Post" && props.text!=="Logout") ? 'active' : '')} 
            ${props.hidden && 'hidden'}`} 
            onClick={props.click}
            notifications={props.notifications}
        >
                {props.fill && 
                    (props.notifications ?
                    <div>
                        {props.notificationCount > 0 && <div className="count">{props.notificationCount}</div>}
                        <Icon    
                        icon={active ? props.fill : props.line}
                        className="icon notifIcon"
                        />
                    </div>
                    :
                    <Icon    
                    icon={active ? props.fill : props.line}
                    className="icon"
                />
                )
                }
                {props.img && <img src={props.img} className="avatar" />}
                <p className="medium-text">{props.text}</p>
        </NavLink>
        
    )
}