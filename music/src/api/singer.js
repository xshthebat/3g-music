import jsonp from '../common/js/jsonp'
import { commonParams, options } from '../api/config'
export function getSingerList() {
    const url = 'https://szc.y.qq.com/v8/fcg-bin/v8.fcg';
    const data = Object.assign({}, commonParams, {
        channel: 'singer',
        page: 'list',
        key: 'all_all_all',
        pagesize: 100,
        pagenum: 1,
        loginUin: 0,
        hostUin: 0,
        inCharset: 'utf8',
        needNewCode: 0,
        platform: 'yqq',
        g_tk: 5381,
        format: 'jsonp'
    })
    return jsonp(url, data, options);
}


export function getSingerDetail(singerId) {
    let url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg';

    const data = Object.assign({}, commonParams, {
        g_tk: 207663450,
        loginUin: 0,
        hostUin: 0,
        format: 'jsonp',
        inCharset: 'utf8',
        outCharset: 'utf-8',
        order: 'listen',
        begin: 0,
        num: 80,
        platform: 'yqq',
        songstatus: 1,
        singermid: singerId
    })
    return jsonp(url, data, options);
}