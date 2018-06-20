let svgCaptcha = require('svg-captcha'); //验证码生成
function vercode(createdata) {
    let captcha = svgCaptcha.create(createdata);
    return captcha;
}
module.exports = vercode;