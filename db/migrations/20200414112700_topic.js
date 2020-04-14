exports.up = function (knex) {
  console.log("creating topics schema...");
  return knex.schema.createTable("topics", (table) => {
    table.string("slug").primary().notNullable();
    table.string("description");
  });
};

exports.down = function (knex) {
  console.log("removing topics schema...");
  return knex.schema.dropTable("topics");
};
