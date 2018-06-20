import { playMode } from "../common/js/config";
import store from "../common/js/store";
import { createSonglist } from "../common/js/song"
const state = {
    singer: {},
    playing: false,
    // playlist: [],
    // sequenceList: [],
    playlist: createSonglist(store.getstore.getPlaylist()).length ? createSonglist(store.getstore.getPlaylist()) : [],
    sequenceList: createSonglist(store.getstore.getsequenceList()).length ? createSonglist(store.getstore.getsequenceList()) : [],
    mode: parseInt(store.getstore.getMode()),
    fullScreen: false,
    // currentIndex: -1,
    currentIndex: parseInt(store.getstore.getIndex()),
    likelist: store.getstore.getLikelist() ? store.getstore.getLikelist() : [],
    searchHistory: store.getstore.getSearchHisory() ? store.getstore.getSearchHisory() : [], //搜索历史
    rankList: {},
    songlist: {},
    login: false //登陆
}
console.log(state);
export default state