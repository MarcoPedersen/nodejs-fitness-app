//Exam prep

const router = require('express').Router();
const knex = require('knex');
const User = require('../models/User.js');
const Role = require('../models/Roles.js');
const Group = require('../models/Groups.js');
const {raw} = require('objection');

router.get('/test/', async (req, res) => {
  const user = await User.query().findById(2);
  // const role = await Role.query().findById(user.roleId);
  const userGroup1 = await user.$relatedQuery('groups');
  // const bob = await User.query().select('*').where('roleId', '<', '3');
  const groups = await Group.query().select('id', 'name', raw('concat(id,name)'));
  const userGroups = await User.query()
      .select('groups.*')
      .innerJoin('user_groups', 'user_groups.user_id', 'users.id' )
      .innerJoin('groups', 'user_groups.group_id', 'groups.id')
      .where('users.id', '2');
  console.log(userGroups, userGroup1);
  res.end();
});

router.get('/examTest', async (req, res) => {
  const roles = await Role.query();
  res.send(roles);
});

// <div id="test">

// <script>
// $.get( "/examTest", function( data ) {
//   console.log(data);
//   $("#test").text(data[1].name);
// });
// </script>



module.exports = router;

