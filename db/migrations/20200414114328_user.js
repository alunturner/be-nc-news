exports.up = function (knex) {
  console.log("creating user schema...");
  return knex.schema.createTable("user", (table) => {
    table.string("username").primary().notNullable();
    table.string("avatar_url");
    table.string("name");
  });
};

exports.down = function (knex) {
  console.log("removing user schema...");
  return knex.schema.dropTable("user");
};
