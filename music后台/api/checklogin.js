let finduser = require('../handle/findusers');
let getimg = require('../handle/getimgtobase64');

function checklogin(req, res) {
    console.log(req.session);
    if (!req.session.login || !req.session.email || !req.session) {
        if (res.jsonp) {
            res.jsonp({ err: true, errtype: '验证失败' });
        } else {
            res.json({ err: true, errtype: '验证失败' });
        }
    } else {
        finduser(req.session.email).then((ress) => {
            if (ress.length) {
                console.log(ress[0]);
                let data = {
                    usernum: ress[0].email,
                    username: ress[0].username,
                    userdata: ress[0].userdata,
                    userword: ress[0].userword,
                    userimg: 'default'
                }
                if (ress[0].userimgpath) {
                    let pathtpye = ress[0].userimgpath.split(',');
                    let path = pathtpye[1];
                    let type = pathtpye[0];
                    getimg(path, type).then((args) => {
                        if (args[0]) {
                            if (res.jsonp) {
                                res.jsonp({ err: true, errtype: '登陆失败 头像获取失败' });
                            } else {
                                res.json({ err: true, errtype: '登陆失败 头像获取失败' });
                            }
                        } else {
                            //成功后更新 时间
                            data.userimg = args[1];
                            if (res.jsonp) {
                                res.jsonp({ err: false, data: data });
                            } else {
                                res.json({ err: false, data: data });
                            }
                        }
                    })
                } else {
                    if (res.jsonp) {
                        res.jsonp({ err: false, data: data });
                    } else {
                        res.json({ err: false, data: data });
                    }
                }
            } else {
                if (res.jsonp) {
                    res.jsonp({ err: true, errtype: '验证失败' });
                } else {
                    res.json({ err: true, errtype: '验证失败' });
                }
            }
        })
    }

}
module.exports = checklogin;