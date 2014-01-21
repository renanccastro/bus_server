var http = require("http");
var url = require("url");
var get = require('get');
var crypto = require('crypto');
var cheerio = require('cheerio');
var google = new google();
var querystring = require('querystring');
var document = new document();
var fs = require('fs');
var fse = require('fs-extra');
var ida = new Array();
var ida_used = 0;
var pontos = new Array();
var volta = new Array();
var nomesDasLinhas = new Array();
var codigo = new Array();
var md5 = require('MD5');

var number = 3;

var asd = " ";

fse.removeSync('json/');
fse.mkdirsSync('json/');

get( ' http://www.emdec.com.br/ABusInf/consultarLinha.asp?consulta=1 ').asString(function(err, data){
    if(err)
        throw err;
    $ = cheerio.load(data);
    var b = $('.cinza a');
    var a = $(" strong ");
    nomesDasLinhas = a.text().split('\n');


    console.log(b.length);
    for(var i = 0; i < b.length ; i++){
            codigo.push(querystring.parse(url.parse(b[i].attribs["href"]).query)["CdPjOID"]);
    }
    //console.log(codigo.length);
    for(var j = 0; j < codigo.length; j++){
        var get = require('get');
        number = codigo[j];
        console.log(number);
        asd = 'http://www.emdec.com.br/ABusInf/ABInfSvItiDLGoogleM.asp?CdPjOID=' + number + '&TpDiaID=0';
        console.log(asd);
        setTimeout(getString(asd, number, j+1), 30000);
    }
});


function getString(asd, number, number2 ){

        get(asd).asString(function(err, data) {
            if(err) throw err;
            $ = cheerio.load(data);
            treatArray($('script').contents().text(), number, number2);

        });
}





function treatArray(script, number, number2){
    //console.log(script);

    var window = new Object();
    eval(script);
    initialize();
    saveArrays(ida, volta, pontos, number, number2);
}

function saveArrays(polyline_ida, polyline_volta ,   markers, number, number2){
    var name = nomesDasLinhas[number2];
    var dictionary = {};
    dictionary["name"] = name;
    dictionary["polyline_ida"] = polyline_ida;
    dictionary["polyline_volta"] = polyline_volta;
    dictionary["pontos"] = markers;
    var outputFilename = 'json/line_' + number2 + '.json';
    //Verify if the file exists, create a md5 and check it
    writeToFile(dictionary, outputFilename);
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
