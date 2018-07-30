let query = require('../db/db');

function adduser(email, password, userdata) {
    console.log(`INSERT INTO \`musicuser\`.\`musicuserdata\`(\`email\`, \`username\`, \`password\`,\`logindate\`,\`userword\`,\`userdata\`) VALUES ('${email}', '${email}', '${password}','${new Date()}','','${userdata}')`);
    return query(`INSERT INTO \`musicuser\`.\`musicuserdata\`(\`email\`, \`username\`, \`password\`,\`logindate\`,\`userword\`,\`userdata\`) VALUES ('${email}', '${email}', '${password}','${new Date()}','','${userdata}')`)

}

module.exports = adduser;