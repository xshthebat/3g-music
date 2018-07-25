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
app.get('/getlistDetail', function(req, res) {
    let dic = req.query.dic;
    let options = {
        url: `https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg?type=1&json=1&utf8=1&onlysong=0&disstid=${dic}&g_tk=1057756813&loginUin=0&hostUin=0&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0`,
        methods: 'GET',
        headers: {
            referer: `https://y.qq.com/n/yqq/playlist/${dic}.html`,
            "user-agent": 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'
        }
    }
    request(options, function(err, respsonse, body) {
        if (!err) {

            let datal = body.split('Callback(')[1];
            let data = JSON.parse(datal.slice(0, datal.length - 1));
            res.jsonp(data);
        } else {
            console.log(err);
        }
    })
})
app.get('/idgetsame', function(req, res, next) {
    let id = req.query.songid;
    let p = Math.random();
    const url = `https://c.y.qq.com/rcmusic/fcgi-bin/fcg_iphone_music_rec_songlist?jsonpCallback=musicRecSongListCallback&cid=338&ct=20&songid=${id}&uin=10000&p=${p}&g_tk=5381&jsonpCallback=musicRecSongListCallback&loginUin=0&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0`;
    request({
        url: url,
        methods: 'GET',
        headers: {
            referer: 'https://y.qq.com/',
            host: 'c.y.qq.com'
        }
    }, function(err, respsonse, body) {
        if (!err) {
            let datal = body.split('Callback(')[1];
            let data = JSON.parse(datal.slice(0, datal.length - 1));
            let dissid = [];
            for (i = 0; i < data.list.length; i++) {
                dissid.push(data.list[i].dissid);
            }
            req.dissid = dissid;
            // next();
            res.jsonp(req.dissid);
        } else {
            console.log(err);
        }
    })
})
app.get('/disidgetlist',
    function(req, res) {
        // console.log(req.query.dissid);
        let dissid = JSON.parse(req.query.dissid);
        let list = [];
        let promise = [];
        // res.json(dissid);
        for (let i = 0; i < dissid.length; i++) {
            promise.push(new Promise(function(ress, rejj) {
                const url = `https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg?type=1&json=1&utf8=1&onlysong=0&disstid=${dissid[i]}&format=jsonp&g_tk=5381&jsonpCallback=playlistinfoCallback&loginUin=0&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0`;
                request({
                    url: url,
                    methods: 'GET',
                    headers: {
                        referer: 'https://y.qq.com/',
                        host: 'c.y.qq.com'
                    }
                }, function(err, respsonse, body) {
                    if (!err) {
                        let datal = body.split('Callback(')[1];
                        let data = JSON.parse(datal.slice(0, datal.length - 1));
                        ress(data.cdlist[0].songlist);
                    } else {
                        rejj(err);
                    }
                })
            }))
        }
        Promise.all(promise).then((val) => {
            for (let i = 0; i < val.length; i++) {
                list = list.concat(val[i]);
            }
            // list = [...new Set(list)];
            // list = [...new Set([{ haha: 1 }, { haha: 1 }])]
            let newlist = [];
            for (var i = 0; i < list.length; i++) {　　
                var flag = true;　　
                for (var j = 0; j < newlist.length; j++) {　　　　
                    if (list[i].songid === newlist[j].songid) {　　　　　　
                        flag = false;　　　　
                    };　　
                };　　
                if (flag) {
                    newlist.push(list[i]);　　
                };
            };
            res.json(newlist);
        })
    })
app.listen(8888);
console.log('music running');