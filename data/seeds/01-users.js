const bcrypt = require('bcryptjs');

exports.seed = async function(knex) {
  await knex('users').truncate()
  await knex('users').insert([
        { username: 'foo', password: bcrypt.hashSync('1234', 8) },
      ]);
};
