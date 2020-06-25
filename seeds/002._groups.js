exports.seed = function(knex) {
  return knex('groups').insert([
    {name: 'Yoga'},
    {name: 'Hot-Yoga'},
    {name: 'Spinning'},
    {name: 'Crossfit'},
    {name: 'Fitness-Boxing'},
    {name: 'TRX'},
  ]);
};
