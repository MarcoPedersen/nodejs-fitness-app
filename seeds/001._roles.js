exports.seed = function(knex) {
  return knex('roles').insert([ // password
    {
      name: 'Admin',
    },
    {
      name: 'Instructor',
    },
    {
      name: 'Member',
    },
  ]);
};
