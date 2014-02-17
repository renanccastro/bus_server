var http = require('http');
var url = require('url');
var fs = require('fs');
var crypto = require('crypto');
var updater = require("./updater.js");

var cronJob = require('cron').CronJob;
new cronJob('0 0-23/2 * * *', function(){
    updater.updateServer(function(a){});
    console.log('Updating database...');
}, null, true);

Array.prototype.unique = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};

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
    else if(query.pathname == "/updatenow"){
        response.write("Started updating server.");
        updater.updateServer(response);
        console.log('Updating database...');
    }
    //if it was requested an update
    else if(query.pathname == "/update"){
        var user_version = queryData.version;
        var database_options = JSON.parse(fs.readFileSync("database_options.json"));
        //if it is up to date
        if(user_version == "0"){
            var files_to_update = new Array();
            for(i=1; i <= database_options["file_count"]; i++){
                files_to_update.push("json/line_"+i.toString()+".json");
            }

            var dic = {"diff_files":files_to_update, "new_file_count":database_options["file_count"], "newest_version":database_options["version"]};
            response.end(JSON.stringify(dic, null, 4));
        }
        else if(database_options["version"].toString() == user_version){
            response.end("Up to date.");
        }
        //if by chance, the version of the local is greater than the server one, that's bad
        else if(database_options["version"] < parseInt(user_version)){
            response.end("That's some bad hat harry.");
        }
        else{
            var files_to_update = new Array();
            for(i=parseInt(user_version); i < database_options["version"]; i++){
                update = JSON.parse(fs.readFileSync("update_"+i+".json"));
                files_to_update = files_to_update.concat(update["diff_files"]).unique();
                console.log(files_to_update);
            }
            fs.readFile("update_"+user_version+".json", function(err,data){
                if(err)
                    response.end("Error getting update file, try again later");
                else{
                    last_update = JSON.parse(data);
                    var dic = {"diff_files":files_to_update, "new_file_count":last_update["new_file_count"], "newest_version":database_options["version"]};
                    response.end(JSON.stringify(dic, null, 4));
                }
            });
        }
    }
    //get json with complete pathname
    else if(query.pathname == "/get_json"){
        fs.readFile(queryData.file, function(err, fd){
            if(!err){
                response.end(fd.toString());
            }
            else{
                response.end("Error oppening requested json file");
            }
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
server.setTimeout(999999999999999999999999999999999999999999,function(){});
// Listen on port 8000, IP defaults to 127.0.0.1
server.listen(process.env.PORT || 5000);

