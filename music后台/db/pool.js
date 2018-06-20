let mysql = require('mysql');
let db = {
    host: 'localhost',
    user: 'root',
    password: '131456xsh',
    database: 'musicuser',
    connectionLimit: 100
};

function optPool() {
    this.flag = true; //是否链接
    this.pool = mysql.createPool(db);
    this.getPool = function() {
        return this.pool;
    }
    this.end = function() {
        return this.end;
    }
};
module.exports = optPool;