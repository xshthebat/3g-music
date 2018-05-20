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