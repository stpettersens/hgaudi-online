/*
hackedGaudi
Copyright 2013 Sam Saint-Pettersen.

Node.js integration.
Released under the MIT/X11 License.
*/
'use strict';

var crypto = require('crypto')
, cookie = require('cookie')
, db = require('./db');
var io, contents, filename, tokenId, ifiles, ofiles;
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
		});
	},
	createCookie: function(res) {
		res.cookie('hgaudi.token', createCookieToken(), {path:'/'});
	}
}
function createCookieToken() {
	return crypto.createHash('sha1').digest('hex');
}
function pushInputToDatabase() {
	if(contents != null && filename != null && tokenId != null) {
		var file = { tokenId:tokenId, filename:filename, contents:contents};
		db.insertOne('ifiles', file, function(err, file) { console.log(file); });
	}
}
function pullInputFromDatabase(tokenId, socket) {
	console.log('Looking for input files with tokenId: ' + tokenId);
	db.find('ifiles', {tokenId: { '$gte': tokenId}}, 100, function(err, files) { 
		socket.emit('populateInputList', {files:files});
	});
}
