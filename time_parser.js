var http = require("http");
var url = require("url");
var get = require('get');
var querystring = require('querystring');
var crypto = require('crypto');
var cheerio = require('cheerio');
var fs = require('fs');
var fse = require('fs-extra');

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
	var codigo =  new Array();


	for(var i = 0; i < linhas.length ; i++){
			//Push all the number code to the codigo array.
			codigo.push(querystring.parse(url.parse(linhas[i].attribs["href"]).query)["CdPjOID"]);
		}

		console.log(this.codigo);
	//agora nós temos os códigos de todas as linhas.

	for(var j = 0; j < codigo.length; j++){
		codigo_linha = codigo[j];
		if (fs.existsSync("times/"+codigo_linha+"_horarios.json")) {
			continue;
		}
		console.log(codigo_linha);
		linha_url = 'http://www.emdec.com.br/ABusInf/detalhelinha.asp?TpDiaID=0&CdPjOID=' + codigo_linha;
		console.log(linha_url);
		parseTimeTable(linha_url, codigo_linha);	
	}
});

function parseTimeTable(url, codigo_linha){
	// console.log(url);
	get( { uri:url, encoding:"binary"}).asString(function(err, body){
		try{
		var decoder = new (require('string_decoder').StringDecoder)('utf-8');
		var data = decoder.write(body);
	//Load the data at the cheerio parser(html parser)
	var tabelaDeDiasUteis = new Array();
	$ = cheerio.load(data);
	//pega a tabela e itera sobre ela
	var tabela = $('.bgAzulClaro table').eq(4).children().each(function(index, element){
		var text = $(this).text();
		var regexp = /(\d\d:\d\d)/g;
		while (matches = regexp.exec(text)) {
			tabelaDeDiasUteis.push(matches[1]);
		}
	});
}catch(a){
	console.log("ERRO NA LINHA" + codigo_linha + "\n");
	return;
}
	writeToFile(tabelaDeDiasUteis, "times/"+ codigo_linha + "_horarios.json");
});
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
