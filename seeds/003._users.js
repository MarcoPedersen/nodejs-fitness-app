exports.seed = function(knex) {
  return knex('users').insert([
    {
      username: 'admin',
      password: '$2b$12$5QDQYCAoCTuAthCIw5hbt.IU1.JMyG9iZEdjXiUyNgPrgEBrqF6TS',
      first_name: 'Bob',
      last_name: 'Dylan',
      email: '123@hotmail.com',
      role_id: '1',
    },
    {
      username: 'instructor',
      password: '$2b$12$5QDQYCAoCTuAthCIw5hbt.IU1.JMyG9iZEdjXiUyNgPrgEBrqF6TS',
      first_name: 'Alan',
      last_name: 'Fallan',
      email: '321@hotmail.com',
      role_id: '2',
    },
    {
      username: 'member',
      password: '$2b$12$5QDQYCAoCTuAthCIw5hbt.IU1.JMyG9iZEdjXiUyNgPrgEBrqF6TS',
      first_name: 'Jane',
      last_name: 'Doe',
      email: '432@hotmail.com',
      role_id: '3',
    },
  ]);
};
