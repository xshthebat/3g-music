let app = require('./app/express');
let provercode = require('./api/getvercode');
let postemail = require('./api/postemail');
let adduser = require('./api/adduser');
let query = require('./db/db');
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
    console.log(req.session, req.query);
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
app.listen(8881);
console.log('server running')