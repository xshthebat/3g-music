import { playMode } from "../common/js/config";
const state = {
    singer: {},
    playing: false,
    playlist: [],
    sequenceList: [],
    mode: playMode.sequence,
    fullScreen: false,
    currentIndex: -1,
    likelist: [],
    searchHistory: [] //搜索历史
}
export default state