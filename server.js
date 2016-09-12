var PORT = process.env.PORT || 3000;
var moment = require('moment');
var express = require('express');
var app = express();
var http = require('http').Server(app);// Set http as an express server
var io = require('socket.io')(http);// Set io as a http socket

app.use(express.static(__dirname + '/public'));

var clientInfo = {};


io.on('connection', function (socket) {
	console.log('User connected via socket.io!');



// Execute when a new user joins a room ==> Need other function to limit rooms etc.
	socket.on('joinRoom', function (req) {
		clientInfo[socket.id] = req;
		socket.join(req.room);
		socket.broadcast.to(req.room).emit('message', {
			name: 'System',
			text: req.name + ' has joined!',
			timestamp: moment().valueOf()
		});
	});





// Execute then a message is sent
	socket.on('message', function (message) {
		console.log('Message received: ' + message.text);   // remove for prodution

		message.timestamp = moment().valueOf();
		io.to(clientInfo[socket.id].room).emit('message', message);
	});

	// timestamp property - JavaScript timestamp (milliseconds)

	socket.emit('message', {
		name: 'System',
		text: 'Welcome to the chat application!',
		timestamp: moment().valueOf()
	});
});

http.listen(PORT, function () {
	console.log('Server started!');
});