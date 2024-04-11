const http = require("http");
const { Server } = require("socket.io");

let io;

const handleChatMessage = (socket, message, from) => {
  socket.rooms.forEach((room) => {
    if (room === socket.id) return;

    io.to(room).emit("message", { message, from });
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

const socketSetup = (app) => {
  const server = http.createServer(app);
  io = new Server(server);

  io.on("connection", (socket) => {
    console.log("A user connected.");

    socket.join("general");
    socket.on("disconnect", () => {
      console.log("A user disconnected.");
    });

    socket.on("message", ({ message, from }) =>
      handleChatMessage(socket, message, from)
    );
    socket.on("room change", (room) => handleRoomChange(socket, room));
  });

  return server;
};

module.exports = socketSetup;