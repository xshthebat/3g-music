let fs = require('fs');
let finduser = require('../handle/findusers');
let query = require('../db/db');
let updatauser = require('../handle/updatauser');

function saveimg(req, res, next) {
    // 处理上传的图片 并且设置起实际大小 然后裁剪 
    // console.log(req.files.img, req.session);
    if (req.files.img) {
        let path = req.files.img.path.replace("\\", "/");
        if (req.session.email) {
            finduser(req.session.email).then((ress) => {
                if (ress.length) {
                    if (ress[0].userimgpath) {
                        // 删除
                        let pathtpye = ress[0].userimgpath.split(',');
                        fs.unlink(pathtpye[1], function(err) {
                            if (err) {
                                console.log(err);
                                if (res.jsonp) {
                                    res.jsonp({ err: true, errtype: '更改失败,后台清除错误' });
                                } else {
                                    res.json({ err: true, errtype: '更改失败,后台清除错误' });
                                }
                            } else {
                                //更新路径
                                updatauser(ress[0].email, 'userimgpath', `${req.files.img.type},${path}`).then((ress) => {
                                    if (ress.fieldCount) {
                                        if (res.jsonp) {
                                            res.jsonp({ err: true, errtype: 'sql err' });
                                        } else {
                                            res.json({ err: true, errtype: 'sql err' });
                                        }
                                    } else {
                                        if (res.jsonp) {
                                            res.jsonp({ err: false, data: 'ok' });
                                        } else {
                                            res.json({ err: false, data: 'ok' });
                                        }
                                    }
                                })
                            }
                        })
                    } else {
                        //更新路径
                        updatauser(ress[0].email, 'userimgpath', `${req.files.img.type},${path}`).then((ress) => {
                            if (ress.fieldCount) {
                                if (res.jsonp) {
                                    res.jsonp({ err: true, errtype: 'sql err' });
                                } else {
                                    res.json({ err: true, errtype: 'sql err' });
                                }
                            } else {
                                if (res.jsonp) {
                                    res.jsonp({ err: false, data: 'ok' });
                                } else {
                                    res.json({ err: false, data: 'ok' });
                                }
                            }
                        })
                    }
                } else {
                    if (res.jsonp) {
                        res.jsonp({ err: true, errtype: '没有权限' });
                    } else {
                        res.json({ err: true, errtype: '没有权限' });
                    }
                }
            })
        } else {
            if (res.jsonp) {
                res.jsonp({ err: true, errtype: '没有权限' });
            } else {
                res.json({ err: true, errtype: '没有权限' });
            }
        }
    } else {
        if (res.jsonp) {
            res.jsonp({ err: true, errtype: '无图片' });
        } else {
            res.json({ err: true, errtype: '无图片' });
        }
    }
}
module.exports = saveimg;