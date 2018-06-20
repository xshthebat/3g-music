import { ERR_OK } from "../../api/config";
import { getLyric, getVKey } from "../../api/song"
import { Base64 } from "js-base64";
import { getUid } from '../../common/js/uid';
let urlMap = {}; //url集合
export default class Song {
    constructor({ id, mid, singer, name, album, duration, image }) {
        this.id = id;
        this.mid = mid;
        this.singer = singer;
        this.name = name;
        this.album = album;
        this.duration = duration;
        this.image = image;
        this.filename = `C400${this.mid}.m4a`;

        //
        if (urlMap[this.id]) {
            this.url = urlMap[this.id]
        } else {
            this._genUrl()
        }
    }
    getlyric() {
        if (this.lyric) {
            return Promise.resolve(this.lyric);
            //直接返回lyric;
        }
        return new Promise((resolve, reject) => {
            getLyric(this.mid).then(res => {
                if (res.retcode === ERR_OK) {
                    this.lyric = Base64.decode(res.lyric);
                    // console.log(this.lyric);
                    resolve(this.lyric);
                } else {
                    reject('no lyric')
                }
            })
        })
    }
    _genUrl() {
        if (this.url) {
            return; //有url 直接返回
        }
        getVKey(this.mid, this.filename).then((res) => {
            if (res.code === ERR_OK) {
                const vkey = res.data.items[0].vkey
                this.url = `http://dl.stream.qqmusic.qq.com/${this.filename}?vkey=${vkey}&guid=${getUid()}&uin=0&fromtag=66`;
                urlMap[this.id] = this.url;
            }
        })
    }
}
export function createSong(musicDate) {
    return new Song({
        id: musicDate.songid,
        mid: musicDate.songmid,
        singer: filterSinger(musicDate.singer),
        name: musicDate.songname,
        album: musicDate.albumname,
        duration: musicDate.interval,
        image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicDate.albummid}.jpg?max_age=2592000`
    })
}
//处理歌手数据
function filterSinger(singer) {
    let ret = []
    if (!singer) {
        return ''
    }
    singer.forEach((s) => {
        ret.push(s.name)
    })
    return ret.join('/')
}

export function createSonglist(list) {
    if (!list) {
        return [];
    }
    return list.map((item) => {
        // console.log(item, new Song(item));
        return new Song(item);
    })
}