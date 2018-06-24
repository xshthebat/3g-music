let crypto = require('crypto');

//不可逆加密

function sha1password(password) {
    let sha1 = crypto.createHash('sha1');
    sha1.update(password);
    return sha1.digest('hex');
};

module.exports = sha1password;