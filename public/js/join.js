const socket = io();

const $searchTypeSelect = document.querySelector('#search-type-select');
const $roomSelect = document.querySelector("#room-select");
const $input = document.querySelector('#input');
const $select = document.querySelector('#select');
const $inputForm = document.querySelector('#input-form');
const $selectForm = document.querySelector('#select-form');
const $backButton = document.querySelector('#back');

const roomOptionTemplate = document.querySelector('#room-option-template').innerHTML;

$input.addEventListener('click', (e) => {
  e.preventDefault();
  $searchTypeSelect.setAttribute('hidden', 'hidden');
  $inputForm.removeAttribute('hidden');
  $backButton.removeAttribute('hidden');
});

$select.addEventListener('click', (e) => {
  e.preventDefault();
  $searchTypeSelect.setAttribute('hidden', 'hidden');
  $selectForm.removeAttribute('hidden');
  $backButton.removeAttribute('hidden');
});

$backButton.addEventListener('click', (e) => {
  e.preventDefault();
  $searchTypeSelect.removeAttribute('hidden');
  $backButton.setAttribute('hidden', 'hidden');
  $inputForm.setAttribute('hidden', 'hidden');
  $selectForm.setAttribute('hidden', 'hidden');
})

socket.emit('login');

socket.on('showRooms', rooms => {
  const html = Mustache.render(roomOptionTemplate, { rooms });
  document.querySelector('#room-select').innerHTML = html;
})

