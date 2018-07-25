let fs = require('fs');
let http = require('http');
let imagesdefault = function() {
    fs.readFile('../music后台/stick/defalutimg/defalutimg.png', function(err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log(data);
            http.createServer(function(req, res) {
                res.writeHead(200, { "Content-Type": "application/x-png" });
                res.write(data, 'default');
                res.end();
                return;
            }).listen(8882);
        }
    })
}
module.exports = imagesdefault;