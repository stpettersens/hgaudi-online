/*
hackedGaudi
Copyright 2013 Sam Saint-Pettersen.

Node.js integration.
Released under the MIT/X11 License.
*/
'use strict';

var io, filename, contents;
module.exports = {
	createSocket: function(app) {
		io = require('socket.io').listen(app);
		io.sockets.on('connection', function(socket) {
			socket.on('transferFile', function(data) {
				contents = data.contents;
				console.log(contents);
			});
			socket.on('setFilename', function(data) {
				filename = data.filename;
				console.log(filename);
			});
		});
	},
}
