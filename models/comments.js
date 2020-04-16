const knex = require("../db");

exports.insertCommentByArticleId = ({ article_id }, { username, body }) => {
  return knex("comments")
    .insert({ author: username, article_id, body })
    .returning("*");
};

exports.selectCommentsByArticleId = ({ article_id }) => {
  return knex("comments")
    .select("comment_id", "votes", "created_at", "author", "body")
    .orderBy("created_at", "desc")
    .where({ article_id })
    .then((dbResponse) => {
      if (dbResponse.length === 0)
        return Promise.reject({ status: 404, msg: "value not found" });
      return dbResponse;
    });
};
