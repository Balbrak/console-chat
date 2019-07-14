const client = require('./../client.js');

function dateToString(date) {
    var ddate = new Date(date);
    var h = ddate.getHours();
    var m = ddate.getMinutes();
    var s = ddate.getSeconds();
    if (h<10) {h='0'+h}
    if (m<10) {m='0'+m}
    if (s<10) {s='0'+s}
    return h + ':' + m + ':' + s;
}

function consoleOut(rl, msg) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    console.log(msg);
    rl.prompt(true);
}

function chatCommand(socket, rl, name, room, cmd, params) {
    switch (cmd) {
        case "name":
            param0 = params.split(' ')[0];
            isNameCorrect(socket, param0, (b) => {
                if (b) {
                    socket.emit('chatCommand', {
                        type: 'rename', 
                        old: name, new: 
                        param0, room: room
                    });
                    client.setName(param0);
                    rl.prompt();
                } else {
                    consoleOut(rl, 'This name is incorrect or already taken');
                }
            });
            break;
        case "me":
            socket.emit('chatCommand', {
                type: 'me',
                name: name,
                msg: params,
                room: room,
            });
            rl.prompt();
            break;
        case "join":
            var newRoom = params.split(' ')[0];
            socket.emit('chatCommand', {
                type: "join",
                name: name,
                oldRoom: room,
                newRoom: newRoom,
            });
            socket.on('roomchange', (data) => {
                socket.off('roomchange');
                client.setRoom(data.newRoom);
                consoleOut(rl, "You are now in " + newRoom);
            });
            rl.prompt();
            break;
        case "new":
            var roomName = params.split(' ')[0];
            socket.emit('chatCommand', {
                type: 'newRoom',
                newRoom: roomName,
            });
            break;
        case "quit":
            chatCommand(socket, rl, name, room, 'join', 'default');
            break;
        case "list":
            socket.emit('chatCommand', {type: 'list'});
            socket.on('list', (data) => {
                socket.off('list');
                consoleOut(rl, data);
            });
            break;
        default:
            rl.prompt();
            break;
    }
}

function isNameCorrect(socket, name, callback) {
    socket.emit('isnamefree', name);
    socket.on('isnamefree', (err) => {
        socket.off('isnamefree');
        callback(/\w+/.test(name) && !err);
    });
}

function askName(rl, socket, callback) {
    rl.question("What is your name ? > ", (name) => {
            isNameCorrect(socket, name, (b) => {
                if(b) {
                    socket.emit('name', name);
                    callback(name);
                } else {
                    askName(rl, socket, callback);
                }
            });
    });
}

function chatMessage(socket, room, msg, name) {
    socket.emit('chatMessage', {msg: msg, name: name, room: room});
}

function onMessage(data, name, rl) {
    if(data.author != name) {
        consoleOut(rl, '[' + dateToString(data.date) + '] ' + data.author + '> ' + data.msg);
    }
}

function onServ(data, rl) {
    consoleOut(rl, '-' + dateToString(data.date) + '- ' + data.msg + ' -');
}

exports.consoleOut = consoleOut;
exports.chatCommand = chatCommand;
exports.askName = askName;
exports.chatMessage = chatMessage;
exports.onMessage = onMessage;
exports.onServ = onServ;