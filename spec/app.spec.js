process.env.NODE_ENV = "test";
const { expect } = require("chai");
const request = require("supertest");
const app = require("../app");
const knex = require("../db");

beforeEach(() => {
  console.log(`reseeding: ${process.env.NODE_ENV}`);
  return knex.seed.run();
});

after(() => {
  return knex.destroy();
});

describe("APP", () => {
  it("404: path not found if invalid path", () => {
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
      });
    });
  });
});
