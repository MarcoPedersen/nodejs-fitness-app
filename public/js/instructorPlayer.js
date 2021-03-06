const socket = io.connect(window.location.protocol + '//' + window.location.host);
const audioPlayer = document.getElementById('audioPlayer');
const pitchControl = document.getElementById('pitch');
const groupId = $('#groupId').val()
;

socket.on('connect', function() {
  const sessionID = socket.id; //
  const groupSession = {
    'groupId': groupId,
    'socketId': sessionID,
  };
  socket.emit('openInstructorSession', groupSession);
});

function sessionAlive() {
  socket.emit('musicSessionAlive', true);
}

function streamToMembers(data) {
  socket.emit('playMusic', data);
}

function stopMusic() {
  socket.emit('stopMusicStream');
}

// listener for synchronization
socket.on('startStream', function() {
  streamToMembers({
    src: audioPlayer.src,
    name: 'bleh',
    time_stamp: audioPlayer.currentTime,
    pitch: audioPlayer.playbackRate,
  });
});

/* Adds Play and Pause button */
let playing = true;
function stopSong() {
  const audioPlayer = document.getElementById('audioPlayer');
  audioPlayer.pause();
  audioPlayer.currentTime = 0;
  stopMusic();
};

function playMusic(src, name, time_stamp, pitch) {
  const audioPlayer = document.getElementById('audioPlayer');
  const musicPlayer = $('#audioPlayer');
  musicPlayer.attr('src', src);
  musicPlayer.attr('time_stamp', time_stamp);
  musicPlayer.attr('pitch', pitch);
  streamToMembers({
    src: src,
    name: name,
    time_stamp: time_stamp,
    pitch: pitch,
  });
  audioPlayer.play();
}

function playPause() {
  const pp = document.querySelector('#play-pause');
  const song = document.querySelector('#audioPlayer');
  if (playing) {
    pp.textContent = 'Pause';
    receiveData();
    song.play();
    playing = false;
  } else {
    pp.innerHTML = 'Play';
    song.pause();
    playing = true;
  }
}

/* Pitch function */
function updatePitch() {
  const pitch = document.querySelector('#pitch');
  pitch.value = document.querySelector('#audioPlayer').playbackRate;
  document.querySelector('#pitchText').textContent = (pitch.value * 100).toFixed(0) + ' %';
}

setInterval(updatePitch, 1000);

function changePitch() {
  const song = document.getElementById('audioPlayer');
  const pitchBar = document.querySelector('#pitch');
  song.playbackRate = pitchBar.value;
  socket.emit('changePitch', pitchBar.value);
}

/* Update and Change audio progress. Adds audio progress controls */
function updateProgress() {
  const progress = document.querySelector('#progress');
  progress.max = document.querySelector('#audioPlayer').duration;
  progress.value = document.querySelector('#audioPlayer').currentTime;
}

setInterval(updateProgress, 1000);

function changeProgress() {
  const progress = document.querySelector('#progress');
  audioPlayer.currentTime = progress.value;
  socket.emit('changePlaybackTime', progress.value);
}

/* Update and Change volume. Adds volume controls */
function updateVolume() {
  const volume = document.querySelector('#volume');
  volume.value = document.querySelector('#audioPlayer').volume;
}

setInterval(updateVolume, 1000);

function changeVolume() {
  const song = document.querySelector('#audioPlayer');
  song.volume = document.querySelector('#volume').value;
}
