var http = require("http");
var url = require("url");
var get = require('get');
var crypto = require('crypto');
var cheerio = require('cheerio');
var querystring = require('querystring');
var fs = require('fs');
var fse = require('fs-extra');

exports.updateServer = function ( response ){
    var google = new google();
    var document = new document();
    ida = new Array();
    var ida_used = 0;
    pontos = new Array();
    volta = new Array();
    var nomesDasLinhas = new Array();
    codigo = new Array();
    ready_lines = 0;

    var number = 3;

    var asd = " ";

    // Cleaning up the directory
    fse.mkdirsSync('new_json/');

    //Get the url that says the code of all bus lines, and parse it
    get( { uri:' http://www.emdec.com.br/ABusInf/consultarLinha.asp?consulta=1 ', encoding:"binary"}).asString(function(err, body){
        if(err)
            throw err;
        var decoder = new (require('string_decoder').StringDecoder)('utf-8');
        var data = decoder.write(body);
        //Load the data at the cheerio parser(html parser)
        $ = cheerio.load(data);
        var linhas = $('.cinza a');
        var nomes = $(" strong ");
        nomesDasLinhas = nomes.text().split('\n');


        for(var i = 0; i < linhas.length ; i++){
            //Push all the number code to the codigo array.
            this.codigo.push(querystring.parse(url.parse(linhas[i].attribs["href"]).query)["CdPjOID"]);
        }
        console.log(this.codigo);

        for(var j = 0; j < this.codigo.length; j++){
            var get = require('get');
            codigo_linha = this.codigo[j];
            linha_url = 'http://www.emdec.com.br/ABusInf/ABInfSvItiDLGoogleM.asp?CdPjOID=' + codigo_linha + '&TpDiaID=0';
            console.log(linha_url);
            setTimeout(getMapsJavascriptStringFromLine(linha_url, codigo_linha, j+1), 30000);
        }
    });

    function allIsReady(){
        fs.readFile("database_options.json", 'utf8', function (err, data) {
            if (err) {
                console.log('Error: ' + err);
                return;
            }
            data = JSON.parse(data);
            //here is made a simple diff process to store the differences at the json version file.
            var sys = require('sys')
            var exec = require('child_process').exec;
            var child;

            child = exec("diff -q json/ new_json/ | grep differ | cut -f2 -d ' '", function (error, stdout, stderr) {
                if(stdout == ""){
                    if(data["file_count"] != this.codigo.length){
                        console.log('you have only file count diff');
                        var array = new Array();
                        for(i = data["file_count"]; i<= this.codigo.length; i++){
                            array.push("json/line_"+i.toString()+".json");
                        }
                        var dictionary = {"diff_files": array,"new_file_count":this.codigo.length};

                        writeToFile(dictionary, "json/update_"+data["version"]+".json" );
                        data["version"] = data["version"]+1;
                        data["file_count"] = this.codigo.length;
                        writeToFile(data, "database_options.json");

                    }
                    else
                        console.log("you have 0 deviations, no patch is needed");
                        response.end("No update was needed");
                }
                else{
                    console.log('you have deviations!');
                    console.log(stdout);
                    var array = stdout.split('\n');
                    array.pop();
                    if(data["file_count"] != this.codigo.length){
                        for(i = data["file_count"]; i<= this.codigo.length; i++){
                            array.push("json/line_"+i.toString()+".json");
                        }
                    }
                    var dictionary = {"diff_files":array,"new_file_count":this.codigo.length};
                    writeToFile(dictionary, "update_"+data["version"]+".json" );
                    data["version"] = data["version"]+1;
                    data["file_count"] = this.codigo.length;
                    writeToFile(data, "database_options.json");
                }
                if (error != null) {
                    console.log('exec error: ' + error);
                }
                response.end("Updated was needed, you now have the newest database version on the server");
                fse.removeSync("json/");
                fs.renameSync("new_json/","json/");

            });



        });
    }

    function LineIsReady(){
        this.ready_lines++;
        response.write(this.ready_lines.toString() + " bus lines ready");
        if(this.ready_lines == this.codigo.length){
            allIsReady();
        }
    }

    function getMapsJavascriptStringFromLine(linha_url, codigo_linha, iterador ){

        get(linha_url).asString(function(err, data) {
            if(err){
                console.log("linha: "+iterador+" codigo_linha: "+codigo_linha+"\n linha_url:"+linha_url);
                throw err;
            }
            $ = cheerio.load(data);
            parseJavascriptAndSave($('script').contents().text(), codigo_linha, iterador);
        });
    }

    function parseJavascriptAndSave(script, codigo_linha, iterador){
        var window = new Object();
        eval(script);
        initialize();
        //after the initialize routine, the ida, volta and pontos arrays are populated with data.
        saveArrays(this.ida, this.volta, this.pontos, codigo_linha, iterador);
        this.ida = [];
        this.volta = [];
        this.pontos = [];
    }

    function saveArrays(polyline_ida, polyline_volta ,   markers, codigo_linha, iterador){
        var name = nomesDasLinhas[iterador];
        var dictionary = {};
        dictionary["name"] = name;
        dictionary["web_code"] = codigo_linha;
        dictionary["polyline_ida"] = polyline_ida;
        dictionary["polyline_volta"] = polyline_volta;
        dictionary["pontos"] = markers;
        var outputFilename = 'new_json/line_' + iterador + '.json';
        writeToFile(dictionary, outputFilename);
        LineIsReady();
    }

    function writeToFile(dictionary, outputFilename){
        fs.writeFile(outputFilename, JSON.stringify(dictionary, null, 4), function(err) {
            if(err) {
                console.log(err);
            } else {
                console.log("JSON " + outputFilename + " saved. ");
            }
        });

    }

    function maps(){
        this.MapTypeId = new MapTypeId();
        this.Map = function(a){
        };
        this.event = new event();
        this.Polyline = function(a){
            return new polyline(a);
        }
        this.Marker = function(a){
            b = new marker(a);
            return b;
        };
        this.LatLng = function (lat, lng){
            b = new latlang(lat, lng);
            return b;
        }
    }
    function google(){
        this.maps = new maps();
    }
    function MapTypeId(){
        this.ROADMAP = 1;
    }
    function document(){
        this.getElementById = function (a){

        }
    }
    function polyline(a){
        this.a = a;
        if(ida_used){
            ida = a.path;
        }
        else{
            volta = a.path;
            ida_used = 1;
        }
        this.setMap = function(b){

        };
    }

    function marker(b){
        this.b = b;

        pontos.push(b.position);
        this.setMap = function(c){
        };
    }
    function event(){
        this.addListener = function(a, b, c){
            this.a = a;
            this.b = b;
            this.c = c;
        }
    }
    function latlang(lat, lng){
        this.lat = lat;
        this.lng = lng;
    }
}
