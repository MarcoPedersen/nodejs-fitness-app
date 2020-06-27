const router = require('express').Router();
const Group = require('../models/Groups.js');
const User = require('../models/User.js');
const Role = require('../models/Roles.js');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const saltRounds = 12;

/*
GROUPS
 */

// show groups
router.get('/admin/groups', async (req, res) => {
  const groups = await Group.query();
  const data = {
    groups: groups,
  };
  session = req.session;
  if (session.username) {
    res.render('admin/groups/view', data);
  } else {
    show403(res);
  }
});

// display specific group to edit
router.get('/admin/groups/edit/:groupId', async (req, res) => {
  const {groupId} = req.params;
  const group = await Group.query().findById(groupId);
  session = req.session;
  if (session.username) {
    res.render('admin/groups/edit', {group: group});
  } else {
    show403(res);
  }
});

// edit an existing group
router.post('/admin/groups/update', async (req, res) => {
  const {id, name} = req.body;
  const numberOfAffectedRows = await Group.query()
      .update({name: name})
      .where('id', id);
  session = req.session;
  if (session.username) {
    redirect(res, '/admin/groups/');
  } else {
    show403(res);
  }
});

// add an aditional group
router.get('/admin/groups/add', async (req, res) => {
  session = req.session;
  if (session.username) {
    res.render('admin/groups/add');
  } else {
    show403(res);
  }
});

// post route for adding new group
router.post('/admin/groups/save', async (req, res) => {
  const {name} = req.body;
  await Group.query().insert({
    name: name,
  });
  session = req.session;
  if (session.username) {
    redirect(res, '/admin/groups/');
  } else {
    show403(res);
  }
});

// post route for deleting a group
router.post('/admin/groups/delete', async (req, res) => {
  const {id} = req.body;
  await Group.query().deleteById(id);
  session = req.session;
  if (session.username) {
    redirect(res, '/admin/groups/');
  } else {
    show403(res);
  }
});

/*
USERS
 */

// user routes, and inner join on role names and users roleId
router.get('/admin/users', async (req, res) => {
  const users = await User.query()
      .select('users.*', 'roles.name as role')
      .innerJoin('roles', 'roles.id', 'users.roleId');
  const data = {
    users: users,
  };
  session = req.session;
  if (session.username) {
    res.render('admin/users/view', data);
  } else {
    show403(res);
  }
});

// add an aditional user
router.get('/admin/users/add', async (req, res) => {
  const roles = await Role.query();
  session = req.session;
  if (session.username) {
    res.render('admin/users/add', {
      roles: roles,
    });
  } else {
    show403(res);
  }
});

// post route for adding new user
router.post('/admin/users/save', async (req, res) => {
  const {firstName, lastName, username, password, email, roleId} = req.body;
  bcrypt.hash(password, saltRounds).then((hashedPassword) => {
    User.query().insert({
      firstName: firstName,
      lastName: lastName,
      username: username,
      password: hashedPassword,
      email: email,
      roleId: roleId,
    }).then((createdUser) => {
      return redirect(res, '/admin/users/');
    });
  });
});

// edit an existing user
router.get('/admin/users/edit/:userId', async (req, res) => {
  const {userId} = req.params;
  const user = await User.query().findById(userId);
  const roles = await Role.query();
  const groups = await Group.query();
  const userGroups = await user.$relatedQuery('userGroups');
  res.render('admin/users/edit', {
    user: user,
    roles: roles,
    groups: groups,
    userGroups: userGroups,
    helpers: {
      ifEquals: function(arg1, arg2, options) {
        return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
      },
      ifInArray: function(haystack, needle, options) {
        return (_.find(haystack, {groupId: needle})) ? options.fn(this) : options.inverse(this);
      },
    },
  },
  );
});

// save edited user changes to DB
router.post('/admin/users/update', async (req, res) => {
  const {firstName, lastName, username, email, roleId, groups, id} = req.body;
  const numberOfAffectedRows = await User.query()
      .update({
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: email,
        roleId: roleId,
      })
      .where('id', id);
  assignUsergroups(id, groups);
  session = req.session;
  if (session.username) {
    redirect(res, '/admin/users/');
  } else {
    show403(res);
  }
});

// post route for deleting a user
router.post('/admin/users/delete', async (req, res) => {
  const {id} = req.body;
  await User.query().deleteById(id);
  session = req.session;
  if (session.username) {
    redirect(res, '/admin/users/');
  } else {
    show403(res);
  }
});

/*
ROLES
 */

// show roles
router.get('/admin/roles', async (req, res) => {
  const roles = await Role.query();
  const data = {
    roles: roles,
  };
  session = req.session;
  if (session.username) {
    res.render('admin/roles/view', data);
  } else {
    show403(res);
  }
});

// display specific role to edit
router.get('/admin/roles/edit/:Id', async (req, res) => {
  const {Id} = req.params;
  const role = await Role.query().findById(Id);
  session = req.session;
  if (session.username) {
    res.render('admin/roles/edit', {role: role});
  } else {
    show403(res);
  }
});

// edit an existing role
router.post('/admin/roles/update', async (req, res) => {
  const {id, name} = req.body;
  const numberOfAffectedRows = await Role.query()
      .update({name: name})
      .where('id', id);
  session = req.session;
  if (session.username) {
    redirect(res, '/admin/roles/');
  } else {
    show403(res);
  }
});

// add an aditional role
router.get('/admin/roles/add', async (req, res) => {
  session = req.session;
  if (session.username) {
    res.render('admin/roles/add');
  } else {
    show403(res);
  }
});

// post route for adding new role
router.post('/admin/roles/save', async (req, res) => {
  const {name} = req.body;
  await Role.query().insert({
    name: name,
  });
  session = req.session;
  if (session.username) {
    redirect(res, '/admin/roles/');
  } else {
    show403(res);
  }
});

// post route for deleting a role
router.post('/admin/roles/delete', async (req, res) => {
  const {id} = req.body;
  await Role.query().deleteById(id);
  session = req.session;
  if (session.username) {
    redirect(res, '/admin/roles/');
  } else {
    show403(res);
  }
});

async function assignUsergroups(userId, selectedGroups) {
  const groups = await Group.query();
  const user = await User.query().findById(userId);
  let i;
  for (i = 0; i < groups.length; i++) {
    const {id} = groups[i];
    const group = await user.$relatedQuery('userGroups').where('groupId', id);
    if (selectedGroups.includes(id.toString())) {
      if ( group.length == 0 || group === undefined) {
        await user.$relatedQuery('userGroups').insert({groupId: id});
      }
    } else {
      await User.relatedQuery('userGroups').for(user).unrelate().where('groupId', id);
    }
  }
}

function redirect(response, url) {
  response.writeHead(302, {
    'Location': url,
  });
  response.end();
}

function show403(res) {
  return res.render('errors/403');
}

module.exports = router;
