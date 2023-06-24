let db = [];
let rooms = []


module.exports = {
    addUser: (id, socket, socketId) => {
        db.push({
            id,
            socket,
            socketId,
            room: [],
        });
    },
    getSocket: (id) => {
        const entry = db.find((x) => x.id === id);
        if (entry && entry.socket) {
            return entry.socket;
        }
        return null; // or any other default value you prefer
    },
    getOtherSocket: (id) => {
        const index = db.findIndex((x) => x.id === id);
        if (db[index]) {
            return db[index].socketId;
        }
    },
    getOtherSocketsAllIds: (ids) => {
        const socketIds = [];

        for (const id of ids) {
            const entry = db.find((x) => x.id === id);
            if (entry && entry.socketId) {
                socketIds.push(entry.socketId);
            }
        }

        return socketIds;
    },
    removeSocket: (socketId) => {
        db = db.filter((x) => x.socketId !== socketId);
    },
    disconnectUser: (id) => {
        const roomIndex = rooms.findIndex((x) => x.userJoinedInRoom.includes(id));
        if (roomIndex !== -1) {
            const userIndex = rooms[roomIndex].userJoinedInRoom.indexOf(id);
            rooms[roomIndex].userJoinedInRoom.splice(userIndex, 1);
        }
    },
    joinRoom: (id, room) => {
        const index = db.findIndex((x) => x.id === id);
        db[index].room = room;
    },
    socketJoinedInRoom: (roomId, userId) => {
        const index = rooms.findIndex((x) => x.roomName === roomId);
        if (index !== -1) {
            rooms[index].userJoinedInRoom.push(userId)
        } else {
            if (roomId) {
                rooms.push({
                    roomName: roomId,
                    userJoinedInRoom: []
                })
            }
        }
    },
    getRoom: (id) => {
        const entry = db.find((x) => x.id === id);
        if (entry && entry.room) {
            return entry.room;
        }
        return null;
    },
    createRoom: (roomId) => {
        rooms.push({
            roomName: roomId,
            userJoinedInRoom: []
        })
    },
    findUserInRoom: (roomId) => {
        const index = rooms.findIndex((x) => x.roomName === roomId)
        if (index !== -1) {
            return  rooms[index].userJoinedInRoom
        }
    }
};

