let finduser = require('./findusers');
let getimg = require('./getimgtobase64');
let updatauser = require('./updatauser');

function loginuser(req, res) {
    finduser(req.session.email).then((ress) => {
        if (ress.length) {
            //返回数据
            //根据获取头像信息 并转 base64码 返回\
            console.log(ress[0]);
            let data = {
                    usernum: ress[0].email,
                    username: ress[0].username,
                    userdata: ress[0].userdata,
                    userword: ress[0].userword,
                    userimg: 'default'
                }
                // console.log(path, type);
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
                        updatauser(req.session.email, 'logindate', new Date()).then((resss) => {
                            if (res.jsonp) {
                                res.jsonp({ err: false, data: data });
                            } else {
                                res.json({ err: false, data: data });
                            }
                        });
                    }
                })
            } else {
                updatauser(req.session.email, 'logindate', new Date()).then((resss) => {
                    if (res.jsonp) {
                        res.jsonp({ err: false, data: data });
                    } else {
                        res.json({ err: false, data: data });
                    }
                })
            }
        } else {
            if (res.jsonp) {
                res.jsonp({ err: true, errtype: '登陆失败 查无数据' });
            } else {
                res.json({ err: true, errtype: '登陆失败 查无数据' });
            }
        }
    })
}
module.exports = loginuser;