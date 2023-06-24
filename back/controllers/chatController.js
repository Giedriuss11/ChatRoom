const sendRes = require("../modules/sendRes")
const userDb = require("../schema/userAuthSchema")
const messageDb = require("../schema/messageSchema")
const notificationDb = require("../schema/notificationShema")
const uuid = require("uuid")
const io = require("../sockets/main")
const socketDb = require("../sockets/database")

const updatingArrays = (name) => {
    if (name.sender.length === 0 ) {
        const socketsArrayId = [name.id, name.senderId]
        const socketsId = socketDb.getOtherSocketsAllIds(socketsArrayId);
        for (const id of socketsId) {
            io.to(id).emit("messageUpdated", name);
        }
    } else {
        const senderIds = name.sender.map(id => id);
        const allIds = socketDb.getOtherSocketsAllIds([name.id,name.senderId , ...senderIds]);
        for (const id of allIds) {
            io.to(id).emit("messageUpdated", name);
        }
    }
}


module.exports = {
    groupChats: async (req, res) => {
        const { id, user } = req.body;
        const oldUser = await userDb.findOne({ _id: user.userId });
        const userMessage = await messageDb.findOne({_id: id});
        const socket = socketDb.getSocket(String(user.userId));
        if (socket) {
            const oldRoom = socketDb.getRoom(String(user.userId))
            if (oldRoom) {
                socket.leave(oldRoom)
            }
            socket.join(id)
            socketDb.joinRoom(String(user.userId), id)
            if (userMessage) {
                await socketDb.socketJoinedInRoom(String(userMessage._id),String(user.userId))
            }
        }

        sendRes(res, true, { oldUser, userMessage: userMessage || null, id: user.userId }, null);
    },
    personalChat: async (req, res) => {
        const { id, user } = req.body;

        const oldUser = await userDb.findOne({ _id: id });

        const userMessage = await messageDb.findOne({
            $or: [
                { $and: [{ id: id }, { senderId: user.userId }, { sender: { $size: 0 } }] },
                { $and: [{ senderId: id }, { id: user.userId }, { sender: { $size: 0 } }] },
            ],
        });

        const socket = socketDb.getSocket(String(user.userId));

        if (socket) {
            const oldRoom = socketDb.getRoom(String(user.userId));
            if (oldRoom) {
                socket.leave(oldRoom);
            }
            socket.join(user.userId);
            socketDb.joinRoom(String(user.userId), id);
            if (userMessage) {
                await socketDb.socketJoinedInRoom(String(userMessage._id),String(user.userId))
            }
        }

        sendRes(res, true, { oldUser, userMessage: userMessage || null, id: user.userId }, null);
    },
    personaMessage: async (req, res) => {
        const { user, newMessage } = req.body;

        const sender = await userDb.findOne({ _id: user.userId });
        const ToWhoSend = await userDb.findOne({ _id: newMessage.id });
        const oldMessage = await messageDb.findOne({
            $and: [{ id: newMessage.id }, { senderId: user.userId }, { sender: { $size: 0 } }],
        });
        const sameMessage = await messageDb.findOne({
            $and: [{ senderId: newMessage.id }, { id: user.userId }, { sender: { $size: 0 } }],
        });
        const userMessage = {
            message: newMessage.message,
            sender: sender.username,
            senderImage: newMessage.image,
            like: [],
            messageId: uuid.v1(),
        };

        let updatedChat;
        if (!oldMessage && !sameMessage) {
            const newChat = await new messageDb({
                usernameWhoSent: sender.username,
                usernameWhoReceive: ToWhoSend.username,
                id: newMessage.id,
                senderId: user.userId,
                imagePerson: ToWhoSend.image,
                imageWhoSend: sender.image,
                message: [userMessage], // Create a new array with the initial message
            }).save();

            await socketDb.createRoom(newChat._id)

            const notification = await new notificationDb({
                image: sender.image,
                id: newMessage.id,
                message: newMessage.message,
                invitationId: newChat._id
            }).save();

            const socket = socketDb.getOtherSocket(newMessage.id)
            io.to(socket).emit("personalNewMessage", newChat);

            const socketId = socketDb.getOtherSocket(newMessage.id)
            io.to(socketId).emit("notifications", notification);
            sendRes(res, true, newChat, null);
        } else {
            const query = {
                $or: [
                    { $and: [{ id: newMessage.id }, { senderId: user.userId }, { sender: { $size: 0 } }] },
                    { $and: [{ senderId: newMessage.id }, { id: user.userId }, { sender: { $size: 0 } }] },
                ]};
            updatedChat = await messageDb.findOneAndUpdate(query, { $push: { message: userMessage } }, { new: true });

            const userArrayIndex = [updatedChat.id, updatedChat.senderId]
            const filterUser = userArrayIndex.filter(x => x !== user.userId)
            const usersInRoom = socketDb.findUserInRoom(String(updatedChat._id))
            if (usersInRoom) {
                const filterUserMy = usersInRoom.filter(x => x !== user.userId)

                let userSendNoti = []
                for (const id in filterUser) {
                    if (!filterUserMy.includes(filterUser[id])) {
                        userSendNoti.push(filterUser[id]);
                    }
                }

                if (filterUserMy.length === 0) {
                    for (const id of userSendNoti) {
                        const notification = await new notificationDb({
                            image: sender.image,
                            id,
                            message: newMessage.message,
                            invitationId: updatedChat._id
                        }).save();
                        const socketId = socketDb.getOtherSocket(id)
                       io.to(socketId).emit("notifications", notification);
                    }
                }
            }


            updatingArrays(updatedChat)

            sendRes(res, true, updatedChat, null);
        }
    },
    groupChatMessage: async (req, res) => {
        const { user, newMessage } = req.body;

        const sender = await userDb.findOne({ _id: user.userId });
        const userMessage = {
            message: newMessage.message,
            sender: sender.username,
            senderImage: newMessage.image,
            like: [],
            messageId: uuid.v1(),
        };

        const updateGroupChat = await messageDb.findOneAndUpdate(
            {_id: newMessage.messageId},
            {$push: {message: userMessage}},
            {new: true});



        const socket = socketDb.getSocket(String(user.userId));
        if (socket) {
            const oldRoom = socketDb.getRoom(String(user.userId))
            socket.to(oldRoom).emit("messageInGroup", updateGroupChat);

            const userArrayIndex = [updateGroupChat.id, updateGroupChat.senderId,... updateGroupChat.sender];
            const filterUser = userArrayIndex.filter(x => x !== user.userId)

            const usersInRoom = socketDb.findUserInRoom(String(updateGroupChat._id))
            const filterUserMy = usersInRoom.filter(x => x !== user.userId)

            let userSendNoti = []

            for (const id in filterUser) {
                if (!filterUserMy.includes(filterUser[id])) {
                    userSendNoti.push(filterUser[id]);
                }
            }

            if (filterUserMy.length === 0) {
                for (const id of userSendNoti){
                    const notification = await new notificationDb({
                        image: sender.image,
                        id,
                        message: newMessage.message,
                        invitationId: updateGroupChat._id,
                    }).save();
                    const socketId = socketDb.getOtherSocket(id)
                    io.to(socketId).emit("notifications", notification);
                }
            }
        }
        updatingArrays(updateGroupChat)
        sendRes(res, true, updateGroupChat, null);

    },
    myChat: async (req, res) => {
        const {user} = req.body
        const oldUser = await messageDb.find({
            $or: [
                { id: user.userId },
                { senderId: user.userId },
                { sender: { $in: [user.userId] } },
            ]
        });
        sendRes(res, true, {oldUser},null)
    },
    deleteMessage: async (req, res) => {
        const { id, chatId} = req.body;

        const conDelete = await messageDb.findByIdAndUpdate(
            chatId,
            { $pull: { message: { messageId: id } } },
            {new: true}
        );

        updatingArrays(conDelete)
        sendRes(res, true, conDelete, null);
    },
    likeMessage: async (req, res) => {
        const { like, user } = req.body;

        const userWhoLike = await userDb.findOne({_id:user.userId})
        const message = await messageDb.findOne({_id: like.postId})

        const messageAtIndex = message.message[like.index]
        const index = messageAtIndex.like.indexOf(userWhoLike.username)

        if (index === -1) {
            messageAtIndex.like.push(userWhoLike.username)
        } else {
            messageAtIndex.like.splice(index, 1);
        }

        const filter = { _id: like.postId };
        const update = { $set: { [`message.${like.index}.like`]: messageAtIndex.like } };

        if (like.username !== message.message[like.index].sender) {
            const likeMes = await messageDb.findOneAndUpdate(filter, update, { new:true})
            if (!likeMes) return sendRes(res, false, null, "Your like false")

            updatingArrays(likeMes)

            sendRes(res, true, likeMes, null)
        }
    },
    personalInvitation: async (req, res) => {
        const {inv, user} = req.body

        const userWhoInv = await userDb.findOne({username: inv.userInv})
        if (!userWhoInv) return sendRes(res, false, null, "User Not Found")
        const notification = await new notificationDb({
            image: inv.image,
            id: userWhoInv._id,
            idToLogin: user.userId,
            message: "Pakvietimas komandiniu pokalbiu",
            invitation: Math.ceil(2000 + Math.random() * 4821),
            invitationId: inv.invitation
        }).save()

        const socketId = socketDb.getOtherSocket(String(userWhoInv._id))
        if (socketId) {
            io.to(socketId).emit("notifications", notification)
        }

        sendRes(res, true, userWhoInv, null)
    }

}