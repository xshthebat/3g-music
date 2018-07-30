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

export function distinct(arr) {
    let obj = {};
    let ret = [];
    for (let i = arr.length - 1; i >= 0; i--) {
        // console.log(arr[i].id);
        if (!obj[arr[i].id]) {
            obj[arr[i].id] = 1;
            ret.unshift(arr[i]);
        }
    }
    // console.log(obj);
    return ret
}
export function normllizedata({ likelist, userHistory }) {
    let data = {
        likelist: JSON.parse(JSON.stringify(likelist)),
        userHistory: JSON.parse(JSON.stringify(userHistory))
    };
    data.likelist.forEach(obj => {
        // delete obj["image"];
        delete obj["filename"];
        delete obj["url"];
        if (obj['lyric']) {
            delete obj['lyric'];
        }
    });
    data.userHistory.forEach(obj => {
        // delete obj["image"];
        delete obj["filename"];
        delete obj["url"];
        if (obj['lyric']) {
            delete obj['lyric'];
        }
    });
    return JSON.stringify(data);
}