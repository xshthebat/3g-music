let sendeamil = require("../handle/email");
let vercode = require("../handle/vercode");

function postemail(req, res, next) {
    let codes = vercode({
        size: 7
    }).text;
    req.session.text = codes;
    console.log(req.query.email, codes);
    sendeamil(req.query.email, codes).then((ress) => {
        console.log(ress);
        if (res.jsonp) {
            res.jsonp({ err: false, data: '验证发送成功请查看邮箱' });
        } else {
            res.json({ err: false, data: '验证发送成功请查看邮箱' });
        }
    }, (rej) => {
        console.log(rej);
        req.session.destroy();
        if (res.jsonp) {
            res.jsonp({ err: true, errtype: '发送失败 请重试' });
        } else {
            res.json({ err: true, errtype: '发送失败 请重试' });
        }
    })
}
module.exports = postemail;