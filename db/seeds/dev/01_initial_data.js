exports.seed = async function(knex) {
  // Clean the tables
  await knex('alerts').del()
  await knex('metrics').del()
  await knex('agents').del()

  // Insert seed data
  await knex('agents').insert([
    {
      name: 'Assessment Agent',
      type: 'assessment',
      state: JSON.stringify({
        initialized: true,
        lastSync: new Date().toISOString()
      })
    },
    {
      name: 'Analysis Agent',
      type: 'analysis',
      state: JSON.stringify({
        initialized: true,
        lastSync: new Date().toISOString()
      })
    }
  ])

  // Insert some initial metrics
  await knex('metrics').insert([
    {
      name: 'response_time',
      value: 150,
      tags: JSON.stringify({ service: 'api' })
    },
    {
      name: 'cpu_usage',
      value: 45.5,
      tags: JSON.stringify({ host: 'server-1' })
    }
  ])
};