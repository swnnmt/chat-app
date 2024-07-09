import { Stack } from "react-bootstrap";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import { useFetchLatestMessage } from "../../hooks/useFetchLatestMessage";
import avarter from "../../assets/avarter.svg"
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { unreadNotificationsFunc } from "../../utils/unreadNotification";
import moment from "moment";
const UserChat = ({chat, user}) => {
    const {recipientUser} = useFetchRecipientUser(chat, user);
    const {onlineUsers, notifications, markThisUserNotificationAsRead} = useContext (ChatContext);
    const {latestMessage} = useFetchLatestMessage(chat);
    const unreadNotifications = unreadNotificationsFunc(notifications);
    // lọc thông báo từ người gửi
    const thisUserNotifications = unreadNotifications?.filter(
        n => n.senderId == recipientUser?._id
    )
    const isOnline = onlineUsers?.some((user) => user?.userId === recipientUser?._id )
    // console.log(recipientUser);

    const subText = (text) =>{

        let shortText = text.substring(0,20);

        if(text.length >20){
            shortText = shortText + "..."
        }

        return shortText;
    }

    return ( 
        <Stack direction="horizontal" gap={3} className="user-card align-items-center p-2 justifi-content-between" role="button" onClick={()=> {
            if(thisUserNotifications?.length !== 0){
                markThisUserNotificationAsRead(
                    thisUserNotifications,
                    notifications
                )
            }
        }} >

            <div className="d-flex">
                <div className="me-2">
                    <img src={avarter} height="35px"/>
                </div>
                <div className="text-content">
                    <div className="name">{recipientUser?.name}</div>
                    <div className="text">{latestMessage?.text && (
                        <span>
                            {subText(latestMessage.text)}
                        </span>
                        )}
                    </div>
                </div>
            </div>
            <div className="d-flex flex-colum align-items-end">
                <div className="date">{moment(latestMessage?.createdAt).calendar()}</div>
                <div className={thisUserNotifications?.length > 0 ? "this-user-notifications": " "}>{thisUserNotifications?.length>0 ? thisUserNotifications?.length: null }</div>
                <span className={isOnline ?"user-online":""}></span>
            </div>
        </Stack>
     );
}
 
export default UserChat;