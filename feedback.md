# BE Northcoders News Check List

## Readme

- [ ] Link to hosted version
- [ ] Write a summary of what the project is
- [ ] Provide clear instructions of how to clone, install dependencies, seed local database, and run tests
- [ ] Include information about how to create `knexfile.js`
- [ ] Specify minimum versions of `Node.js` and `Postgres` needed to run the project

## General

- [x] Remove any unnecessary `console.logs` and comments
- [ ] Remove all unnecessary files (e.g. old `README.md`,`hosting.md`)

## Migrations

- [x] Use `notNullable` on required fields
- [x] Default `created_at` in articles and comments tables to the current date:`.defaultTo(knex.fn.now());`
- [x] Delete all comments when the article they are related to is deleted: Add `.onDelete("CASCADE");` to `article_id` column in `comments` table.

## Seeding

- [x] Make sure util functions do not mutate data
- [x] Make util functions easy to follow with well named functions and variables
- [x] Test util functions
- [x] Migrate rollback and migrate latest in seed function

## Tests

- [x] Cover all endpoints and errors
- [x] Ensure all tests are passing

## Routing

- [x] Split into api, topics, users, comments and articles routers
- [x] Use `.route` for endpoints that share the same path
- [x] Use `.all` for 405 errors

## Controllers

- [x] Name functions and variables well
- [x] Add catch blocks to all model invocations (and don't mix use of`.catch(next);` and `.catch(err => next(err))`)

## Models

- [X]Consistently use either single object argument _**or**_ multiple arguments in model functions
- [X]No unnecessary use of `.modify()` (i.e. only for author and topic queries)
- [X]Use `leftJoin` for comment counts

## Errors

- [x] Use error handling middleware functions in app and extracted to separate directory/file
- [x] Consistently use `Promise.reject` in either models _**OR**_ controllers
