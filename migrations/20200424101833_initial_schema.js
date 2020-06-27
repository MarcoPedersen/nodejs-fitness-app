exports.up = function(knex) {
  return knex.schema
      .createTable('roles', (table) => {
        table.increments('id');
        table.string('name');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.dateTime('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));
        table.timestamp('deleted_at').nullable().defaultTo(knex.raw('NULL'));
      })
      .createTable('users', (table) => {
        table.increments('id');
        table.string('first_name').notNullable();
        table.string('last_name').notNullable();
        table.string('username').unique().notNullable();
        table.string('password').notNullable();
        table.string('email').unique().notNullable();
        table.integer('role_id').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.dateTime('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));
        table.timestamp('deleted_at').nullable().defaultTo(knex.raw('NULL'));
      })
      .createTable('groups', (table) => {
        table.increments('id');
        table.string('name').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.dateTime('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));
      })
      .createTable('user_groups', (table) => {
        table.integer('user_id').notNullable();
        table.integer('group_id').notNullable();
      });
};
exports.down = function(knex) {
  return knex.schema
      .dropTableIfExists('user_groups')
      .dropTableIfExists('groups')
      .dropTableIfExists('users')
      .dropTableIfExists('roles')
      .dropTableIfExists('admin');
};
