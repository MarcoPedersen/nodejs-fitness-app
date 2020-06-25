const router = require('express').Router();
const User = require('../models/User.js');
const bcrypt = require('bcrypt');
const saltRounds = 12;
const fs = require('fs');
const header = fs.readFileSync('./public/pages/fragments/header.html', 'utf8');
const footer = fs.readFileSync('./public/pages/fragments/footer.html', 'utf8');
const loginPage = fs.readFileSync('./public/pages/login.html', 'utf8');
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({
  'extended': true,
}));

router.use(bodyParser.json());

router.get('/login', (req, res) => {
  return res.send(header + loginPage + footer);
});

router.post('/login', (req, res) => {
  const sess = req.session;
  const {username, password} = req.body;
  if (!isValid(username, password)) {
    return res.status(400).send({response: 'username or passwords cannot be empty'});
  } else {
    try {
      User.query().select('username', 'password', 'role_id', 'id').where('username', username).then((foundUser) => {
        if (foundUser.length > 0) {
          bcrypt.compare(password, foundUser[0].password).then((result) => {
            if (result == true) {
              sess.username = username;
              sess.role_id = foundUser[0].roleId;
              sess.user_id = foundUser[0].id;
              return res.send({
                response: 'the user has successfully logged in',
              });
            }
          });
        } else {
          return res.status(400).send({response: 'username or passwords does not match'});
        }
      });
    } catch (e) {
      return res.status(500).send({response: 'Something went wrong with the request'});
    }
  }
});


router.post('/signup', (req, res) => {
  const {username, password, firstname, lastname, email} = req.body;
  if (username && password) {
    if (password.length < 8) {
      return res.status(400).send({response: 'Password must be 8 characters or longer'});
    } else {
      try {
        User.query().select('username').where('username', username).then((foundUser) => {
          if (foundUser.length > 0) {
            return res.status(400).send({response: 'User already exists'});
          } else {
            bcrypt.hash(password, saltRounds).then((hashedPassword) => {
              User.query().insert({
                username,
                password: hashedPassword,
                first_name: firstname,
                last_name: lastname,
                email: email,
                role_id: 1,
              }).then((createdUser) => {
                return res.send({response: `The user ${createdUser.username} was created`});
              });
            });
          }
        });
      } catch (error) {
        return res.status(500).send({response: 'Something went wrong with the DB'});
      }
    }
  } else {
    return res.status(400).send({response: 'username or password missing'});
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy((errors) => {
    if (errors) {
      return console.log(errors);
    }
    res.redirect('/');
  });
});

function isValid(username, password) {
  if (username && password) {
    return true;
  }
  return false;
}


module.exports = router;
