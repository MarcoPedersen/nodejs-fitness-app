const router = require('express').Router();
const User = require('../models/User.js');
const fs = require('fs');
const registerPage = fs.readFileSync('./public/user/register.html', 'utf8');
const header = fs.readFileSync('./public/pages/fragments/header.html', 'utf8');
const footer = fs.readFileSync('./public/pages/fragments/footer.html', 'utf8');
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({
  'extended': true,
}));

router.use(bodyParser.json());

router.get('/users', async (req, res) => {
  const allUsersWithGroups = await User.query().select('username').withGraphFetched('groups');
  return res.send({response: allUsersWithGroups});
});

router.get('/register', (req, res) => {
  return res.send(header + registerPage + footer);
});

router.get('/getsession', (req, res) =>{
  return res.send({response: req.session.username});
});

module.exports = router;
