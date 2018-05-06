import jsonp from '../common/js/jsonp'
import { commonParams, options } from '../api/config'
export function getRecommend() {
    const url = 'https://shc.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg';
    const data = Object.assign({}, commonParams, {
        platform: 'h5',
        needNewCode: '1'
    })
    return jsonp(url, data, options);
}
export function getDiscList() {
    const url = 'http://localhost:8888/getlist';
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