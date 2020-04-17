const knex = require("../db");

exports.selectAllArticles = ({
  sort_by = "created_at",
  order = "desc",
  author,
  topic,
  limit = "10",
  p = "1",
}) => {
  if (!["asc", "desc"].includes(order)) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }
  if (/\D/.test(limit) || /\D/.test(p)) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }
  return knex("articles")
    .select(
      "articles.author",
      "articles.title",
      "articles.article_id",
      "articles.topic",
      "articles.created_at",
      "articles.votes"
    )
    .count("comment_id as comment_count")
    .leftJoin("comments", "comments.article_id", "articles.article_id")
    .modify((query) => {
      if (author !== undefined) query.where({ "articles.author": author });
    })
    .modify((query) => {
      if (topic !== undefined) query.where({ topic });
    })
    .groupBy("articles.article_id")
    .orderBy(sort_by, order)
    .limit(limit)
    .offset((p - 1) * limit)
    .then((dbResponse) => {
      if (dbResponse.length === 0)
        return Promise.reject({ status: 404, msg: "value not found" });
      return dbResponse;
    });
};

exports.selectArticleById = ({ article_id }) => {
  return knex("articles")
    .select(
      "articles.author",
      "articles.title",
      "articles.article_id",
      "articles.body",
      "articles.topic",
      "articles.created_at",
      "articles.votes"
    )
    .count("comment_id as comment_count")
    .leftJoin("comments", "comments.article_id", "articles.article_id")
    .where({ "articles.article_id": article_id })
    .groupBy("articles.article_id")
    .then((dbResponse) => {
      if (dbResponse.length === 0)
        return Promise.reject({ status: 404, msg: "value not found" });
      return dbResponse;
    });
};

exports.updateArticleById = ({ article_id }, { inc_votes: votes }) => {
  if (votes === undefined) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }
  return knex("articles")
    .where({ article_id })
    .increment({ votes })
    .returning("*");
};

exports.selectTotalCount = () => {
  return knex("articles").count("article_id as total_count");
};
