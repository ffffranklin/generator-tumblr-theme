/**
 * Spottr
 *
 * A tumblr blog proxy that converts XML tumblr logs to JSON
 * @author ffffranklin
 */

var PORT = 8080;
var http = require('http');

http.createServer(function (req, res) {

    var url;

    
    // check if url path starts with content and has a character after it
    if (req.url.match(/^\/content\/\S+/)) {

        // returns [1] as undefined if no greater than 0 in length
        url = req.url.match('^/content\/(.*){0,}')[1];

        if (url) {

            console.log('Spottr: Requesting source of "%s"', url);

            http.get('http://' + url, function (response) {

                res.writeHeader(200, {"Content-Type": "text/plain"});

                console.log('Spottr: Response received with status code %s', response.statusCode);

                if (response.statusCode === 200) {
                    response.setEncoding('utf8');
                    response.on('data', function (chunk) {
                        res.write(chunk);
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
    } else {
        res.write('404');
        res.end();
    }

}).listen(PORT);

console.log('Spottr: Created Server "http://localhost:%s"', PORT);

