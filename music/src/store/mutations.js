import * as types from './mutation-types'

const mutations = {
    [types.SET_SINGER](state, singer) {
        state.singer = singer;
    },
    [types.SET_PLAYLIST](state, list) {
        state.playlist = list;
    },
    [types.SET_SEQUENCE_LIST](state, list) {
        state.sequenceList = list;
    },
    [types.SET_PLAY_MODE](state, mode) {
        state.mode = mode;
    },
    [types.SET_CURRENT_INDEX](state, index) {
        state.currentIndex = index;
    },
    [types.SET_FULL_SCREEN](state, bol) {
        state.fullScreen = bol;
    },
    [types.SET_PLAYING_STATE](state, flag) {
        state.playing = flag;
    },
    [types.SET_LIKE_LIST](state, song) {
        state.likelist.push(song);
    },
    [types.DEL_LIKE_LIST](state, index) {
        if (index !== -1 && index < state.likelist.length) {
            state.likelist.splice(index, 1);
        }
    },
    [types.SET_SEARCHHISTORY](state, searchHistory) {
        state.searchHistory = searchHistory;
    }
}

export default mutations