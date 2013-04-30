/*
hackedGaudi
Copyright 2013 Sam Saint-Pettersen.

Node.js integration.
Released under the MIT/X11 License.
*/
'use strict';

var hglib = require('../lib/hglib')
, db = require('../lib/db')
, cookie = 'hgaudi.token';
module.exports = {
	getIndex: function(req, res) {
		res.render('index');
	},
	getInput: function(req, res) {
		getInputFile(req, res, false);
	},
	getInputContents: function(req, res) {
		getInputFile(req, res, true);
	},
	executeOutput: function(req, res) {
		executeProgram(req, res);
	}
}
function getInputFile(req, res, showContents) {
	var filename = req.params.filename;
	var tokenId = req.cookies.get(cookie);
	db.findOne('ifiles', {tokenId:tokenId, filename:filename}, function(err, file) {
		if(file != null && !showContents) res.send(file);
		else if(file != null && showContents) res.send(file.contents);
		else res.send('Not found!');
	});
}
function executeProgram(req, res) {
	var tokenId = req.cookies.get(cookie);
	var program = req.params.program;
	var parameters = req.params.parameters.split(' ');
	db.findOne('ifiles', {filename:parameters[0], tokenId:tokenId}, function(err, file) {
		var exec = require('child_process').exec, proc;
		var contents = file.contents.split('\n');
		var binary = parameters[0].split('.');
		var pbinary = 'dump/' + binary[0] + '_' + tokenId + '.exe';
		switch(program) {
			case 'g++':
				program = 'g++ -Wall -o ' + pbinary + ' -xc++ -';
		}
		proc = exec('secho.py a "' + contents + '"|' + program, function(err, stdout, stderr) {
			if(stdout != '' || stderr != '') res.send(stdout + '\n' + stderr);
			else res.send();
			hglib.pushBinaryOutputToDatabase(tokenId, binary[0], pbinary);	
		});	
	});
}
