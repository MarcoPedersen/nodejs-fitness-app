
const socket = io.connect(window.location.protocol + '//' + window.location.host);

let audioPlayer = document.getElementById('audioPlayer'),
  pitchControl = document.getElementById('pitch'),
  progressControl = document.getElementById('progress'),
  isMusicPlaying = false,
  playBtn = $('#playBtn'),
  groupId = $("#groupId").val();

$('#playBtn').click(function () {
  playBtn.val('Synched')
  socket.emit('startStream', groupId)
});

// SOCKET EVENT LISTENERS
socket.on('connect', function() {
  const sessionID = socket.id;
  let groupSession = {
    "groupId": groupId,
    "socketId": sessionID,
  }
  socket.emit('startTrainingSession', groupSession);
});

socket.on('streamMusic', function (data) {
  if(playBtn.val() != 'notSynched' ) {
    playMusic(data.src, data.name, data.time_stamp, data.pitch);
  }
});

socket.on('musicSessionAlive', function (data) {
  if (data != true) {
    stopSong()
  }
});

socket.on('stopMusicStream', function (data) {
  alert('Instructor closed the session');
  stopSong()
});

socket.on('changePlaybackTime', function (playbackTime) {
  changeProgress(playbackTime)
});

socket.on('changePitch', function (pitch) {
  changePitch(pitch)
  updatePitch(pitch)
});

socket.on('noSessionFound', function () {
  alert('No active session for this group');
});

function updatePitch(pitch = null) {
  pitchControl.value = audioPlayer.playbackRate
  pitchControl.textContent = (pitch.value * 100).toFixed(0) + " %"
}

function changePitch(pitch = null) {
  audioPlayer.playbackRate = (pitch ? pitch : pitchControl.value)
}

function changeProgress(playbackTime = null) {
  audioPlayer.currentTime = (playbackTime ? playbackTime : progressControl.value)
}

function playMusic(src, name, time_stamp, pitch) {
  const musicPlayer = $("#audioPlayer");
  if (audioPlayer.src != src) {
    musicPlayer.attr('src', src);
  }
  musicPlayer.attr('time_stamp', time_stamp);
  musicPlayer.attr('pitch', pitch);
  audioPlayer.play()
}

function stopSong() {
  audioPlayer.pause();
  audioPlayer.currentTime = 0;
};

/* Adds Play and Pause button */
var playing = true
function playPause() {
  const pp = document.querySelector('#play-pause'),
    song = audioPlayer
  if (playing) {
    pp.textContent = "Pause"
    song.play()
    playing = false
  } else {
    pp.innerHTML = "Play"
    song.pause()
    playing = true
  }
}

/* Update and Change audio progress. Adds audio progress controls */
function updateProgress(playbackTime) {
  const progress = document.querySelector('#progress')
  progress.max = audioPlayer.duration
  progress.value = audioPlayer.currentTime
}

setInterval(updateProgress, 1000)

/* Update and Change volume. Adds volume controls */
function updateVolume() {
  const volume = document.querySelector('#volume')
  volume.value = audioPlayer.volume
}

setInterval(updateVolume, 1000)

function changeVolume() {
  const song = audioPlayer
  song.volume = document.querySelector('#volume').value
}
