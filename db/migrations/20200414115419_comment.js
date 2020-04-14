exports.up = function (knex) {
  console.log("creating comment schema...");
  return knex.schema.createTable("comment", (table) => {
    table.increments("comment_id").primary();
    table.string("author").references("user.username");
    table.integer("article_id").references("article.article_id");
    table.integer("votes").defaultTo(0);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.text("body").notNullable();
  });
};

exports.down = function (knex) {
  console.log("removing comment schema...");
  return knex.schema.dropTable("comment");
};
