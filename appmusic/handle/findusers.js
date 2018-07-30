let query = require('../db/db');

function finduser(email) {

    return query(`select*from \`musicuser\`.\`musicuserdata\` where email='${email}'`);
}

module.exports = finduser;