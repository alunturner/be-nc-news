exports.up = function (knex) {
  console.log("creating users schema...");
  return knex.schema.createTable("users", (table) => {
    table.string("username").primary().notNullable();
    table.string("avatar_url");
    table.string("name");
  });
};

exports.down = function (knex) {
  console.log("removing users schema...");
  return knex.schema.dropTable("users");
};
