let query = require('../db/db');

function adduser(email, password) {
    return query(`INSERT INTO \`musicuser\`.\`musicuserdata\`(\`email\`, \`username\`, \`password\`) VALUES ('${email}', '${email}', '${password}')`)
}

module.exports = adduser;