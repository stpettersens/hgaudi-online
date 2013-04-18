/*
hackedGaudi
Copyright 2013 Sam Saint-Pettersen.

Node.js integration.
Released under the MIT/X11 License.
*/
'use strict';

var hglib = require('../lib/hglib')
, db = require('../lib/db')
, cookie = 'hgaudi.token'
, allowed = [ 'g++', 'haxe', 'strip' ];
module.exports = {
	getIndex: function(req, res) {
		res.render('index');
	},
	getAllInputFiles: function(req, res) {
		var tokenId = req.cookies.get(cookie);
		db.find('ifiles', {tokenId:tokenId}, 100, function(err, files) {
			if(files.length > 0) res.send(files);
			else res.send('None found!');
		});
	},
	getInputFile: function(req, res) {
		var filename = req.params.filename;
		var tokenId = req.cookies.get(cookie);
		db.findOne('ifiles', {filename:filename, tokenId:tokenId}, function(err, file) {
			if(file != null) res.send(file);
			else res.send('Not found!');
		});
	},
	getInputFileContents: function(req, res) {
		var filename = req.params.filename;
		var tokenId = req.cookies.get(cookie);
		db.findOne('ifiles', {filename:filename, tokenId:tokenId}, function(err, file) {
			if(file != null) res.send(file.contents);
			else res.send('Not found!');
		});
	},
	executeProgram: function(req, res) {
		execute(req, res, false);
	},
	executeProgramOutput: function(req, res) {
		execute(req, res, true);
	}
}
function execute(req, res, outputOnly) {
		var program = req.params.program;
		var parameters = req.params.parameters;
		var tokenId = req.cookies.get(cookie);;
		var allowRun = false;
		for(var i = 0; i < allowed.length; i++) {
			if(program == allowed[i]) {
				allowRun = true;
				break;
			}
		}
		if(allowRun)  {
			var pprogram = null;
			if(parameters != 'null') pprogram = program  + ' ' + parameters;
			var exec = require('child_process').exec, process;
			process = exec(pprogram, function(err, stdout, stderr) {
				if(!outputOnly) res.send({program:program, parameters:parameters, stdout:stdout, stderr:stderr});
				else res.send(stdout + '\n' + stderr);
			});
		}
		else res.send('Program denied!');
}
