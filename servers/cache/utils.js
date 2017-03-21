

module.exports = {
    getRequestBody(req, done){
        var body = '';
        req.on('data', function (data) {
            body += data;
        })
        req.on("end", function () {
            done(body);
        });
    }
};