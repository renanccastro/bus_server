
var http = require('http');
var url = require('url');
var fs = require('fs');
var crypto = require('crypto');

var cronJob = require('cron').CronJob;
new cronJob('0 0-23/2 * * *', function(){
    require("./updater.js");
    console.log('Updating database...');
}, null, true);

// Configure our HTTP server to respond with Hello World to all requests.
var server = http.createServer(function (request, response) {
    var query = url.parse(request.url, true)
    var queryData = query.query;
    response.writeHead(200, {"Content-Type": "text/plain"});

    var json_file = "json/" + queryData.file;
    var json_hash = queryData.hash;
    //if it was requested a count
    if(query.pathname == "/count"){
        fs.readdir("json/", function(err, files){
            response.end(files.length.toString());
        });
    }
    else{
        if (json_file && json_hash) {
            fs.readFile(json_file, function(err, fd){
                if(!err){
                    var hash_new = crypto.createHash('md5').update(fd.toString()).digest('hex');
                    if(hash_new != json_hash){
                        response.end(fd.toString());
                    }
                    else{
                        response.end("nil");
                    }
                }
                else{
                }
            });
        }
    }
});

// Listen on port 8000, IP defaults to 127.0.0.1
server.listen(8000);
