let ioInstance;

module.exports = {
  init: (server) => {
    const socketIo = require("socket.io");
    ioInstance = socketIo(server, {
      cors: {
        origin: "*",
      },
    });

    ioInstance.on("connection", (socket) => {
      console.log("A user connected:", socket.id);

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });

    return ioInstance;
  },
  getIO: () => {
    if (!ioInstance) {
      throw new Error("Socket.io not initialized!");
    }
    return ioInstance;
  },
};
