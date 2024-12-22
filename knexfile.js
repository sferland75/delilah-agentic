module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      host: 'db',
      database: 'delilah',
      user: 'delilah',
      password: 'development'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds'
    }
  }
};