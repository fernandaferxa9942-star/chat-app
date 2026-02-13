const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let users = {};

io.on("connection", (socket) => {

  socket.on("login", (username) => {
    users[socket.id] = username;
    io.emit("users", Object.values(users));
  });

  socket.on("message", (data) => {
    io.emit("message", {
      user: users[socket.id],
      text: data
    });
  });

  socket.on("disconnect", () => {
    delete users[socket.id];
    io.emit("users", Object.values(users));
  });

});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("Servidor activo en puerto " + PORT));
