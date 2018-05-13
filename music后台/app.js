let express = require('express');
let request = require('request');
let jsbase64 = require('js-base64');
let app = express();
app.set('jsonp callback name', 'jsonpCallback')
app.get('/getlist', function(req, res) {
    let data = {
        ...req.query
    }
    delete data['jsonpCallback'];
    console.log(data);
    let options = {
        url: 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg?picmid=1&rnd=0.44059919084475263&g_tk=5381&loginUin=0&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0&categoryId=10000000&sortId=5&sin=0&ein=29',
        methods: 'GET',
        headers: {
            referer: 'https://y.qq.com/portal/playlist.html',
            "user-agent": 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'
        }
    }
    request(options, function(err, respsonse, body) {
        if (!err) {
            console.log(JSON.parse(body));
            res.jsonp(JSON.parse(body));
        } else {
            console.log(err);
        }
    })
})
app.get('/getlyric', function(req, res) {
    let mid = req.query.songmid;
    console.log(mid);
    const url = `https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg?callback=MusicJsonCallback_lrc&pcachetime=1525696855227&songmid=${mid}&g_tk=5381&jsonpCallback=MusicJsonCallback_lrc&loginUin=0&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0`;
    console.log(url);
    request({
        url: url,
        methods: 'GET',
        headers: {
            referer: 'https://y.qq.com/',
            host: 'c.y.qq.com'
        }
    }, function(err, respsonse, body) {
        if (!err) {
            let MusicJsonCallback_lrc = function(ress) {
                res.jsonp(ress);
            }
            eval(body);
        } else {
            console.log(err);
        }
    })
})
app.listen(8888);
console.log('music running')
const t = (new Date).getUTCMilliseconds();
var _uid = Math.round(2147483647 * Math.random()) * t % 1e10;
console.log(_uid);