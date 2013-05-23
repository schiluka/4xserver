var open_xchg_app_id ='f2aa9c9d5ae04b1187770f89fb4684cb';

var http = require('http')

var options = {
    host: 'http://openexchangerates.org/api/latest.json?app_id=' + open_xchg_app_id,
    headers: {
        'Content-Type': 'application/json'
    }
};

var request = require('request');
//var simplexdao = require('./dao');

var reqUrl ='http://openexchangerates.org/api/latest.json?app_id=f2aa9c9d5ae04b1187770f89fb4684cb';
exports.callOpenExchangeAPI =function (req,res) {
	var base = req.params.base;
	if (base != '') {
		reqUrl += '&base='+ base;
	}
	console.log('request URL -- >' + reqUrl);
	request(options, function (error, response, body) {
	if (!error && response.statusCode == 200) {
		 var oeResponse = JSON.parse(body);
		 var base = oeResponse.base;
		 console.log('base:' + base + ' response: ' + oeResponse.rates.INR);
		 res.send(oeResponse);
//		 forex.addSymbol(oeResponse);
	}
	else {
		res.send(JSON.parse(body));
	}
  
  
}) };

exports.callYahooAPI = function (req,res) {
	var base = req.params.base;
	var target = req.params.target; 
	var yqlQuery = 'select * from csv where url="http://finance.yahoo.com/d/quotes.csv?e=.csv&f=c4l1&s=' + base + target + '=X"';
	console.log('yqlQuery --> ' + yqlQuery);
	require('http').request({
		host: 'query.yahooapis.com',
		path: '/v1/public/yql?q=' + encodeURIComponent(yqlQuery) + '&format=json',
		method: 'GET'
	}, function(res) {
		res.setEncoding('utf8');
		var body = '';
		res.on('data', function(chunk) {
			body += chunk;
		});
		res.on('end', function() {
			body = JSON.parse(body);
			//Do stuff here
			if (body instanceof Object) {
				data = JSON.stringify(body);
				console.log('body here : ' + data + ' results:'+ body.query.results.row.col0 + ':'+ body.query.results.row.col1);        	
			}
			
		});
	}).end();
}

//Example query from browser
//http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.xchange%20where%20pair%3D%22USDINR%2C%20EURUSD%2CCADUSD%2CGBPUSD%22&format=json

//http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.xchange%20where%20pair%3D%22USDINR%2C%20EURUSD%2CCADUSD%2CGBPUSD%22&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=

//To test this, call http://localhost:3000/4x/USD/INR
exports.convertService = function (req, res) {
	console.log('convertService invoked');
	var inputSets = req.query.q;
	console.log('inputSets param:' + inputSets);
	//var target = req.params.target;
	//prepare inputSets as comma separated values 
	//var inputSets='USDINR,USDEUR,GBPUSD';
	var yqlQuery = 'select * from yahoo.finance.xchange where pair="' + inputSets + '"';
	console.log('yqlQuery --> ' + yqlQuery);
	var body = '';
	
	var yahooApiOptions = '&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
	http.request({
		host: 'query.yahooapis.com',
		path: '/v1/public/yql?q=' + encodeURIComponent(yqlQuery) + yahooApiOptions,
		method: 'GET'
		}, function(yahooResp) {
			yahooResp.setEncoding('utf8');
			yahooResp.on('data', function(chunk) {
				body += chunk;
				var xdata = JSON.parse(body);
				console.log('sending json output');
				console.log(xdata.query.results);
				res.send(xdata.query.results);
			});

	}).end();
}


exports.convertServiceOld = function (req, res) {
	console.log('convertService invoked');
	var base = req.params.base;
	var target = req.params.target; 
	var yqlQuery = 'select * from csv where url="http://finance.yahoo.com/d/quotes.csv?e=.csv&f=c4l1&s=' + base + target + '=X"';
	console.log('yqlQuery --> ' + yqlQuery);
	var body = '';
	
	http.request({
		host: 'query.yahooapis.com',
		path: '/v1/public/yql?q=' + encodeURIComponent(yqlQuery) + '&format=json',
		method: 'GET'
		}, function(yahooResp) {
			yahooResp.setEncoding('utf8');
			yahooResp.on('data', function(chunk) {
				body += chunk;
				//data = JSON.stringify(body);
				console.log('sending json output');
				console.log(body);
				res.send(body);
			});

	}).end();
}
