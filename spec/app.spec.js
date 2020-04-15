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
  it("404: msg invalid path if the path is not found", () => {
    return request(app)
      .get("/not_a_path")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).to.equal("invalid path");
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
          it("404: msg invalid username if the username does not exist", () => {
            return request(app)
              .get("/api/users/missing_user")
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).to.equal("invalid username");
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
      describe("/:article_id", () => {
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
        it("400: msg invalid parameter if the parameter is not a number", () => {
          return request(app)
            .get("/api/articles/not_a_number")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("invalid parameter");
            });
        });
        it("404: msg invalid article_id if the article_id is a number but does not exist", () => {
          return request(app)
            .get("/api/articles/493")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("invalid article_id");
            });
        });
      });
    });
  });
});
