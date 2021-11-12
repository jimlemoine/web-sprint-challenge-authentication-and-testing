
exports.seed = async function(knex) {
  await knex('users').truncate()
  await knex('users').insert([
        { username: 'foo', password: '1234' },
      ]);
};
