require('dotenv').config();
const {knexSnakeCaseMappers} = require('objection');
module.exports = {

  development: {
    client: 'mysql',
    connection: {
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
    },
    ...knexSnakeCaseMappers(),
  },
};
