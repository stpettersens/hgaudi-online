/*
hackedGaudi
Copyright 2013 Sam Saint-Pettersen.

Node.js integration.
Released under the MIT/X11 License.
*/
'use strict';

var db = require('./db')
, fs = require('fs')
, Buffer = require('buffer').Buffer
, constants = require('constants')
, path = require('path')
, io, contents, filename, filetype, tokenId;
module.exports = {
	createSocket: function(app) {
		io = require('socket.io').listen(app);
		io.sockets.on('connection', function(socket) {
			socket.on('setContents', function(data) {
				contents = data.contents;
			});
			socket.on('setFilename', function(data) {
				filename = data.filename;
			});
			socket.on('setFileType', function(data) {
				filetype = data.filetype;
			});
			socket.on('setTokenId', function(data) {
				tokenId = data.tokenId;
			});
			socket.on('pushInputToDb', function() {
				pushInputToDatabase();
			});
			socket.on('pullInputFromDb', function(data) {
				pullInputFromDatabase(data.tokenId, socket);
			});
			socket.on('pullOutputFromDb', function(data) {
				pullOutputFromDatabase(data.tokenId, socket);
			});
			socket.on('removeInputFromDb', function(data) {
				removeInputFromDatabase(data.tokenId, data.filename);
			});
		});
	},
	pushBinaryOutputToDatabase: function(tokenId, filename, binary) {
		var binary = path.normalize(binary);
		fs.open(binary, 'r', function(status, fd) {
			if(status) {
				console.log(status.message);
				return;
			}
			var buffer = new Buffer(24000);
			fs.read(fd, buffer, 0, 24000, 0, function(err, num) {
				var binary_data = buffer.toString('base64', 0, num);
				var file = {tokenId:tokenId, filename:filename, filetype:filename, contents:binary_data};
				db.insertOne('ofiles', file, function(err, file) {
					console.log(file);		
				});
			});
			//fs.unlinkSync(binary);
		});
	}
}
function writeBinaryFromDatabase(tokenId, filename) {
	db.findOne('ofiles', {tokenId:tokenId, filename:filename}, function(err, file) {
		console.log(file);
		fs.writeFile(filename + '_clone.exe', file.contents, 'base64', function(err) {});
	});
}
function pushInputToDatabase() {
	if(contents != null && filename != null && filetype != null && tokenId != null) {
		if(filetype != 'json') {
			var Entities = require('html-entities').XmlEntities;
			var entities = new Entities();
			contents = entities.encode(contents);
		}
		var file = {tokenId:tokenId, filename:filename, filetype:filetype, contents:contents};
		db.insertOne('ifiles', file, function(err, file) {});
	}
}
function pullInputFromDatabase(tokenId, socket) {
	db.find('ifiles', {tokenId:tokenId}, 100, function(err, files) { 
		socket.emit('populateInputList', {files:files});
	});
}
function pullOutputFromDatabase(tokenId, socket) {
	db.find('ofiles', {tokenId:tokenId}, 100, function(err, files) {
		socket.emit('populateOutputList', {files:files});
	});
}
function removeInputFromDatabase(tokenId, filename) {
	db.removeOne('ifiles', {tokenId:tokenId, filename:filename});
}
