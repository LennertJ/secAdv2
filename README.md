# secAdv2

so for your migrations
go in terminal (have node installed duh)

npm init
mysqladmin -u root password 'root'
knex migrate:make create_user_table

then go to the directory named "migrations"

and add this in the most recent migrationfile

"exports.up = function (knex) {
  return knex.schema.createTable('user', function (t) {
    t.increments('id').primary()
    t.string('username').notNullable()
    t.string('password').notNullable()
    t.timestamps(false, true)
  })
}"


"exports.down = function (knex) {
  return knex.schema.dropTableIfExists('user')
}"

then go back to terminal and type

knex migrate:latest