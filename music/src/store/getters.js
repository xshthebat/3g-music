export const singer = state => state.singer;
export const playlist = state => state.playlist;
export const sequenceList = state => state.sequenceList;
export const mode = state => state.mode;
export const currentIndex = state => state.currentIndex;
export const fullScreen = state => state.fullScreen;
export const playing = state => state.playing;
export const currentSong = state => {
    return state.playlist[state.currentIndex] || {};
}
export const likelist = state => state.likelist;
export const searchHistory = state => state.searchHistory;
export const rankList = state => state.rankList;
export const songlist = state => state.songlist;
export const login = state => state.login;