let express = require('express');
const cookieParase = require('cookie-parser');
let session = require('express-session');
app = express();
app.use(session({
    secret: 'music',
    cookie: ('name', 'value', { path: '/', httpOnly: true, maxAge: 1000 * 60 * 60 * 24 }),
    //重新保存：强制会话保存即使是未修改的。默认为true但是得写上
    resave: false,
    //强制“未初始化”的会话保存到存储。 
    saveUninitialized: false
}));
app.use(cookieParase('music'));
app.use("*", function(req, res, next) {
    req.jsonp = false;
    if (req.query.callback) {
        req.jsonp = true; //设置跨域
    } else {
        if (req.headers.origin) {
            res.header("Access-Control-Allow-Origin", req.headers.origin); //线上测试cookie
            res.header("Access-Control-Allow-Credentials", true); //直有具有origin的来源浏览器才会给带上origin不然为null。。很重要
        } else {
            res.header("Access-Control-Allow-Origin", "*");
        }
        res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
        res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    }
    next();
})
module.exports = app;