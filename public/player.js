// Make connection
const socket = io.connect('http://localhost:8000');

socket.on('playMusict', function(data) {
  feedback.innerHTML = '';
  output.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
});
