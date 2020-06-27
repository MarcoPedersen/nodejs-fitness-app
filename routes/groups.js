const router = require('express').Router();
const Group = require('../models/Groups.js');
const User = require('../models/User.js');
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({
  'extended': true,
}));

router.use(bodyParser.json());

router.get('/groups', async (req, res) => {
  session = req.session;
  let role = '';
  switch (session.role_id) {
    case 1:
      role = 'admin';
      break;
    case 2:
      role = 'instructor';
      break;
    case 3:
      role = 'member';
      break;
    default:
      role = 'member';
  }
  const user = await User.query().findById(session.user_id);
  let groups = await user
      .$relatedQuery('groups')
      .orderBy('name');
  if (groups instanceof Group) {
    groups = [groups];
  }
  const config = {
    showTitle: true,
    message: '',
    userGroups: groups,
    role: role,
  };
  res.render('groups', config);
});

module.exports = router;
