exports.up = function(knex) {
  return knex.schema
    .createTable('assessment_templates', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
      table.string('name').notNullable()
      table.string('version').notNullable()
      table.jsonb('sections').notNullable()
      table.jsonb('scoring_criteria')
      table.boolean('active').defaultTo(true)
      table.timestamps(true, true)
    })
    .createTable('assessments', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
      table.uuid('template_id').references('id').inTable('assessment_templates')
      table.uuid('client_id').notNullable()
      table.uuid('therapist_id').notNullable()
      table.string('status').notNullable().defaultTo('draft')
      table.jsonb('data').defaultTo('{}')
      table.jsonb('scores')
      table.jsonb('recommendations')
      table.timestamps(true, true)
    })
    .createTable('assessment_sections', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
      table.uuid('assessment_id').references('id').inTable('assessments')
      table.string('name').notNullable()
      table.integer('order').notNullable()
      table.jsonb('data').notNullable()
      table.jsonb('observations')
      table.timestamps(true, true)
    })
    .createTable('report_templates', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
      table.string('name').notNullable()
      table.string('version').notNullable()
      table.text('template_html').notNullable()
      table.jsonb('variables').notNullable()
      table.boolean('active').defaultTo(true)
      table.timestamps(true, true)
    })
    .createTable('generated_reports', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
      table.uuid('assessment_id').references('id').inTable('assessments')
      table.uuid('template_id').references('id').inTable('report_templates')
      table.text('report_html').notNullable()
      table.jsonb('metadata')
      table.timestamp('generated_at').notNullable().defaultTo(knex.fn.now())
      table.timestamps(true, true)
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('generated_reports')
    .dropTable('report_templates')
    .dropTable('assessment_sections')
    .dropTable('assessments')
    .dropTable('assessment_templates');
};