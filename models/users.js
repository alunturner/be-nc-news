const knex = require("../db");

exports.selectUserByUsername = ({ username }) => {
  return knex("users")
    .select("username", "avatar_url", "name")
    .where({ username })
    .then((dbResponse) => {
      if (dbResponse.length === 0)
        return Promise.reject({ status: 400, msg: "invalid parameter" });
      return dbResponse;
    });
};
