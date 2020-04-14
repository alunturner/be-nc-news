exports.up = function (knex) {
  console.log("creating article schema...");
  return knex.schema.createTable("article", (table) => {
    table.increments("article_id").primary();
    table.string("title");
    table.text("body").notNullable();
    table.integer("votes").defaultTo(0);
    table.string("topic").references("topic.slug");
    table.string("author").references("user.username");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  console.log("removing article schema...");
  return knex.schema.dropTable("article");
};
