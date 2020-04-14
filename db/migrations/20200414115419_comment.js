exports.up = function (knex) {
  console.log("creating comments schema...");
  return knex.schema.createTable("comments", (table) => {
    table.increments("comment_id").primary();
    table.string("author").references("users.username");
    table.integer("article_id").references("articles.article_id");
    table.integer("votes").defaultTo(0);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.text("body").notNullable();
  });
};

exports.down = function (knex) {
  console.log("removing comments schema...");
  return knex.schema.dropTable("comments");
};
