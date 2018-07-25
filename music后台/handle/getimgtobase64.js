let fs = require('fs')

function getimg(path, type) {
    return new Promise((res, rej) => {
        fs.readFile(path, function(err, buf) {
            res([err, `data:${type};base64,${buf.toString('base64')}`]);
        })
    })
}
module.exports = getimg;