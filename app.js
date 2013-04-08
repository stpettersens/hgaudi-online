/*
hackedGaudi
Copyright 2013 Sam Saint-Pettersen.

Node.js integration.
Released under the MIT/X11 License.
*/
'use strict';

var express = require('express')
, hgroutes = require('./routes/hgroutes.js');

var app = express.createServer();
app.configure(function() {
	app.use(express.bodyParser());
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.use(express.static(__dirname + '/public'));
});
app.set('view options', {
	layout: false
});
app.get('/', hgroutes.getIndex);
app.listen(3000);
