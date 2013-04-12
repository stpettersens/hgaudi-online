/*
hackedGaudi
Copyright 2013 Sam Saint-Pettersen.

Node.js integration.
Released under the MIT/X11 License.
*/
'use strict';

module.exports = {
	createSocket: function(app) {
		io = require('socket.io').listen(app);
		io.sockets.on('connection', function(socket) {
			socket.on('transferFile', function(data) {
				console.log('Received via socket: ' + data);
			});
		});
	}
}
