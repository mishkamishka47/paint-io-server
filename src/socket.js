const db = require('./db');
const onSocketConnect = io => socket => {
    let logout = null;

    // TODO 2.1 Listen for login events (eg "LOGIN") from client and save the user using db.create(username, socket.id)
    socket.on('LOGIN', (username, ack) => {
        // TODO 2.2 Prevent users from using an existing username using the "acknowledgement" from the client
        if (db.get(username)) {
            ack('That username is already taken. Try a different one.');
        } else {
            // TODO 2.3 Emit an update user list event (eg "UPDATE_USER_LIST") to all clients when there is a login event
            logout = db.create(username, socket.id);
            io.broadcast.emit('UPDATE_USER_LIST', {users: db.all()});
        }
    });

    // TODO 2.4 Listen for "disconnect" events and remove the socket user from the users object (*hint: db.create(username, socket.id) returns the logout fn)
    socket.on('disconnect', () => {
        if (logout) {
            logout();
            // TODO 2.5 emit "UPDATE_USER_LIST" after user has been "logged out" and is removed from "users" object
            io.broadcast.emit('UPDATE_USER_LIST', {users: db.all()});
        }
    });


    // TODO 3.1 Check if a "toUser" is specified and only broadcast to that user
    // TODO 3.2 Include information about the "fromUser" so the client can filter draw events from other users and only display events from the selected user

    socket.on('DRAW_POINTS', data => {
        socket.broadcast.emit('DRAW_POINTS', data);
    });
};

const connect = server => {
    const io = require('socket.io')(server);
    io.on('connect', onSocketConnect(io));
};

module.exports = connect;