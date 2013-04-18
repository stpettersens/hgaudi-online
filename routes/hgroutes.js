/*
hackedGaudi
Copyright 2013 Sam Saint-Pettersen.

Node.js integration.
Released under the MIT/X11 License.
*/
'use strict';

var hglib = require('../lib/hglib')
, db = require('../lib/db')
module.exports = {
	getIndex: function(req, res) {
		res.render('index');
	},
	/* Begin API */
	getInputFile: function(req, res) {
		var filename = req.params.filename;
		var tokenId = req.cookies.get('hgaudi.token');
		db.findOne('ifiles', {filename:filename, tokenId:tokenId}, function(error, file) {
			if(file != null) res.send(file.contents);
			else res.send('Not found!');
		});
	}
	/* End API */
}
