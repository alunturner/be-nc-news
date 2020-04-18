const knex = require("../db");

exports.insertCommentByArticleId = ({ article_id }, { username, body }) => {
  return knex("comments")
    .insert({ author: username, article_id, body })
    .returning("*");
};

exports.selectCommentsByArticleId = (
  { article_id },
  { sort_by = "created_at", order = "desc", limit = 10, p = 1 }
) => {
  if (!["asc", "desc"].includes(order)) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }
  if (/\D/.test(limit) || /\D/.test(p)) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }
  return knex("comments")
    .select("comment_id", "votes", "created_at", "author", "body")
    .where({ article_id })
    .orderBy(sort_by, order)
    .limit(limit)
    .offset((p - 1) * limit)
    .then((dbResponse) => {
      if (dbResponse.length === 0)
        return Promise.reject({ status: 404, msg: "value not found" });
      return dbResponse;
    });
};

exports.updateCommentById = ({ comment_id }, { inc_votes: votes }) => {
  return knex("comments")
    .where({ comment_id })
    .increment({ votes })
    .returning("*");
};

exports.delCommentById = ({ comment_id }) => {
  return knex("comments")
    .where({ comment_id })
    .del()
    .returning("*")
    .then((dbResponse) => {
      if (dbResponse.length === 0)
        return Promise.reject({ status: 404, msg: "value not found" });
    });
};
