let finduser = require('../handle/findusers');
let getimg = require('../handle/getimgtobase64');

function checklogin(req, res) {
    console.log(req.session);
    if (!req.session.login || !req.session.email || !req.session) {
        if (res.jsonp) {
            res.jsonp({ err: true, errtype: 'not access' });
        } else {
            res.json({ err: true, errtype: 'not access' });
        }
    } else {
        finduser(req.session.email).then((ress) => {
            if (ress.length) {
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
                                res.jsonp({ err: true, errtype: 'not get img' });
                            } else {
                                res.json({ err: true, errtype: 'not get img' });
                            }
                        } else {
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
                    res.jsonp({ err: true, errtype: 'not find' });
                } else {
                    res.json({ err: true, errtype: 'not find' });
                }
            }
        })
    }

}
module.exports = checklogin;