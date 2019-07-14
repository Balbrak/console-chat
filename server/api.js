function onChatMessage(socket, data) {
    socket.in(data.room).emit('message', {
        author: data.name,
        msg: data.msg,
        room: data.room,
        date: Date.now(),
    });
}

function onChatCommand(socket, names, rooms, data) {
    switch (data.type) {
        case 'rename':
            names.splice(names.indexOf(data.old), 1);
            names.push(data.new);
            msgRename(socket, data.old, data.new, data.room);
            break;
        case 'me':
            socket.in(data.room).emit('message', {
                author: '',
                msg: data.name + ' ' + data.msg,
                room: data.room,
                date: Date.now(),
            });
            break;
        case 'join':
            if (rooms.indexOf(data.newRoom) != -1) {
                leaveRoom(socket, data.name, data.oldRoom);
                goToRoom(socket, data.name, data.newRoom);
                socket.emit('roomchange', {newRoom: data.newRoom});
            } else {
                socket.emit('serv', {
                    msg: "This room does not exist",
                    date: Date.now(),
                })
            }
            break;
        case 'newRoom':
            if (rooms.indexOf(data.newRoom) == -1) {
                rooms.push(data.newRoom);
                socket.emit('serv', {
                    msg: "The room " + data.newRoom + " has been created successfully",
                    date: Date.now(),
                });
            } else {
                socket.emit('serv', {
                    msg: "This room exist !",
                    date: Date.now(),
                });
            }
            break;
        case 'list':
            socket.emit('list', rooms);
            break;
        default:
            break;
    }
}

function msgRename(socket, oldName, newName, room) {
    socket.in(room).emit('serv', {
        msg: oldName + ' is now known as ' + newName,
        date: Date.now(),
    })
}

function goToRoom(socket, name, room) {
    socket.join(room);
    console.log(name + ' has joined ' + room);
    socket.in(room).emit('serv', {
        msg: name + ' has joined ' + room, 
        date: Date.now(),
    });
}

function leaveRoom(socket, name, room) {
    socket.leave(room);
    console.log(name + ' has leaved ' + room);
    socket.in(room).emit('serv', {
        msg: name + ' has leaved ' + room,
        date: Date.now(),
    })
}

exports.onChatMessage = onChatMessage;
exports.onChatCommand = onChatCommand;
exports.msgRename = msgRename;
exports.goToRoom = goToRoom;