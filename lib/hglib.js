/*
hackedGaudi
Copyright 2013 Sam Saint-Pettersen.

Node.js integration.
Released under the MIT/X11 License.
*/
'use strict';

var crypto = require('crypto')
, cookie = require('cookie');
var io;
module.exports = {
	createSocket: function(app) {
		io = require('socket.io').listen(app);
		io.sockets.on('connection', function(socket) {
			socket.on('setContents', function(data) {
				console.log(data.contents);
			});
			socket.on('setFilename', function(data) {
				console.log(data.filename);
			});
			socket.on('setTokenId', function(data) {
				console.log(data.tokenId);
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
