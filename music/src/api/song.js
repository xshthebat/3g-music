import jsonp from '../common/js/jsonp';
import { commonParams, options } from '../api/config';
import { getUid } from '../common/js/uid';
const debug = process.env.NODE_ENV !== 'production'
export function getLyric(mid) {
    const url = debug ? "http://localhost:8888/getlyric" : "http://123.207.138.78:8888/getlyric";
    return jsonp(url, { songmid: mid }, options);
}
export function getVKey(songmid, filename) {
    const url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg';
    const data = Object.assign({}, commonParams, {
        cid: 205361747,
        platform: 'yqq',
        hostUin: 0,
        loginUin: 0,
        needNewCode: 0,
        uin: 0,
        songmid: songmid,
        filename: filename,
        format: 'jsonp',
        inCharset: 'utf8',
        g_tk: 5381,
        guid: getUid()
    })
    return jsonp(url, data, Object.assign({}, options, { param: 'callback' }));
}