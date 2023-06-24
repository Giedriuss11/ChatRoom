const sendRes = require("../modules/sendRes")
const userDb = require("../schema/userAuthSchema")
const bcrypt = require("bcrypt");
const io = require("../sockets/main")
const socketDb = require("../sockets/database");

module.exports = {
    changePicture: async (req, res) => {
        const {user, image} = req.body

        if (!user) return  sendRes(res, false, null, "no auth token")

        const changeUserP = await userDb.findOneAndUpdate(
            {_id: user.userId},
            {$set: {image}},
            {new: true}
        )
        changeUserP.password = ""

        const socket = socketDb.getSocket(user.userId)
        socket.broadcast.emit("allUser", changeUserP)

        sendRes(res, true, {user: changeUserP}, null)
    },
    changePassword: async (req, res) => {
        const {user, passwords} = req.body

        if (!user) return  sendRes(res, false, null, "no auth token")
        const hash = await bcrypt.hash(passwords.password,3)

        const changeUserP = await userDb.findOneAndUpdate(
            {_id: user.userId},
            {$set: {password: hash}},
            {new: true}
        )
        changeUserP.password = ""

        sendRes(res, true, {user: changeUserP} , null)
    },
    changeUsername: async (req, res) => {
        const {user, username} = req.body

        if (!user) return  sendRes(res, false, null, "no auth token")
        const userInSchema = await userDb.findOne({username})

        if (!userInSchema) {
            const changeUserP = await userDb.findOneAndUpdate(
                {_id: user.userId},
                {$set: {username}},
                {new: true}
            )

            changeUserP.password = ""

            const socket = socketDb.getSocket(user.userId)
            socket.broadcast.emit("allUser", changeUserP)
            sendRes(res, true, {user: changeUserP}, null)
        } else {
            sendRes(res, false, null, "User is all ready existing")
        }

    }
}