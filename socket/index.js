const { Server } = require("socket.io");

const io = new Server({ cors:" http://localhost:5173/" });
let onlineUsers =[]
io.on("connection", (socket) => {
  
    console.log("new conection",socket.id)
// nghe sự kiện kết nối 
    socket.on("addNewUser", (userId)=>{
       !onlineUsers.some(user => user.userId === userId) &&
        onlineUsers.push({
            userId,
            socketId: socket.id
        });
        console.log("OnlineUser", onlineUsers);
        io.emit("getOnlineUsers", onlineUsers);
    });

//  gửi tin nhắn thời gian thực
socket.on("sendMessage", (message) => {
    const user = onlineUsers.find((user) => user.userId === message.recipientId);
    if(user){
        // tạo sự kiện nhận tin nhắn
        io.to(user.socketId).emit("getMessage", message)
        // tạo sự kiện thông báo
        io.to(user.socketId).emit("getNotification", {
            senderId: message.senderId,
            isRead: false,
            date: new Date(),
        });
    }
})
// ngắt kết nối 
   socket.on("disconnect", () =>{

     onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id)

     io.emit("getOnlineUsers", onlineUsers);
   })
});

io.listen(3000);