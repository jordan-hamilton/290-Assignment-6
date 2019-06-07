var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs290_hamiltj2',
  password        : '8734',
  database        : 'cs290_hamiltj2'
});

module.exports.pool = pool;
