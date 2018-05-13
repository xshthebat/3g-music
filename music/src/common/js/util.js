export function shuffle(list) {
    console.log('洗牌成功');
    let _arr = list.slice(); //拷贝数组
    for (let i = 0, len = _arr.length; i < len; i++) {
        let j = getrandomInt(0, i);
        let t = _arr[i];
        _arr[i] = _arr[j];
        _arr[j] = t; //洗牌
    }
    return _arr;
}

function getrandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}