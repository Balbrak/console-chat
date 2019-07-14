const lib = require('./lib/lib.js');
const io = require('socket.io-client');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '> ',
    terminal: false,
});

const server = {
    ip: 'http://localhost',
    port: 8080,
};
var socket = io(server.ip + ':' + server.port);
var name;
var room = 'default';

lib.askName(rl, socket, (n) => {
    setName(n);
    rl.prompt();

    rl.on('line', (input) => {
        if (input[0] == '/' && input.length > 1) {
            var cmd = input.match(/[a-zA-Z]+\b/)[0];
            var params = input.substr(cmd.length+2, input.length);
            lib.chatCommand(socket, rl, name, room, cmd, params);
        } else {
            lib.chatMessage(socket, room, input, name);
            rl.prompt();
        }
    });

    socket.on('message', (data) => lib.onMessage(data, name, rl));
    socket.on('serv', (data) => lib.onServ(data, rl));
});

socket.on('shutdown', ()=>{process.exit(0)});

function setRoom(r) {
    room = r;
}
function setName(n) {
    name = n;
    rl.setPrompt(name + '> ');
    //rl.write(null);
}

exports.setRoom = setRoom;
exports.setName = setName;