/*
hackedGaudi
Copyright 2013 Sam Saint-Pettersen.

Node.js integration.
Released under the MIT/X11 License.
*/
'use strict';

var hglib = require('../lib/hglib');
module.exports = {
	getIndex: function(req, res) {
		res.render('index');
	},
	getApi: function(req, res) {
		//...
	}
}
