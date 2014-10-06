
var http = require('http');

http.createServer(function (req, res) {

    var url;

    if (req.url.match('^/content')) {

        // returns [1] as undefined if no greater than 0 in length
        url = req.url.match('^/content\/(.*){0,}')[1];

        if (url) {

            console.log('Spottr: Requesting source of "%s"', url);

            http.get('http://' + url, function (response) {

                res.writeHeader(200, {"Content-Type": "text/html"});

                console.log('Spottr: Response received with status code %s', response.statusCode);

                if (response.statusCode === 200) {
                    response.setEncoding('utf8');
                    response.on('data', function (chunk) {
                        res.write(chunk.toString());
                    });
                    response.on('end', function () {
                        // TODO make sure to end response if this 'end' event never happens
                        res.end();
                    })
                } else {
                    res.write('Didn\'t work');
                    res.end();
                }
            }).on('error', function (e) {
                console.log('Got error: ' + e.message);
            });

        }
    };

}).listen('8080');