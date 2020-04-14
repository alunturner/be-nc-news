const knex = require("../db");

exports.selectAllTopics = () => {
  return knex("topics").select("*");
};
