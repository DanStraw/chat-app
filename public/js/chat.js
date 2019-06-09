const socket = io();

//elements
const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');
const $sidebar = document.querySelector('#sidebar');

//templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

//options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

const autoScroll = () => {
  //get new message element
  const $newMessage = $messages.lastElementChild;

  //get height of $newMessage
  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom)
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  const visibleHeight = $messages.offsetHeight;

  //height of messages container
  const containerHeight = $messages.scrollHeight;

  //how far have we scrolled
  const scrollOffset = $messages.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight;
  }
}

socket.on('message', (message) => {
  const html = Mustache.render(messageTemplate, {
    username: message.username || "Admin",
    message: message.text,
    createdAt: moment(message.createdAt).format("DD MMM 'YY, h:m:s a")
  });
  $messages.insertAdjacentHTML('beforeend', html);
  autoScroll();
});

socket.on('locationMessage', (message) => {
  const html = Mustache.render(locationTemplate, {
    username: message.username,
    url: message.url,
    createdAt: moment(message.createdAt).format("DD MMM 'YY, h:m:s a")
  });
  $messages.insertAdjacentHTML('beforeend', html);
  autoScroll();
});

socket.on('roomData', ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, { room, users });
  document.querySelector('#sidebar').innerHTML = html;
})

$messageForm.addEventListener('submit', (event) => {
  event.preventDefault();
  $messageFormButton.setAttribute('disabled', 'disabled');
  let message = event.target.elements.message.value;

  socket.emit('sendMessage', message, (error) => {
    $messageFormButton.removeAttribute('disabled');
    $messageFormInput.value = '';
    $messageFormInput.focus();
    if (error) {
      console.log(error);
    } else {
      console.log('message delivered');
    }
  });

});

$sendLocationButton.addEventListener('click', (e) => {
  e.preventDefault();
  if (!navigator.geolocation) {
    return alert('geolocation not supported by your browser');
  }
  $sendLocationButton.setAttribute('disabled', 'disabled');

  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords;
    socket.emit('sendLocation', { latitude, longitude }, () => {
      $sendLocationButton.removeAttribute('disabled');
    })
  });
});

socket.emit('join', { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = '/';
  }
});
