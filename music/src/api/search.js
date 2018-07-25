import jsonp from "../common/js/jsonp";
import { commonParams, options } from "../api/config";
export function getHotKey() {
    let url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg';
    let data = Object.assign({}, commonParams, {
        uin: 0,
        format: 'json',
        platform: 'h5',
        needNewCode: 1
    })
    return jsonp(url, data, options);
}
export function search(query, page, perpage, zhida) {
    // let url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp';
    let url = 'https://c.y.qq.com/soso/fcgi-bin/client_search_cp';
    let data = Object.assign({}, commonParams, {
        w: query, //值
        p: page,
        n: perpage,
        perpage,
        zhidaqu: 1,
        catZhida: zhida ? 1 : 0,
        t: 0,
        flag: 1,
        ie: 'utf-8',
        sem: 1,
        aggr: 0,
        uin: 0,
        platform: 'h5',
        uid: 0,
        needNewCode: 1,
        remoteplace: 'txt.mqq.all'
    })
    return jsonp(url, data, options);
}