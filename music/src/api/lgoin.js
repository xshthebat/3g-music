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