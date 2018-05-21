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

//截流 fn函数 delay时间
export function debounce(fn, delay) {
    let timer = null;
    return function(...args) {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            fn.apply(this, args)
        }, delay)
    }
}