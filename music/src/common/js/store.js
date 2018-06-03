const store = {
    getstore: {
        getlookhistory: () => {
            return getstore('lookhirtory');
        }
    },
    setstore: {
        setlookhistory: (key) => {
            setstore('lookhirtory', key);
        }
    }
}

function setstore(value, key) {
    localStorage.setItem(value, key);
}

function getstore(value) {
    let key = localStorage.getItem(value);
    return key;
}
export default store