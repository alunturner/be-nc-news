exports.up = function (knex) {
  return knex.schema.createTable("comments", (table) => {
    table.increments("comment_id").primary();
    table.string("author").references("users.username").notNullable();
    table
      .integer("article_id")
      .references("articles.article_id")
      .onDelete("CASCADE");
    table.integer("votes").notNullable().defaultTo(0);
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.text("body").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("comments");
};
