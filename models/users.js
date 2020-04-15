const knex = require("../db");

exports.selectUserByUsername = ({ username }) => {
  return knex("users")
    .select("username", "avatar_url", "name")
    .where({ username });
};
