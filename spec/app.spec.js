process.env.NODE_ENV = "test";
const chai = require("chai");
const { expect } = chai;
chai.use(require("chai-sorted"));
const request = require("supertest");
const app = require("../app");
const knex = require("../db");

beforeEach(() => {
  return knex.seed.run();
});

after(() => {
  return knex.destroy();
});

describe("APP", () => {
  it("404: msg path not found if the path is not found", () => {
    return request(app)
      .get("/not_a_path")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).to.equal("path not found");
      });
  });
  describe("/api", () => {
    describe("/topics", () => {
      describe("GET", () => {
        it("200: responds with object, key of topics, value an array of topics, each with keys slug and description", () => {
          return request(app)
            .get("/api/topics")
            .expect(200)
            .then(({ body }) => {
              expect(body).to.have.key("topics");
              expect(body.topics).to.be.an("array");
              body.topics.forEach((topic) => {
                expect(topic).to.have.all.keys("slug", "description");
              });
            });
        });
        it("200: default sort order of topics is slug ascending", () => {
          return request(app)
            .get("/api/topics")
            .expect(200)
            .then(({ body }) => {
              expect(body.topics).to.be.ascendingBy("slug");
            });
        });
      });
      describe("INVALID METHODS", () => {
        it("405: msg invalid method if invalid method used", () => {
          const invalidMethods = ["post", "put", "patch", "delete"];
          const requests = invalidMethods.map((method) => {
            return request(app)
              [method]("/api/topics")
              .expect(405)
              .then(({ body }) => {
                expect(body.msg).to.equal("invalid method");
              });
          });
          return Promise.all(requests);
        });
      });
    });
    describe("/users", () => {
      describe("/:username", () => {
        describe("GET", () => {
          it("200: responds with object, key of user, value a single object with keys username, avatar_url and name", () => {
            return request(app)
              .get("/api/users/butter_bridge")
              .expect(200)
              .then(({ body }) => {
                expect(body).to.have.key("user");
                expect(body.user).to.be.an("object");
                expect(Object.entries(body.user)).to.have.length(3);
                expect(body.user).to.have.all.keys(
                  "username",
                  "avatar_url",
                  "name"
                );
              });
          });
          it("404: msg value not found if the username does not exist", () => {
            return request(app)
              .get("/api/users/missing_user")
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).to.equal("value not found");
              });
          });
        });
        describe("INVALID METHODS", () => {
          it("405: msg invalid method if invalid method used", () => {
            const invalidMethods = ["post", "put", "patch", "delete"];
            const requests = invalidMethods.map((method) => {
              return request(app)
                [method]("/api/users/icellusedkars")
                .expect(405)
                .then(({ body }) => {
                  expect(body.msg).to.equal("invalid method");
                });
            });
            return Promise.all(requests);
          });
        });
      });
    });
    describe("/articles", () => {
      describe("GET", () => {
        it("200: responds with object, key of articles, value an array of objects, each with keys author, title, article_id, topic, created_at, votes, comment_count", () => {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
              expect(body).to.have.key("articles");
              expect(body.articles).to.be.an("array");
              expect(body.articles).to.have.length(12);
              body.articles.forEach((article) => {
                expect(article).to.be.an("object");
                expect(article).to.have.all.keys(
                  "author",
                  "title",
                  "article_id",
                  "topic",
                  "created_at",
                  "votes",
                  "comment_count"
                );
              });
            });
        });
        it("200: default sort order is created_at desc", () => {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).to.be.descendingBy("created_at");
            });
        });
        describe("QUERIES", () => {
          it("200: accepts a sort_by query for any of the standard columns, default order is desc", () => {
            const columns = [
              "author",
              "title",
              "article_id",
              "topic",
              "created_at",
              "votes",
            ];
            const requests = columns.map((column) => {
              return request(app)
                .get("/api/articles")
                .query({ sort_by: column })
                .expect(200)
                .then(({ body }) => {
                  expect(body.articles).to.be.descendingBy(column);
                });
            });
            return Promise.all(requests);
          });
          it("200: accepts an order query for any of the standard columns, can sort as appropriate", () => {
            const columns = [
              "author",
              "title",
              "article_id",
              "topic",
              "created_at",
              "votes",
            ];
            const requests = columns.map((column) => {
              return request(app)
                .get("/api/articles")
                .query({ sort_by: column, order: "asc" })
                .expect(200)
                .then(({ body }) => {
                  expect(body.articles).to.be.ascendingBy(column);
                });
            });
            return Promise.all(requests);
          });
          it("200: accepts a sort_by query and order query for comment_count", () => {
            return request(app)
              .get("/api/articles")
              .query({ sort_by: "comment_count", order: "asc" })
              .expect(200)
              .then(({ body }) => {
                body.articles.forEach((article) => {
                  article.comment_count = parseInt(article.comment_count);
                });
                expect(body.articles).to.be.ascendingBy("comment_count");
              });
          });
          it("200: accepts an author query to filter by author", () => {
            return request(app)
              .get("/api/articles")
              .query({ author: "rogersop" })
              .expect(200)
              .then(({ body }) => {
                expect(body.articles).to.have.length(3);
                body.articles.forEach((article) => {
                  expect(article.author).to.equal("rogersop");
                });
              });
          });
          it("200: accepts a topic query to filter by topic", () => {
            return request(app)
              .get("/api/articles")
              .query({ topic: "cats" })
              .expect(200)
              .then(({ body }) => {
                expect(body.articles).to.have.length(1);
                body.articles.forEach((article) => {
                  expect(article.topic).to.equal("cats");
                });
              });
          });
          it("400: msg bad request if sort_by value is not a column", () => {
            return request(app)
              .get("/api/articles")
              .query({ sort_by: 23 })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("bad request");
              });
          });
          it("400: msg bad request if order value is not asc or desc", () => {
            return request(app)
              .get("/api/articles")
              .query({ order: "downwards" })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("bad request");
              });
          });
          it("404: msg value not found if author value is not in the db", () => {
            return request(app)
              .get("/api/articles")
              .query({ author: "not there" })
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).to.equal("value not found");
              });
          });
          it("404: msg value not found if topic value is not in the db", () => {
            return request(app)
              .get("/api/articles")
              .query({ topic: "not there" })
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).to.equal("value not found");
              });
          });
        });
      });
      describe("INVALID METHODS", () => {
        it("405: msg invalid method if invalid method used", () => {
          const invalidMethods = ["post", "put", "patch", "delete"];
          const requests = invalidMethods.map((method) => {
            return request(app)
              [method]("/api/articles")
              .expect(405)
              .then(({ body }) => {
                expect(body.msg).to.equal("invalid method");
              });
          });
          return Promise.all(requests);
        });
      });
      describe("/:article_id", () => {
        describe("GET", () => {
          it("200: responds with object, key of article, value a single object with keys author, title, article_id, body, topic, created_at, votes, comment_count", () => {
            return request(app)
              .get("/api/articles/1")
              .expect(200)
              .then(({ body }) => {
                expect(body).to.have.key("article");
                expect(body.article).to.be.an("object");
                expect(body.article).to.have.all.keys(
                  "author",
                  "title",
                  "article_id",
                  "body",
                  "topic",
                  "created_at",
                  "votes",
                  "comment_count"
                );
              });
          });
          it("200: responds with the correct values on each of the keys for article_id:1", () => {
            return request(app)
              .get("/api/articles/1")
              .expect(200)
              .then(({ body }) => {
                expect(body).to.have.key("article");
                expect(body.article).to.be.an("object");
                expect(body.article).to.deep.equal({
                  author: "butter_bridge",
                  title: "Living in the shadow of a great man",
                  article_id: 1,
                  body: "I find this existence challenging",
                  topic: "mitch",
                  created_at: "2018-11-15T12:21:54.171Z",
                  votes: 100,
                  comment_count: "13",
                });
              });
          });
          it("400: msg bad request if the parameter is not a number", () => {
            return request(app)
              .get("/api/articles/not_a_number")
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("bad request");
              });
          });
          it("404: msg value not found if the article_id is a number but does not exist", () => {
            return request(app)
              .get("/api/articles/493")
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).to.equal("value not found");
              });
          });
        });
        describe("PATCH", () => {
          it("200: responds with object, key of article, value a single object with keys author, title, article_id, body, topic, created_at, votes, comment_count", () => {
            return request(app)
              .patch("/api/articles/1")
              .send({ inc_votes: 1 })
              .expect(200)
              .then(({ body }) => {
                expect(body).to.have.key("article");
                expect(body.article).to.be.an("object");
                expect(body.article).to.have.all.keys(
                  "author",
                  "title",
                  "article_id",
                  "body",
                  "topic",
                  "created_at",
                  "votes"
                );
              });
          });
          it("200: uses the request body to change the relevant article votes for a positive integer", () => {
            return request(app)
              .patch("/api/articles/1")
              .send({ inc_votes: 25 })
              .expect(200)
              .then(({ body }) => {
                expect(body.article.votes).to.equal(125);
              });
          });
          it("200: uses the request body to change the relevant article votes for a negative integer", () => {
            return request(app)
              .patch("/api/articles/1")
              .send({ inc_votes: -25 })
              .expect(200)
              .then(({ body }) => {
                expect(body.article.votes).to.equal(75);
              });
          });
          it("400: msg: bad request when body is empty", () => {
            return request(app)
              .patch("/api/articles/1")
              .send({})
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("bad request");
              });
          });
          it("400: msg: bad request when body does not contain inc_votes", () => {
            return request(app)
              .patch("/api/articles/1")
              .send({ incorrect_key: 29 })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("bad request");
              });
          });
          it("400: msg: bad request when inc_votes key is present, but value is not a number", () => {
            return request(app)
              .patch("/api/articles/1")
              .send({ inc_votes: "not a number" })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("bad request");
              });
          });
          it("400: msg: bad request when inc_votes value is a non-integer number", () => {
            return request(app)
              .patch("/api/articles/1")
              .send({ inc_votes: "3.14159" })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("bad request");
              });
          });
        });
        describe("INVALID METHODS", () => {
          it("405: msg invalid method if invalid method used", () => {
            const invalidMethods = ["post", "put", "delete"];
            const requests = invalidMethods.map((method) => {
              return request(app)
                [method]("/api/articles/1")
                .expect(405)
                .then(({ body }) => {
                  expect(body.msg).to.equal("invalid method");
                });
            });
            return Promise.all(requests);
          });
        });
        describe("/comments", () => {
          describe("POST", () => {
            it("201: responds with object, key of comment, value a single object with keys comment_id, article_id, created_at, author, votes, body", () => {
              return request(app)
                .post("/api/articles/1/comments")
                .send({ username: "butter_bridge", body: "first" })
                .expect(201)
                .then(({ body }) => {
                  expect(body).to.have.key("comment");
                  expect(body.comment).to.be.an("object");
                  expect(body.comment).to.have.all.keys(
                    "comment_id",
                    "article_id",
                    "created_at",
                    "author",
                    "votes",
                    "body"
                  );
                });
            });
            it("201: values of the comment object reflect the input", () => {
              return request(app)
                .post("/api/articles/1/comments")
                .send({ username: "butter_bridge", body: "first" })
                .expect(201)
                .then(({ body }) => {
                  expect(body.comment).to.include({
                    comment_id: 19,
                    article_id: 1,
                    author: "butter_bridge",
                    votes: 0,
                    body: "first",
                  });
                  expect(Date.parse(body.comment.created_at)).to.be.a("number");
                });
            });
            it("400: msg: bad request when request body is undefined", () => {
              return request(app)
                .post("/api/articles/1/comments")
                .send()
                .expect(400)
                .then(({ body }) => {
                  expect(body.msg).to.equal("bad request");
                });
            });
            it("400: msg: bad request when request body does not have username key", () => {
              return request(app)
                .post("/api/articles/1/comments")
                .send({ body: "something" })
                .expect(400)
                .then(({ body }) => {
                  expect(body.msg).to.equal("bad request");
                });
            });
            it("400: msg: bad request when request body does not have body key", () => {
              return request(app)
                .post("/api/articles/1/comments")
                .send({ username: "butter_bridge" })
                .expect(400)
                .then(({ body }) => {
                  expect(body.msg).to.equal("bad request");
                });
            });
            it("400: msg: bad request when request body does not have body key", () => {
              return request(app)
                .post("/api/articles/1/comments")
                .send({ username: "butter_bridge" })
                .expect(400)
                .then(({ body }) => {
                  expect(body.msg).to.equal("bad request");
                });
            });
            it("404: msg: value not found if the username does not exist", () => {
              return request(app)
                .post("/api/articles/1/comments")
                .send({ username: "invalid", body: "something witty" })
                .expect(404)
                .then(({ body }) => {
                  expect(body.msg).to.equal("value not found");
                });
            });
            it("400: msg: bad request if the body value is undefined", () => {
              return request(app)
                .post("/api/articles/1/comments")
                .send({ username: "butter_bridge", body: undefined })
                .expect(400)
                .then(({ body }) => {
                  expect(body.msg).to.equal("bad request");
                });
            });
            it("400: msg bad request if the parameter is not a number", () => {
              return request(app)
                .post("/api/articles/not_a_number/comments")
                .send({ username: "butter_bridge", body: "something" })
                .expect(400)
                .then(({ body }) => {
                  expect(body.msg).to.equal("bad request");
                });
            });
            it("404: msg value not found if the article_id is a number but does not exist", () => {
              return request(app)
                .post("/api/articles/9999/comments")
                .send({ username: "butter_bridge", body: "something" })
                .expect(404)
                .then(({ body }) => {
                  expect(body.msg).to.equal("value not found");
                });
            });
          });
          describe("GET", () => {
            it("200: responds with object, key of comments, value an array of objects, each with keys comment_id, votes, created_at, author, body", () => {
              return request(app)
                .get("/api/articles/1/comments")
                .expect(200)
                .then(({ body }) => {
                  expect(body).to.have.key("comments");
                  expect(body.comments).to.be.an("array");
                  expect(body.comments).to.have.length(13);
                  body.comments.forEach((comment) => {
                    expect(comment).to.be.an("object");
                    expect(comment).to.have.all.keys(
                      "comment_id",
                      "votes",
                      "created_at",
                      "author",
                      "body"
                    );
                  });
                });
            });
            it("200: default sort order is created_at descending", () => {
              return request(app)
                .get("/api/articles/1/comments")
                .expect(200)
                .then(({ body }) => {
                  expect(body.comments).to.be.descendingBy("created_at");
                });
            });
            it("400: msg bad request if the parameter is not a number", () => {
              return request(app)
                .get("/api/articles/not_a_number/comments")
                .expect(400)
                .then(({ body }) => {
                  expect(body.msg).to.equal("bad request");
                });
            });
            it("404: msg value not found if the article_id is a number but does not exist", () => {
              return request(app)
                .get("/api/articles/9999/comments")
                .expect(404)
                .then(({ body }) => {
                  expect(body.msg).to.equal("value not found");
                });
            });
            describe("QUERIES", () => {
              it("200: can accept a sort_by query of any column name and sort the comments appropriately, default is descending", () => {
                const columns = [
                  "comment_id",
                  "votes",
                  "created_at",
                  "author",
                  "body",
                ];
                const requests = columns.map((column) => {
                  return request(app)
                    .get("/api/articles/1/comments")
                    .query({ sort_by: column })
                    .expect(200)
                    .then(({ body }) => {
                      expect(body.comments).to.be.descendingBy(column);
                    });
                });
                return Promise.all(requests);
              });
              it("200: can accept an order query of any column name and sort the comments appropriately, default is descending", () => {
                const columns = [
                  "comment_id",
                  "votes",
                  "created_at",
                  "author",
                  "body",
                ];
                const requests = columns.map((column) => {
                  return request(app)
                    .get("/api/articles/1/comments")
                    .query({ sort_by: column, order: "asc" })
                    .expect(200)
                    .then(({ body }) => {
                      expect(body.comments).to.be.ascendingBy(column);
                    });
                });
                return Promise.all(requests);
              });
              it("400: msg bad request if sort_by value is not a column", () => {
                return request(app)
                  .get("/api/articles/1/comments")
                  .query({ sort_by: "not a column", order: "asc" })
                  .expect(400)
                  .then(({ body }) => {
                    expect(body.msg).to.equal("bad request");
                  });
              });
              it("400: msg bad request if order  value is not asc or desc", () => {
                return request(app)
                  .get("/api/articles/1/comments")
                  .query({ sort_by: "votes", order: "going up" })
                  .expect(400)
                  .then(({ body }) => {
                    expect(body.msg).to.equal("bad request");
                  });
              });
            });
          });
          describe("INVALID METHODS", () => {
            it("405: msg invalid method if invalid method used", () => {
              const invalidMethods = ["patch", "put", "delete"];
              const requests = invalidMethods.map((method) => {
                return request(app)
                  [method]("/api/articles/1/comments")
                  .expect(405)
                  .then(({ body }) => {
                    expect(body.msg).to.equal("invalid method");
                  });
              });
              return Promise.all(requests);
            });
          });
        });
      });
    });
    describe("/comments", () => {
      describe("/:comment_id", () => {
        describe("PATCH", () => {
          it("200: response has key comment, value is an object with keys comment_id, votes, created_at, author, body, article_id", () => {
            return request(app)
              .patch("/api/comments/1")
              .send({ inc_votes: 1 })
              .expect(200)
              .then(({ body }) => {
                expect(body).to.have.key("comment");
                expect(body.comment).to.be.an("object");
                expect(body.comment).to.have.all.keys(
                  "comment_id",
                  "votes",
                  "created_at",
                  "author",
                  "body",
                  "article_id"
                );
              });
          });
          it("200: response has updated the votes value appropriately", () => {
            return request(app)
              .patch("/api/comments/1")
              .send({ inc_votes: 10 })
              .expect(200)
              .then(({ body }) => {
                expect(body.comment.votes).to.equal(26);
              });
          });
          it("400: msg: bad request when body is empty", () => {
            return request(app)
              .patch("/api/comments/1")
              .send({})
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("bad request");
              });
          });
          it("400: msg: bad request when body does not contain inc_votes", () => {
            return request(app)
              .patch("/api/comments/1")
              .send({ incorrect_key: 29 })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("bad request");
              });
          });
          it("400: msg: bad request when inc_votes key is present, but value is not a number", () => {
            return request(app)
              .patch("/api/comments/1")
              .send({ inc_votes: "not a number" })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("bad request");
              });
          });
          it("400: msg: bad request when inc_votes value is a non-integer number", () => {
            return request(app)
              .patch("/api/comments/1")
              .send({ inc_votes: "3.14159" })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("bad request");
              });
          });
        });
        describe("INVALID METHODS", () => {
          it("405: msg invalid method if invalid method used", () => {
            const invalidMethods = ["post", "put", "get"];
            const requests = invalidMethods.map((method) => {
              return request(app)
                [method]("/api/comments/1")
                .expect(405)
                .then(({ body }) => {
                  expect(body.msg).to.equal("invalid method");
                });
            });
            return Promise.all(requests);
          });
        });
      });
    });
  });
});
