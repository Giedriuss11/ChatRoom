const { Server } = require('socket.io');
const socketDb = require('./database');
const io = new Server({
    cors: {
        origin: 'http://localhost:3000',
    },
});

// socketDb.initialize(io); // Pass the 'io' instance to the 'initialize' function

io.on('connection', (socket) => {
    socket.on('addUser', (id) => {
        socketDb.addUser(id, socket, socket.id);
    });

    socket.on('disconnect', () => {
        socketDb.removeSocket(socket.id);
    });
    socket.on('removeUserId', id => {
        socketDb.disconnectUser(id)
    })
});

io.listen(4002);

module.exports = io;