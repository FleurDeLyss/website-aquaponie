// MYSQL/MARIADB
/*module.exports = require('knex')({
    client: 'mysql2',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    },
    pool: { min: 0, max: 7 },
    useNullAsDefault: true
  });*/

// SQLITE3
module.exports = require('knex')({
    client: 'sqlite3',
    connection: {
        filename:  process.env.DATA_DIR+'/aqua.db'
    },
    useNullAsDefault: true
});