exports.up = function (knex) {
  console.log(`ENV - ${process.env.NODE_ENV}`);
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
