const Pool = require('pg').Pool;
const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'db_nds',
  password: 'sql',
  port: 5432
});


module.exports = pool;