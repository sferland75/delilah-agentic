exports.up = function(knex) {
  return knex.schema
    .createTable('agents', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
      table.string('name').notNullable()
      table.string('type').notNullable()
      table.jsonb('state').defaultTo('{}')
      table.boolean('active').defaultTo(true)
      table.timestamps(true, true)
    })
    .createTable('metrics', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
      table.string('name').notNullable()
      table.float('value').notNullable()
      table.jsonb('tags').defaultTo('{}')
      table.timestamp('timestamp').notNullable().defaultTo(knex.fn.now())
    })
    .createTable('alerts', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
      table.string('severity').notNullable()
      table.string('message').notNullable()
      table.jsonb('details').defaultTo('{}')
      table.boolean('resolved').defaultTo(false)
      table.timestamp('timestamp').notNullable().defaultTo(knex.fn.now())
    })
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('alerts')
    .dropTable('metrics')
    .dropTable('agents')
};