let add = require('../handle/adduser');
let sha1 = require('../handle/sha1');
let find = require('../handle/findusers');

function adduser(req, res, next) {
    find(req.session.email).then(ress => {
        if (ress.length) {
            if (res.jsonp) {
                res.jsonp({ err: true, errtype: '请勿重复注册' });
            } else {
                res.json({ err: true, errtype: '请勿重复注册' });
            }
        } else {
            let password = req.query.password;
            newpassword = sha1(password);
            add(req.session.email, newpassword).then(ress => {
                req.session.login = true;
                if (res.jsonp) {
                    res.jsonp({ err: false, data: '注册成功' });
                } else {
                    res.json({ err: false, data: '注册成功' });
                }
            }, rejj => {
                console.log(rejj);
                if (res.jsonp) {
                    res.jsonp({ err: true, errtype: '注册错误,请重试' });
                } else {
                    res.json({ err: true, errtype: '注册错误,请重试' });
                }
            })
        }
    })
}
module.exports = adduser;