import jsonp from '../common/js/jsonp'
import { commonParams, options } from '../api/config'
const debug = process.env.NODE_ENV !== 'production'
export function getRecommend() {
    const url = 'https://shc.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg';
    const data = Object.assign({}, commonParams, {
        platform: 'h5',
        needNewCode: '1'
    })
    return jsonp(url, data, options);
}
export function getDiscList() {
    const url = debug ? 'http://localhost:8888/getlist' : 'http://123.207.138.78:8888/getlist';
    const data = Object.assign({}, commonParams, {
        g_tk: '5381',
        platform: 'yqq',
        hostUin: 0,
        sin: 0,
        ein: 29,
        sortId: 5,
        needNewCode: 0,
        categoryId: 10000000,
        rnd: Math.random(),
        format: 'json',
        inCharset: 'utf8'
    })
    return jsonp(url, data, options);
}

export function getSongList(disstid) {
    let url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
    let data = Object.assign({}, commonParams, {
        disstid,
        type: 1,
        json: 1,
        utf8: 1,
        onlysong: 0,
        platform: 'yqq',
        hostUin: 0,
        needNewCode: 0
    })
    let opts = Object.assign({}, opts, {
        param: 'jsonpCallback',
        name: 'playlistinfoCallback'
    })
    return jsonp(url, data, opts)
}