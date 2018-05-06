export default class Song {
    constructor({ id, mid, singer, name, album, duration, image }) {
        this.id = id;
        this.mid = mid;
        this.singer = singer;
        this.name = name;
        this.album = album;
        this.duration = duration;
        this.image = image;
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