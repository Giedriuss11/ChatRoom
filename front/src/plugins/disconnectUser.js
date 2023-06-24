export default {
    disconnectSocket: (socket, id ) => {
        socket.emit('removeUserId', id);
    }
}