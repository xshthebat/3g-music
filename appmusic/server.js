let app = require('./app/express');
let provercode = require('./api/getvercode');
let postemail = require('./api/postemail');
let adduser = require('./api/adduser');
let saveimg = require('./api/saveimg');
let checklogin = require('./api/checklogin');
let multipart = require('connect-multiparty');
let multipartMiddleware = multipart();
let imagedefault = require('./handle/getdefaultimg');
let loginuser = require('./handle/loginuser');
let finduser = require('./handle/findusers');
let sha1password = require('./handle/sha1');
let updatauser = require('./handle/updatauser');
imagedefault(); //挂载默认头像
app.use(multipart({ uploadDir: './temp/' }));
app.get('/api/getvercode', provercode, function(req, res) {
    if (res.jsonp) {
        res.jsonp({ err: false, data: req.vercode.data });
    } else {
        res.json({ err: false, data: req.vercode.data });
    }
})
app.get('/api/checkvercode', function(req, res, next) {
    if (!req.session.vercode) {
        if (res.jsonp) {
            res.jsonp({ err: true, errtype: '验证码超时' });
        } else {
            res.json({ err: true, errtype: '验证码超时' });
        }
        req.session.destroy();
    } else {
        next();
    }
}, function(req, res, next) {
    if (!req.query.email) {
        if (res.jsonp) {
            res.jsonp({ err: true, errtype: '请输入邮箱' });
        } else {
            res.json({ err: true, errtype: '请输入邮箱' });
        }
        req.session.destroy();
    } else if (!req.query.vercode) {
        if (res.jsonp) {
            res.jsonp({ err: true, errtype: '请输入验证码' });
        } else {
            res.json({ err: true, errtype: '请输入验证码' });
        }
        req.session.destroy();
    } else {
        next();
    }
}, function(req, res, next) {
    if (req.query.vercode.toLowerCase() == req.session.vercode) {
        next();
    } else {
        if (res.jsonp) {
            res.jsonp({ err: true, errtype: '验证码错误' });
        } else {
            res.json({ err: true, errtype: '验证码错误' });
        }
        req.session.destroy();
    }
}, function(req, res, next) {
    if (!req.query.email.match(/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/)) {
        if (res.jsonp) {
            res.jsonp({ err: true, errtype: '邮箱错误' });
        } else {
            res.json({ err: true, errtype: '邮箱错误' });
        }
        req.session.destroy();
    } else {
        req.session.email = req.query.email;
        next();
    }

}, postemail);
app.get('/api/checkcodes', function(req, res, next) {
    // console.log(req.session, req.query);
    if (!req.session) {
        if (res.jsonp) {
            res.jsonp({ err: true, errtype: '验证码超时' });
        } else {
            res.json({ err: true, errtype: '验证码超时' });
        }
    } else if (!req.query.codes || !req.query.password) {
        if (res.jsonp) {
            res.jsonp({ err: true, errtype: '参数错误' });
        } else {
            res.json({ err: true, errtype: '参数错误' });
        }
    } else if (req.session.text !== req.query.codes) {
        if (res.jsonp) {
            res.jsonp({ err: true, errtype: '邮箱验证码错误请重试' });
        } else {
            res.json({ err: true, errtype: '邮箱验证码错误请重试' });
        }
    } else {
        next();
    }
}, adduser)
app.post('/api/changeimg', function(req, res, next) {
    // console.log(req.session)
    if (!req.session.login) {
        if (res.jsonp) {
            res.jsonp({ err: true, errtype: '未登陆' });
        } else {
            res.json({ err: true, errtype: '未登陆' });
        }
    } else {
        next();
    }
}, multipartMiddleware, saveimg)
app.get('/api/login', function(req, res, next) {
    // console.log(req.query, req.session)
    // { password: 'asdasdasdas', vercode: '4l6d', callback: '__jp16' } Session {
    //     cookie:
    //      { path: '/',
    //        _expires: 2018-07-22T02:44:05.182Z,
    //        originalMaxAge: 108000,
    //        httpOnly: true },
    //     vercode: '4l6d',
    //     email: '609373067@qq.com',
    //     text: 'xTTCq4P' }
    if (!req.session || !req.session.email) {
        if (res.jsonp) {
            res.jsonp({ err: true, errtype: '登录超时' });
        } else {
            res.json({ err: true, errtype: '登陆超时' });
        }
    } else {
        if (req.query.password) {
            req.logintype = 'password';
        }
        if (req.query.codes) {
            req.logintype = 'codes';
        }
        next();
    }
}, function(req, res, next) {
    if (req.logintype === 'codes') {
        //登陆 
        if (req.query.codes === req.session.text) {
            req.session.text = "";
            req.session.login = true;
            //登陆操作函数
            loginuser(req, res);
        } else {
            if (res.jsonp) {
                res.jsonp({ err: true, errtype: '邮箱验证码错误' });
            } else {
                res.json({ err: true, errtype: '邮箱验证码错误' });
            }
        }
    } else if (req.logintype === 'password') {
        //登陆验证
        if (req.query.vercode === req.session.vercode) {
            req.session.vercode = "";
            //密码验证
            finduser(req.session.email).then(ress => {
                if (ress.length) {
                    //判断密码
                    if (sha1password(req.query.password) === ress[0].password) {
                        req.session.login = true;
                        //登陆操作函数
                        loginuser(req, res);
                    } else {
                        if (res.jsonp) {
                            res.jsonp({ err: true, errtype: '密码错误' });
                        } else {
                            res.json({ err: true, errtype: '密码错误' });
                        }
                    }
                } else {
                    if (res.jsonp) {
                        res.jsonp({ err: true, errtype: '登陆失败 无法获取' });
                    } else {
                        res.json({ err: true, errtype: '登陆失败 无法获取' });
                    }
                }
            })
        } else {
            if (res.jsonp) {
                res.jsonp({ err: true, errtype: '验证码错误' });
            } else {
                res.json({ err: true, errtype: '验证码错误' });
            }
        }
        //查库
    } else {
        if (res.jsonp) {
            res.jsonp({ err: true, errtype: '参数类型错误' });
        } else {
            res.json({ err: true, errtype: '参数类型错误' });
        }
    }
})
app.get('/alive', function(req, res) {
    // console.log(req.headers);
    res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
    });
    //从数据库读取时间
    if (!req.session.login || !req.session.email || !req.session) {
        res.end();
    } else {
        finduser(req.session.email).then(ress => {
            // console.log(ress);
            let date = ress[0].logindate;
            // console.log(date);
            let i = 0;
            let interval = setInterval(() => {
                if (!req.session.email) {
                    clearInterval(interval);
                } else {
                    // res.write(mewdate);
                    // console.log('开始异步轮询', i);
                    finduser(req.session.email).then(resss => {
                        {
                            let mewdate = resss[0].logindate;
                            if (mewdate !== date) {
                                console.log('清理登陆状态')
                                req.session.destroy();
                                res.write("data: " + 'losttime' + "\n\n");
                            } else {
                                res.write("data: " + 'ok' + "\n\n");
                            }
                            i++;
                        }
                    })
                }
            }, 1000);
            req.connection.addListener("close", function() {
                clearInterval(interval);
            }, false);
        })
    }
});
app.get('/api/deletesession', function(req, res) {
    if (req.session) {
        req.session.destroy();
        if (res.jsonp) {
            res.jsonp({ err: false, data: 'ok' });
        } else {
            res.json({ err: false, data: 'ok' });
        }
    } else {
        if (res.jsonp) {
            res.jsonp({ err: true, errtype: 'not has session' });
        } else {
            res.json({ err: true, errtype: 'not has session' });
        }
    }
})
app.get('/api/iflogin', checklogin);
app.get('/api/updata', function(req, res, next) {
    if (req.session.login) {
        next();
    } else {
        if (res.jsonp) {
            res.jsonp({ err: true, errtype: '未登陆' });
        } else {
            res.json({ err: true, errtype: '未登陆' });
        }
    }
}, function(req, res, next) {
    let str = req.query.key;
    if (!str || !(str === 'username' || str === 'userword' || str === 'userdata') || (req.query.val === 'undefined')) {
        if (res.jsonp) {
            res.jsonp({ err: true, errtype: '参数值错误' });
        } else {
            res.json({ err: true, errtype: '参数值错误' });
        }
    } else {
        next();
    }
}, function(req, res) {
    updatauser(req.session.email, req.query.key, req.query.val).then((ress) => {
        console.log(ress);
        if (!ress.fieldCount) {
            if (res.jsonp) {
                res.jsonp({ err: false, data: 'ok' });
            } else {
                res.json({ err: false, data: 'ok' });
            }
        } else {
            if (res.jsonp) {
                res.jsonp({ err: true, errtype: '修改失败' });
            } else {
                res.json({ err: true, errtype: '修改失败' });
            }
        }
    })
})
app.listen(8881);
console.log('server running')