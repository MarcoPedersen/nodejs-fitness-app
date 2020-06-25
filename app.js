const express = require('express');
const handlebars = require('express-handlebars');
const session = require('express-session');
const socket = require('socket.io');
const _ = require('lodash');
const app = express();

app.use(express.json());
app.use(express.static(__dirname + '/public'));

// Handlebars
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');

const config = require('./config/config.json');

app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: true,
}));

const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use(limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 80, // limit each IP to 80 requests per windowMs
});

app.use('/signup', authLimiter);
app.use('/login', authLimiter);

/* Setup Knex with Objection */

const {Model} = require('objection');
const Knex = require('knex');
const knexfile = require('./knexfile.js');
const knex = Knex(knexfile.development);

Model.knex(knex);

const authRoute = require('./routes/auth.js');
const usersRoute = require('./routes/users.js');
const pagesRoute = require('./routes/pages.js');
const groupsRoute = require('./routes/groups.js');
const instructorRoute = require('./routes/instructor.js');
const memberRoute = require('./routes/member.js');
const adminRoute = require('./routes/admin.js');

app.use(authRoute);
app.use(usersRoute);
app.use(pagesRoute);
app.use(groupsRoute);
app.use(instructorRoute);
app.use(memberRoute);
app.use(adminRoute);

const server = app.listen(3000, function() {
  console.log('listening for requests on port 3000');
});

const io = socket(server);
const groupSessions = [];
const memberSessions = [];

// handlers
io.on('connection', (socket) => {
  // playMusic handler
  socket.on('playMusic', function(data) {
    io.sockets.emit('streamMusic', data);
  });
  // stopMusic handler
  socket.on('stopMusicStream', function() {
    io.sockets.emit('stopMusicStream');
  });
  // changePlaybackTime handler
  socket.on('changePlaybackTime', function(playbackTime) {
    io.sockets.emit('changePlaybackTime', playbackTime);
  });
  // change pitch handler
  socket.on('changePitch', function(pitch) {
    io.sockets.emit('changePitch', pitch);
  });
  // start synchronization or checks if session exists
  socket.on('startStream', function(groupId) {
    if (doesGroupSessionExists(groupId)) {
      io.sockets.emit('startStream');
    } else {
      io.sockets.emit('noSessionFound');
    };
  });
  // musicSession handler
  socket.on('musicSessionAlive', function(data) {
    io.sockets.emit('musicSessionAlive', data);
  });

  // disconnect handler
  socket.on('disconnect', function() {
    const membersToDisconnect = getMembersToDisconnect(socket.id);
    let i;
    for (i = 0; i < membersToDisconnect.length; i++) {
      const memberSocketId = membersToDisconnect[i];
      if (io.sockets.sockets[memberSocketId]) {
        io.sockets.emit('stopMusicStream');
        //  socket manual disconnection
        io.sockets.sockets[memberSocketId].disconnect();
      }
      membersToDisconnect.splice(i);
    }
    const groupSession = getGroupSessionBySocketId(socket.id);
    if (groupSession) {
      const {groupId} = groupSession;
      _.remove(groupSessions, {groupId: groupId});
    }
  });

  // open group session handler
  socket.on('openInstructorSession', function(data) {
    const groupSessionIndex = getGroupSessionIndex(data.groupId);
    if (groupSessionIndex != -1 ) {
      groupSessions[groupSessionIndex] = data;
    } else {
      groupSessions.push(data);
    }
  });

  socket.on('startTrainingSession', function(data) {
    if (doesGroupSessionExists(data.groupId)) {
      joinMusicSession(data);
    } else {
      io.sockets.emit('noSessionFound');
    }
  });
});
/* +
* @param string socketId
* @return array
 */
function getGroupSessionBySocketId(socketId) {
  return _.find(groupSessions, {'socketId': socketId});
}

function getMembersToDisconnect(socketId) {
  let membersToDisconnect = [];
  const disconnectedSocketSessionId = socketId;
  const groupSession = _.find(groupSessions, {'socketId': disconnectedSocketSessionId});
  if (groupSession) {
    const {groupId} = groupSession;
    const groupMemberSessions = _.find(memberSessions, {'groupId': groupId});
    if (groupMemberSessions && groupMemberSessions.members.length > 0) {
      membersToDisconnect = groupMemberSessions.members;
    }
  }
  return membersToDisconnect;
}

function getGroupSessionIndex(groupId) {
  return _.findIndex(groupSessions, {'groupId': groupId});
}

function doesGroupSessionExists(groupId) {
  return (getGroupSessionIndex(groupId) != -1) ? true : false;
}

function joinMusicSession(data) {
  const {socketId, groupId} = data;

  const memberSessionIndex = _.findIndex(memberSessions, {'groupId': groupId});

  if (memberSessionIndex != -1 ) {
    memberSessions[memberSessionIndex].members.push(socketId);
  } else {
    memberSessions.push({
      groupId: groupId,
      members: [socketId],
    });
  }
}

function getUserSession(req, res) {
  console.log(req.session);
}

// const PORT = 3000;

// app.listen(PORT, (error) => {
//   if (error) {
//     console.log(error);
//   }
//   console.log('Server is running on the port', PORT);
// });
