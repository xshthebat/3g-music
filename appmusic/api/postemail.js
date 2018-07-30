let sendeamil = require("../handle/email");
let vercode = require("../handle/vercode");
let findusers = require('../handle/findusers');

function postemail(req, res, next) {
    let haslogin = false;
    console.log(req.session.email);
    findusers(req.session.email).then((ress) => {
        console.log(ress);
        if (ress.length) {
            haslogin = true;
        }
        let codes = vercode({
            size: 7
        }).text;
        req.session.text = codes;
        console.log(req.query.email, codes);
        sendeamil(req.query.email, codes).then((resss) => {
            console.log(resss);
            if (res.jsonp) {
                res.jsonp({ err: false, data: { haslogin: haslogin, text: '验证发送成功请查看邮箱' } });
            } else {
                res.json({ err: false, data: { haslogin: haslogin, text: '验证发送成功请查看邮箱' } });
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
    })
}
module.exports = postemail;