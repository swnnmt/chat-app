import { createContext, useState, useEffect, useCallback } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";
import {io} from "socket.io-client"
export const ChatContext = createContext();

export const ChatContextProvider =  ({children, user}) =>{

    const [userChats, setUserChats] = useState(null);
    const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
    const [userChatsError, setUserChatsError] = useState(null);
    const[potentialChats, setPotentialChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState(null);
    const [isMessageLoading, setIsMessageLoading] = useState(false);
    const [messageError, setMessageError] = useState(null);
    const [sendTextMessageError, setSendTextMessageError ] = useState(null);
    const [newMessage, setNewMessage ] = useState(null);
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [notifications,setNotifications] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    console.log("message", messages)
    console.log("notifacations", notifications)
// kết nối socket io với server
    useEffect(()=>{
        const newSocket  = io ("http://localhost:3000");
        setSocket(newSocket);
        return () =>{
            newSocket.disconnect()
        }
    }, [user]);
// add online users socket 
 useEffect(()=>{
    if(socket === null) return;
    socket.emit("addNewUser", user?._id)
    socket.on("getOnlineUsers", (res)=>{
        setOnlineUsers(res);
    });

    return ()=>{
        socket.off("getOnlineUsers");
    };

 },[socket]);
 // nhận tin nhắn socket 
 useEffect(()=>{
    if(socket === null) return;

    const recipientId = currentChat?.members.find((id)=> id !== user?._id)

    socket.emit("sendMessage", {... newMessage, recipientId})

 },[newMessage]);
// receive message socket add notification
useEffect(()=>{
    if(socket === null) return;

    socket.on("getMessage", res =>{
        if(currentChat?._id !== res.chatId ) return

        setMessages((prev) => [...prev, res]);
    });

    socket.on("getNotification", (res)=>{
        const isChatOpen = currentChat?.members.some(id => id === res.senderId)
        if(isChatOpen){
            setNotifications(prev => [{...res, isRead: true}, ...prev])
        }
        else{
            setNotifications(prev =>[res, ...prev])
        }
    });

    return () =>{
        socket.off("getMessage");
        socket.off("getNotification");
    };

 },[socket, currentChat]);


//lấy user chưa tạo đoạn chat
    useEffect(()=>{

    const getUsers = async() =>{
        const response = await getRequest(`${baseUrl}/users`);
        if(response.error){
            return console.log("Error fetching users", response)
        }

        const pChats= response.filter((u)=>{
            let isChatCreated = false;
            if(user?._id === u._id) return false;

            if(userChats){
              isChatCreated = userChats?.some((chat)=>{
                    return chat.members[0]=== u._id || chat.members[1] === u._id
                })
            }

            return !isChatCreated

        });

        setPotentialChats(pChats);
        // lấy tất cả người dùng
        setAllUsers(response);
    };

    getUsers()
    }, [userChats])

    // lấy user chat
    useEffect(()=>{
        const getUserChats = async()=>{
            if(user?._id){

                setIsUserChatsLoading(true)
                setUserChatsError(null)

                const response = await getRequest(`${baseUrl}/chats/${user?._id}`)
                
                setIsUserChatsLoading(false)

                if(response.error){
                    return setUserChatsError(response)
                }

                setUserChats(response)
            }

        }
        getUserChats()
    },[user, notifications])
// tạo đoạn chat
    const createChat = useCallback(async(firstId, secondId)=>{

        const response = await postRequest(`${baseUrl}/chats/`,
            JSON.stringify({
            firstId,
            secondId,
        })
    );

    if(response.error){
           return console.log("Error creating chat ", response)
    }
    setUserChats((prev)=>[... prev, response]);
    },[])
//update đoạn chat hiện tại
 const updateCurrentChat = useCallback((chat)=>{
    setCurrentChat(chat)
 },[])

//lấy danh sách tin nhắn theo id chat
useEffect(()=>{
    const getMessage = async()=>{

           setIsMessageLoading(true)
           setMessageError(null)

            const response = await getRequest(`${baseUrl}/messages/${currentChat?._id}`)
            
            setIsMessageLoading(false)

            if(response.error){
                return setMessageError(response)
            }

            setMessages(response)
        

    }
    getMessage()
},[currentChat])

// gửi tin nhắn
const sendTextMessage = useCallback(async(textMessage, sender, currentChatId, setTexMessage)=>{

    if(!textMessage) return console.log("You must typ something...");

    const response= await postRequest(`${baseUrl}/messages`,JSON.stringify(
        {
        chatId: currentChatId,
        senderId: sender._id,
        text: textMessage
        }
    ));


    if(response.error){
        return setSendTextMessageError(response)
    }

    setNewMessage(response)
    setMessages ((prev)=> [...prev, response])
    setTexMessage("");

}, [])
// chuyển tất cả tin nhắn thành đã đọc

const markAllNotificationsAsRead = useCallback((notifacations)=>{

    const mNotification = notifacations.map(n =>{ 
            return {...n , isRead: true} 
    })
    setNotifications(mNotification);
},[])
// chuyển từ thông báo đến đoạn chat
const markNotifcationAsRead = useCallback((n, userChats, user, notifacations) =>{

    // tìm đến đoạn chat của thông báo
    const desiredChat = userChats.find((chat) => {
        const chatMenbers = [user._id , n.senderId];
        const isDesiredChat = chat?.members.every((member)=> {
            return chatMenbers.includes(member);
        });

        return isDesiredChat
    });

    // đánh dấu thông báo vừa bấm thành đã đọc

    const mNotification = notifacations.map(mnoti =>{
        if(n.senderId === mnoti.senderId){
            return {...n, isRead: true};
        }
        else{
            return mnoti
        }
    })

    updateCurrentChat(desiredChat)
    setNotifications(mNotification)
},[])

// đánh dấu tin nhắn đã đọc từ user

const markThisUserNotificationAsRead = useCallback((thisUserNotifications, notifications) => {

    const mNotification = notifications.map((unoti) => {
        let notification;
        thisUserNotifications.forEach((n) =>{
            if(n.senderId === unoti.senderId){
                notification = {...n, isRead: true}
            }else{
                notification = unoti
            }
        })

        return notification
    })
        setNotifications(mNotification);
},[])
    return(
        <ChatContext.Provider
         value={{
            userChats,
            isUserChatsLoading,
            userChatsError,
          potentialChats,
          createChat,
          updateCurrentChat,
          currentChat,
          messages,
          messageError,
          isMessageLoading,
          sendTextMessage,
          onlineUsers,
          notifications, 
          allUsers,
          markAllNotificationsAsRead,
          markNotifcationAsRead,
          markThisUserNotificationAsRead
        }}
        >
        {children}
    </ChatContext.Provider>
    )
    
}