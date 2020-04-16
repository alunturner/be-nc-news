const knex = require("../db");

exports.selectArticleById = ({ article_id }) => {
  return knex("articles")
    .join("comments", "comments.article_id", "articles.article_id")
    .select(
      "articles.author",
      "articles.title",
      "articles.article_id",
      "articles.body",
      "articles.topic",
      "articles.created_at",
      "articles.votes"
    )
    .where({ "articles.article_id": article_id })
    .count("* as comment_count")
    .groupBy("articles.article_id")
    .then((dbResponse) => {
      if (dbResponse.length === 0)
        return Promise.reject({ status: 404, msg: "invalid article_id" });
      return dbResponse;
    });
};

exports.updateArticleById = ({ article_id }, { inc_votes: votes }) => {
  if (votes === undefined) {
    return Promise.reject({ status: 400, msg: "invalid object" });
  }
  return knex("articles")
    .where({ article_id })
    .increment({ votes })
    .returning("*");
};

exports.insertCommentByArticleId = () => {
  return knex("comments").select("*").where({ article_id: 1 });
};
