/*
hackedGaudi
Copyright 2013 Sam Saint-Pettersen.

Node.js integration.
Released under the MIT/X11 License.
*/
'use strict';

var db = require('./db');
var io, contents, filename, tokenId;
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
			socket.on('setTokenId', function(data) {
				tokenId = data.tokenId;
			});
			socket.on('pushInputToDb', function() {
				pushInputToDatabase();
			});
			socket.on('pullInputFromDb', function(data) {
				pullInputFromDatabase(data.tokenId, socket);
			});
			socket.on('removeInputFromDb', function(data) {
				removeInputFromDatabase(data.filename);
			})
		});
	}
}
function pushInputToDatabase() {
	if(contents != null && filename != null && tokenId != null) {
		var file = { tokenId:tokenId, filename:filename, contents:contents};
		db.insertOne('ifiles', file, function(err, file) {});
	}
}
function pullInputFromDatabase(tokenId, socket) {
	db.find('ifiles', {tokenId: tokenId}, 100, function(err, files) { 
		socket.emit('populateInputList', {files:files});
	});
}
function removeInputFromDatabase(filename) {
	db.removeOne('ifiles', {filename:filename});
}
