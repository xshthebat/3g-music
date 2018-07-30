let optPool = require('./pool');
let pool = new optPool().getPool();

function query(query) {
    if (!query) {
        console.log('清空连接池');
        pool.end();
    }
    return new Promise((res, rej) => {
        pool.getConnection((function(err, connection) {
            if (err) {
                throw err;
                rej(err);
            } else {
                connection.query(query, function(error, results) {
                    if (error) {
                        throw error;
                        rej(error)
                    } else {
                        res(results);
                    }
                })
            }
            connection.release(); //释放链接
        }))
    })
}
module.exports = query;