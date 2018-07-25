import jsonp from '../common/js/jsonp'
const debug = process.env.NODE_ENV !== 'production'

export function getemailcodes(email, vercode) {
    const url = debug ? 'http://localhost:8881/api/checkvercode' : 'http://123.207.138.78:8881/api/checkvercode';
    return jsonp(url, {
        email: email,
        vercode: vercode
    }, { param: 'callback' });
}
export function checkemailcodes(codes, password) {
    const url = debug ? 'http://localhost:8881/api/checkcodes' : 'http://123.207.138.78:8881/api/checkcodes';
    return jsonp(url, {
        password: password,
        codes: codes
    }, { param: 'callback' });
}
export function login(codetype, code, vercode) {
    const url = debug ? 'http://localhost:8881/api/login' : 'http://123.207.138.78:8881/api/login';
    return jsonp(url, {
        [codetype]: code,
        vercode: vercode
    }, { param: 'callback' });
}
export function checklogin() {
    const url = debug ? 'http://localhost:8881/api/iflogin' : 'http://123.207.138.78:8881/api/iflogin';
    return jsonp(url, {}, { param: 'callback' });
}
export function deletesession() {
    const url = debug ? 'http://localhost:8881/api/deletesession' : 'http://123.207.138.78:8881/api/deletesession';
    return jsonp(url, {}, { param: 'callback' });
}
export function updatamessage(key, val) {
    const url = debug ? 'http://localhost:8881/api/updata' : 'http://123.207.138.78:8881/api/updata';
    return jsonp(url, {
        key: key,
        val: val
    }, { param: 'callback' });
}