const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const api = require('./api.js');

var names = [];
var rooms = ['default'];

io.on('connection', (socket) => {
    console.log("connection");
    socket.on('isnamefree', (name) => {
        console.log(name + ' is free');
        socket.emit('isnamefree', names.indexOf(name)!=-1);
    });
    socket.on('name', (name) => {
        if (names.indexOf(name) > -1) {
            socket.emit('name', 1);
        } else {
            names.push(name);
            socket.emit('name', 0);
            api.goToRoom(socket, name, 'default');

            socket.on('chatMessage', (data) => api.onChatMessage(socket, data));
            socket.on('chatCommand', (data) => api.onChatCommand(socket, names, rooms, data));

            socket.on('disconnect', () => {
                console.log(name + ' is disconnected');
                names.splice(names.indexOf(name), 1);
            });
        }
    });
});

process.on('SIGINT', function() {
	io.emit('shutdown');
	process.exit(0);
});

const port = 8080;
http.listen(port, () => console.log(`Listening on port ${port}`));