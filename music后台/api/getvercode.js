let vercode = require('../handle/vercode');

function bg3() {
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    return "rgb(" + r + ',' + g + ',' + b + ")"; //所有方法的拼接都可以用ES6新特性`其他字符串{$变量名}`替换
}

function provercode(req, res, next) {
    let createdata = {
        size: 4,
        noise: Math.random() % 3,
        background: bg3(),
        width: 100,
        height: 40
    }
    let vercodes = vercode(createdata);
    req.session.vercode = vercodes.text.toLowerCase();
    console.log(req.session.vercode);
    req.vercode = vercodes;
    next();
}
module.exports = provercode