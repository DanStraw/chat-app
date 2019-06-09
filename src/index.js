const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');
const { generateMessage, generateLocationMessage } = require('./utils/messages');
const {
  addUser,
  getUser,
  removeUser,
  getUsersInRoom,
  getUsers
} = require('./utils/users');
const { addRoom, getRooms, removeRoom } = require('./utils/rooms');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

io.on('connection', (socket) => {

  console.log('new WebSocket connection');

  socket.on('join', ({ username, room }, callback) => {

    const { error, user } = addUser({ id: socket.id, username, room });
    if (error) {
      return callback(error)
    }

    socket.join(user.room);
    addRoom(user.room);
    socket.emit('message', generateMessage("Admin", `Welcome ${user.displayName} to room ${user.room}`));

    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room)
    })
    socket.broadcast.to(user.room).emit('message', generateMessage("Admin", `${user.displayName} has joined the room ${user.room}!`));
    callback();
  })

  socket.on('sendMessage', (message, callback) => {
    const filter = new Filter();

    if (filter.isProfane(message)) {
      return callback('profanity prohibited!');
    }
    const user = getUser(socket.id);
    io.to(user.room).emit('message', generateMessage(user.displayName, message));
    callback();
  });

  socket.on('sendLocation', (location, cb) => {
    const user = getUser(socket.id);
    io.to(user.room).emit('locationMessage', generateLocationMessage(user.displayName, `https://google.com/maps?q=${location.latitude},${location.longitude}`));
    cb();
  })

  socket.on('disconnect', () => {

    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('message', generateMessage("Admin", `${user.displayName} has left ${user.room}`));
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room)
      });
      removeRoom(getUsers(), user.room);
    }
    //check if any more users in that room -- if not, removeRoom()

  });
  socket.on('login', () => {
    const rooms = getRooms();
    socket.emit('showRooms', rooms);
  })
});


server.listen(port, () => {
  console.log('Server is up on port localhost:' + port);
});