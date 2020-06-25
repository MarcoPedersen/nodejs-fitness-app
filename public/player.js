// Make connection
const socket = io.connect(window.location.protocol + '//' + window.location.host);

socket.on('playMusict', function(data) {
  feedback.innerHTML = '';
  output.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
});
