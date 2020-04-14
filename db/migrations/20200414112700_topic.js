exports.up = function (knex) {
  console.log("creating topic schema...");
  return knex.schema.createTable("topic", (table) => {
    table.string("slug").primary().notNullable();
    table.string("description");
  });
};

exports.down = function (knex) {
  console.log("removing topic schema...");
  return knex.schema.dropTable("topic");
};
