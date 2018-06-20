import jsonp from '../common/js/jsonp';
import { commonParams, options } from '../api/config';
const debug = process.env.NODE_ENV !== 'production'
export function getvercode(mid) {
    const url = debug ? "http://localhost:8881/api/getvercode" : "http://123.207.138.78:8881/api/getvercode";
    return jsonp(url, {}, { param: 'callback' });
}