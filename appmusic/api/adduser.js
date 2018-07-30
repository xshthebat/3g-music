let add = require('../handle/adduser');
let sha1 = require('../handle/sha1');
let find = require('../handle/findusers');

function adduser(req, res, next) {
    find(req.session.email).then(ress => {
        if (ress.length) {
            if (res.jsonp) {
                //已经有账号 算登陆 。。。 直接跳转个人页面
                res.jsonp({ err: false, data: ress[0] });
            } else {
                res.json({ err: false, data: ress[0] });
            }
        } else {
            let password = req.query.password;
            let userdata = req.query.datas ? req.query.datas : '';
            console.log(typeof userdata);
            newpassword = sha1(password);
            add(req.session.email, newpassword, userdata).then(ress => {
                req.session.login = true;
                console.log('登陆成功session', req.session);
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