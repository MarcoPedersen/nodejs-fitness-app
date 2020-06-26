const router = require('express').Router();
const User = require('../models/User.js');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 12;

router.use(bodyParser.urlencoded({
  'extended': true,
}));

router.use(bodyParser.json());

router.get('/users', async (req, res) => {
  const allUsersWithGroups = await User.query().select('username').withGraphFetched('groups');
  return res.send({response: allUsersWithGroups});
});

router.get('/register', (req, res) => {
  return res.render('register');
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

router.get('/getsession', (req, res) =>{
  return res.send({response: req.session.username});
});

module.exports = router;
