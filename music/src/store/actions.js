import * as types from './mutation-types';
import { playMode } from "../common/js/config";
import { shuffle } from "../common/js/util"

function _findindex(list, song) {
    return list.findIndex((item) => {
        return item.id === song.id;
    })
}

export const randomPlay = function({ commit }, { list }) {
    let randomlist = shuffle(list);
    commit(types.SET_PLAY_MODE, playMode.random); //初始化播放模式
    commit(types.SET_SEQUENCE_LIST, list); //初始化有序序列
    commit(types.SET_PLAYLIST, randomlist); //初始播放化序列
    commit(types.SET_CURRENT_INDEX, 0); //随机播放默认取第0个
    commit(types.SET_FULL_SCREEN, true); //默认全屏显示播放器
    commit(types.SET_PLAYING_STATE, true); //开启播放
}
export const selectPlay = function({ commit, state }, { list, index }) {
    commit(types.SET_SEQUENCE_LIST, list) //初始化有序序列
    if (state.mode === playMode.random) {
        //随机播放
        let randomlist = shuffle(list)
        commit(types.SET_PLAYLIST, randomlist); //设置随机序列
        index = _findindex(randomlist, list[index]); //找到此曲
    } else {
        commit(types.SET_PLAYLIST, list); //设置序列
    }
    // 剩下的照常提交
    commit(types.SET_CURRENT_INDEX, index); //随机播放默认取第0个
    commit(types.SET_FULL_SCREEN, true); //默认全屏显示播放器
    commit(types.SET_PLAYING_STATE, true); //开启播放
}

export const likeSong = function({ commit, state }, { song }) {
    if (_findindex(state.likelist, song) !== -1) {
        return;
    } //检测是否存在
    commit(types.SET_LIKE_LIST, song); //加入喜欢队列
}
export const unlikeSong = function({ commit, state }, { song }) {
    if (_findindex(state.likelist, song) === -1) {
        return; //未查询到歌曲
    }
    commit(types.DEL_LIKE_LIST, _findindex(state.likelist, song));
}
export const deleteSonglist = function({ commit, state }) {
    commit(types.SET_PLAYLIST, []); //播放列表空
    commit(types.SET_SEQUENCE_LIST, []); //序列空
    commit(types.SET_CURRENT_INDEX, -1); //曲目空
    commit(types.SET_PLAYING_STATE, false); //停止播放
}
export const deleteSong = function({ commit, state }, song) {
    let playlist = state.playlist.slice(0);
    let sequenceList = state.sequenceList.slice(0);
    let currentIndex = state.currentIndex;
    let pIndex = _findindex(playlist, song);
    playlist.splice(pIndex, 1); //删去指定歌曲
    let sIndex = _findindex(sequenceList, song);
    sequenceList.splice(sIndex, 1);
    if (currentIndex > pIndex || currentIndex === playlist.length) {
        currentIndex--;
    } //若删除在之前
    commit(types.SET_PLAYLIST, playlist); //曲表变
    commit(types.SET_SEQUENCE_LIST, sequenceList);
    commit(types.SET_CURRENT_INDEX, currentIndex);

    let playingState = playlist.length > 0;
    commit(types.SET_PLAYING_STATE, playingState);
}
export const saveHistory = function({ commit, state }, query) {
    let history = state.searchHistory;
    commit(types.SET_SEARCHHISTORY, history.push(query));
}

export const delHistory = function({ commit, state }, query) {
    let history = state.searchHistory;
    //找到history中关键字并删除
    let i = history.findIndex((item) => {
        return item === query;
    })

    commit(types.SET_SEARCHHISTORY, history.splice(i, 1));
}
export const clearHistory = function({ commit }) {
    commit(types.SET_SEARCHHISTORY, []);
}
export const insertSong = function({ commit, state }, song) {
    let playlist = state.playlist.slice(0);
    let sequenceList = state.sequenceList.slice(0);
    let currentIndex = state.currentIndex;
    //记录当前歌曲
    let currentSong = playlist[currentIndex];

    //查找是否已存在
    let fpIndex = _findindex(playlist, song);
    currentIndex++;
    playlist.splice(currentIndex, 0, song); //往数组指定位置加当前歌曲；
    if (fpIndex > -1) {
        if (currentIndex > fpIndex) {
            //在目标后
            playlist.splice(fpIndex, 1); //直接删除重复歌曲
        } else {
            playlist.splice(fpIndex + 1, 1); //因为之前加入后面下标都需要加1
        }
    }
    let currentSIndex = _findindex(sequenceList, currentSong) + 1;
    //查找歌曲是否已在列表中
    let fsIndex = _findindex(sequenceList, song);
    if (fsIndex > -1) {
        if (currentSIndex > fsIndex) {
            sequenceList.splice(fsIndex, 1);
        } else {
            sequenceList.splice(fsIndex + 1, 1); //同上
        }
    }
    commit(types.SET_PLAYLIST, playlist);
    commit(types.SET_SEQUENCE_LIST, sequenceList);
    commit(types.SET_CURRENT_INDEX, currentIndex);
    commit(types.SET_PLAYING_STATE, true);
    commit(types.SET_FULL_SCREEN, true);
}