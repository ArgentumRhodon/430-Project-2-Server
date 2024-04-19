const http = require("http");
const { Server } = require("socket.io");

let io;

const handleChatMessage = (socket, message) => {
  socket.rooms.forEach((room) => {
    if (room === socket.id) return;
    console.log(message);

    io.to(room).emit("incoming message", message);
  });
};

const handleRoomChange = (socket, roomName) => {
  socket.rooms.forEach((room) => {
    if (room === socket.id) return;
    socket.leave(room);
  });

  console.log("A user changed rooms to", roomName);

  socket.join(roomName);
};

const socketSetup = (app, session) => {
  const server = http.createServer(app);
  io = new Server(server);

  io.on("connection", (socket) => {
    console.log("A user connected.");

    socket.join("Chat 1");
    socket.on("disconnect", () => {
      console.log("A user disconnected.");
    });

    socket.on("send message", (message) => handleChatMessage(socket, message));
    socket.on("room change", (room) => handleRoomChange(socket, room));
  });

  io.engine.use(session);

  return server;
};

module.exports = socketSetup;
