import { useContext, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import { unreadNotificationsFunc } from "../../utils/unreadNotification";
import moment from "moment";

const Notification = () => {

    const[isOpen, setIsOpen]= useState(false);
    const {user} = useContext (AuthContext);
    const {notifications, userChats, allUsers, markAllNotificationsAsRead,markNotifcationAsRead} = useContext(ChatContext)
// check thông báo chưa đọc
    const unreadNotifications = unreadNotificationsFunc(notifications);
// lấy tên người gửi của thông báo
    const modifiedNotifications = notifications.map((n)=>{
        const sender = allUsers.find(user => user._id === n.senderId)

        return{
            ...n,
            senderName: sender?.name
        }
    });

    console.log("un",unreadNotifications);
    console.log("mn",modifiedNotifications);

    return ( 
    <div className="notifications">
        <div className="notification-icon" onClick={()=> setIsOpen(!isOpen)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-chat-left-dots-fill" viewBox="0 0 16 16">
                <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4.414a1 1 0 0 0-.707.293L.854 15.146A.5.5 0 0 1 0 14.793zm5 4a1 1 0 1 0-2 0 1 1 0 0 0 2 0m4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
            </svg>
            {unreadNotifications?.length === 0? null :(
                <span className="notification-count">
                    <span>{unreadNotifications?.length}</span>
                </span>
            )}
        </div>
        {isOpen?(
        <div className="notifications-box">
            <div className="notifications-header">
                <h3>Notifications</h3>
                <div className="mark-as-read" onClick={() => markAllNotificationsAsRead(notifications)}>Mark all as read</div>
            </div>
                {modifiedNotifications?.length === 0 ? <span className="notification">No notifacations yet...</span> : null}
                {modifiedNotifications && modifiedNotifications.map((n,index)=>{
                    return (<div 
                                key={index} 
                                className={n.isRead? 'notification' : 'notification not-read'}
                                onClick={() =>{
                                    markNotifcationAsRead(n,userChats, user, notifications);
                                    setIsOpen(false)
                                }}
                            >
                                <span>{`${n.senderName} sent you new message`}</span>
                                <span className="notification-time">{moment(n.date).calendar()}</span>
                         </div>)
                })}
            
        </div> ): null}
        
    </div> 
    );
}
 
export default Notification;