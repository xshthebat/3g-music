let query = require('../db/db');

function adduser(email, password) {
    return query(`INSERT INTO \`musicuser\`.\`musicuserdata\`(\`email\`, \`username\`, \`password\`,\`logindate\`,\`userword\`) VALUES ('${email}', '${email}', '${password}','${new Date()}','')`)
}

module.exports = adduser;