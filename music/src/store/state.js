import { playMode } from "../common/js/config";
import store from "../common/js/store";
import { createSonglist } from "../common/js/song"
import { signupMode } from "../common/js/config";
const state = {
    singer: {},
    playing: false,
    playlist: createSonglist(store.getstore.getPlaylist()).length ? createSonglist(store.getstore.getPlaylist()) : [],
    sequenceList: createSonglist(store.getstore.getsequenceList()).length ? createSonglist(store.getstore.getsequenceList()) : [],
    mode: parseInt(store.getstore.getMode()),
    fullScreen: false,
    // currentIndex: -1,
    currentIndex: parseInt(store.getstore.getIndex()),
    likelist: createSonglist(store.getstore.getLikelist()) ? createSonglist(store.getstore.getLikelist()) : [],
    searchHistory: store.getstore.getSearchHisory() ? store.getstore.getSearchHisory() : [], //搜索历史
    rankList: {},
    songlist: {},
    login: false, //登陆
    signup: false, //注册
    signupflag: signupMode.nosignup,
    usernum: '', //用户名
    username: '', //昵称
    userwords: '', //用户签名
    nearplay: [], //用户最近播放
    userlike: [], //用户喜欢
    userimg: 'default', //用户头像
    userHistory: createSonglist(store.getstore.getHistory()).length ? createSonglist(store.getstore.getHistory()) : [], //用户历史 默认为空 登陆后才有历史
}
export default state