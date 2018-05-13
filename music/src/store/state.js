import { playMode } from "../common/js/config";
const state = {
    singer: {},
    playing: false,
    playlist: [],
    sequenceList: [],
    mode: playMode.sequence,
    fullScreen: false,
    currentIndex: -1,
    likelist: []
}
export default state