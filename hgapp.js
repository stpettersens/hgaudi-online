/*
hackedGaudi
Copyright 2013 Sam Saint-Pettersen.

Node.js integration.
Released under the MIT/X11 License.
*/
'use strict';

var express = require('express')
, db = require('./lib/db')
, hglib = require('./lib/hglib')
, hgroutes = require('./routes/hgroutes');

var app = express.createServer();
app.configure(function() {
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.use(express.static(__dirname + '/public'));
});
app.set('view options', {
	layout: false
});
app.get('/', hgroutes.getIndex);
app.get('/api', hgroutes.getApi);
db.open(function() {
	hglib.createSocket(app);
	app.listen(3000);
});
