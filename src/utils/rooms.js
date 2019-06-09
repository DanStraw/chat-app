const rooms = [];

const addRoom = (room) => {
  if (rooms.indexOf(room) === -1) {
    rooms.push(room);
  }
}

const getRooms = () => {
  return rooms;
}

const removeRoom = (users, room) => {
  const index = users.findIndex(user => user.room === room);
  if (index === -1) {
    rooms.splice(rooms.indexOf(room), 1);
  }
  console.log('remaining rooms:', rooms);
}

module.exports = {
  addRoom,
  getRooms,
  removeRoom
}