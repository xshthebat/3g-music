let finduser = require('./findusers');
let getimg = require('./getimgtobase64');
let updatauser = require('./updatauser');

function loginuser(req, res) {
    finduser(req.session.email).then((ress) => {
        if (ress.length) {
            if (ress[0].userimgpath) {
                let pathtpye = ress[0].userimgpath.split(',');
                let path = pathtpye[1];
                let type = pathtpye[0];
                getimg(path, type).then((args) => {
                    if (args[0]) {
                        if (res.jsonp) {
                            res.jsonp({ err: true, errtype: 'not find user img' });
                        } else {
                            res.json({ err: true, errtype: 'not find user img' });
                        }
                    } else {
                        updatauser(req.session.email, 'logindate', new Date()).then((resss) => {
                            console.log(resss);
                            if (res.jsonp) {
                                res.jsonp({ err: false, data: 'ok' });
                            } else {
                                res.json({ err: false, data: 'ok' });
                            }
                        });
                    }
                })
            } else {
                updatauser(req.session.email, 'logindate', new Date()).then((resss) => {
                    console.log(resss);
                    if (res.jsonp) {
                        res.jsonp({ err: false, data: 'ok' });
                    } else {
                        res.json({ err: false, data: 'ok' });
                    }
                })
            }
        } else {
            if (res.jsonp) {
                res.jsonp({ err: true, errtype: 'not find' });
            } else {
                res.json({ err: true, errtype: 'not find' });
            }
        }
    })
}
module.exports = loginuser;