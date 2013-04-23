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
	execute: function(req, res) {
		executeProgram(req, res, false);
	},
	executeOutput: function(req, res) {
		executeProgram(req, res, true);
	}
}
function getInputFile(req, res, showContents) {
	var filename = req.params.filename;
	var tokenId = req.cookies.get(cookie);
	db.findOne('ifiles', {filename:filename, tokenId:tokenId}, function(err, file) {
		if(file != null && !showContents) res.send(file);
		else if(file != null && showContents) res.send(file.contents);
		else res.send('Not found!');
	});
}
function executeProgram(req, res, onlyOutput) {
	var tokenId = req.cookies.get(cookie);
	var exec = require('child_process').exec, proc;
	var program = req.params.program;
	var parameters = req.params.parameters;
	var vprog = program;
	if(parameters != 'null') vprog = program + ' ' + parameters;
	proc = exec(vprog, function(err, stdout, stderr) {
		if(!onlyOutput)
			res.send({tokenId:tokenId, program:program,
			parameters:parameters, stdout:stdout, stderr:stderr});
		else if(stdout != '' || stderr != '') res.send(stdout + '\n' + stderr);
		else res.send();	
	});
}
