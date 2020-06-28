const router = require('express').Router();
const User = require('../models/User.js');
const Role = require('../models/Roles.js');

router.get('/profile/', async (req, res) => {
  session = req.session;
  const {user_id, role_id} = session;
  const user = await User.query().findById(user_id);
  const roles = await Role.query();
  const {name} = await Role.query().findById(role_id);
  const groups = await user.$relatedQuery('groups');
  res.render('profile', {
    roleName: name,
    user: user,
    roles: roles,
    groups: groups,
  });
});

module.exports = router;
