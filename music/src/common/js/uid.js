let _uid = 0
    //guid算法实现
export function getUid() {
    if (_uid) {
        return _uid
    }
    if (!_uid) {
        const t = (new Date).getUTCMilliseconds()
        _uid = Math.round(2147483647 * Math.random()) * t % 1e10
    }
    return _uid
}