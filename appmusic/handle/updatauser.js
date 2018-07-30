let query = require('../db/db');

function updatauser(email, key, value) {
    return query(`UPDATE \`musicuserdata\` SET  \`${key}\`='${value}' WHERE (\`email\`='${email}')`)
}
module.exports = updatauser;