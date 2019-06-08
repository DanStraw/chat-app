const users = [];

//addUser
const addUser = ({ id, username, room }) => {
  //clean the data
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();
  //validate the data
  if (!username || !room) {
    return {
      error: 'Username and Room required'
    }
  }
  //check for existing user
  const existingUser = users.find(user => {
    return user.room === room && username === user.username
  })
  //validate username
  if (existingUser) {
    return {
      error: 'Username taken'
    }
  }
  const user = { id, username, room };
  users.push(user);
  return { user };
}
//removeUser
const removeUser = (id) => {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}
//getUser
const getUser = (id) => {
  const foundUser = users.find(user => {
    return user.id === id
  })
  if (!foundUser) {
    return {
      error: 'user not found'
    }
  }
  return foundUser;
}
//getUsersInRoom
const getUsersInRoom = (room) => {
  return users.filter(user => user.room === room);
}

module.exports = {
  addUser,
  getUser,
  removeUser,
  getUsersInRoom
}