//Configure these before running node server
//npm install express
//npm install request
//npm install node-schedule

//Background jobs - run every 5mins and load data into db
var schedule = require('node-schedule');

var j = schedule.scheduleJob('*/5 * * * *', function(){
	//Call Yahoo function here
    console.log('Yay, my job is kicked off!');
});

var express = require('express'),
    request = require('./api');
 
var app = express();
 
app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
});

//exports.SimplexDb = SimplexDb;

app.get('/4x/convert',request.convertService);

app.get('/4x/', function(req, res){
	console.log('Missing arguments - bad request');
	res.send('Missing arguments - bad request');
});

app.post('/4x/:base', request.callOpenExchangeAPI);
app.post('/4x/:base/:target',request.callYahooAPI);
 
app.listen(3000);
console.log('Listening on port 3000...');