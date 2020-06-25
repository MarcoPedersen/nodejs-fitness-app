exports.seed = function(knex) {
  return knex('users').select().then((users) => {
    if (users.length >= 2) {
      return knex('user_groups').insert([
        {user_id: users[0].id, group_id: 1},
        {user_id: users[0].id, group_id: 2},
        {user_id: users[1].id, group_id: 2},
      ]);
    }
  });
};
