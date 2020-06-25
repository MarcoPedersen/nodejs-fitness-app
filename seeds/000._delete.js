exports.seed = function(knex) {
  return knex('user_groups').del()
      .then(function() {
        return knex('groups').del();
      })
      .then(function() {
        return knex('users').del();
      })
      .then(function() {
        return knex('roles').del();
      });
};
