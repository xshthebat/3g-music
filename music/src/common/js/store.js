const store = {
    getstore: {
        getlookhistory: () => {
            return getstore('lookhirtory');
        },
        getPlaylist: () => {
            return getstore('playlist');
        },
        getMode: () => {
            return getstore('playmodes') ? getstore('playmodes') : '0';
        },
        getSearchHisory: () => {
            return getstore('setSearchHisory');
        },
        getLikelist: () => {
            return getstore('setLikelist');
        },
        getsequenceList: () => {
            return getstore('sequenceList');
        },
        getIndex: () => {
            return getstore('currentIndex');
        }
    },
    setstore: {
        setlookhistory: (key) => {
            setstore('lookhirtory', key);
        },
        setPlaylist: (key) => {
            setstore('playlist', key);
        },
        setMode: (key) => {
            setstore('playmodes', key);
        },
        setSearchHisory: (key) => {
            setstore('setSearchHisory', key);
        },
        setLikelist: (key) => {
            setstore('setLikelist', key);
        },
        setsequenceList: (key) => {
            setstore('sequenceList', key);
        },
        setIndex: (key) => {
            return setstore('currentIndex', key);
        }
    }
}

function setstore(value, key) {
    // console.log(value, key);
    localStorage.setItem(value, JSON.stringify(key));
}

function getstore(value) {
    let key = localStorage.getItem(value);
    // console.log(value, key);
    try {
        key = JSON.parse(key);
    } catch (e) {

    }
    return key;
}
export default store