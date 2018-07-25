let query = require('../db/db');

function updatauser(email, key, value) {
    return query(`UPDATE \`musicuserdata\` SET \`userdata\`='', \`${key}\`='${value}' WHERE (\`email\`='${email}')`)
}
module.exports = updatauser;