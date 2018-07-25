import * as types from './mutation-types'
import store from "../common/js/store";
import { distinct } from "../common/js/util";
const mutations = {
    [types.SET_SINGER](state, singer) {
        state.singer = singer;
    },
    [types.SET_PLAYLIST](state, list) {
        state.playlist = list;
        store.setstore.setPlaylist(list);

    },
    [types.SET_SEQUENCE_LIST](state, list) {
        state.sequenceList = list;
        store.setstore.setsequenceList(list);

    },
    [types.SET_PLAY_MODE](state, mode) {
        state.mode = mode;
        store.setstore.setMode(mode);
    },
    [types.SET_CURRENT_INDEX](state, index) {
        state.currentIndex = index;
        store.setstore.setIndex(index);
    },
    [types.SET_FULL_SCREEN](state, bol) {
        state.fullScreen = bol;
    },
    [types.SET_PLAYING_STATE](state, flag) {
        state.playing = flag;
    },
    [types.SET_LIKE_LIST](state, song) {
        if (song) {
            state.likelist.push(song);
            store.setstore.setLikelist(state.likelist);
        }
    },
    [types.DEL_LIKE_LIST](state, index) {
        if (index !== -1 && index < state.likelist.length) {
            state.likelist.splice(index, 1);
        }
        store.setstore.setLikelist(state.likelist);
    },
    [types.SET_SEARCHHISTORY](state, searchHistory) {
        state.searchHistory = searchHistory;
        store.setstore.setSearchHisory(searchHistory);
    },
    [types.SET_RANKLIST](state, rankList) {
        state.rankList = rankList;
    },
    [types.SET_SONGLIST](state, songlist) {
        state.songlist = songlist;
    },
    [types.SET_LOGIN](state, val) {
        state.login = val;
    },
    [types.SET_SIGNUP](state, val) {
        state.signup = val;
    },
    [types.SET_USERNUM](state, val) {
        state.usernum = val;
    },
    [types.SET_USERNAME](state, val) {
        state.username = val;
    },
    [types.SET_USERWORDS](state, val) {
        state.userwords = val;
    },
    [types.SET_SIGNUPFLAG](state, val) {
        state.signupflag = val;
    },
    [types.SET_USERIMG](state, val) {
        state.userimg = val;
    },
    [types.SET_USERHISTORY](state, val) {
        if (Array.isArray(val)) {
            state.userHistory.concat(val);
        } else {
            state.userHistory.push(val);
        }
        state.userHistory = distinct(state.userHistory);
        // console.log(state.userHistory);
        store.setstore.setHistory(distinct(state.userHistory));
    }
}

export default mutations