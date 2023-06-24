const sendRes = require("../modules/sendRes")
const userDb = require("../schema/userAuthSchema")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const io = require("../sockets/main");

module.exports = {
    register: async (req, res) => {
        const {image, username, password} = req.body

        const userInSchema = await userDb.findOne({username})

        if (!userInSchema) {
            const hash = await bcrypt.hash(password,3)
            const user = new userDb ({
                image,
                username,
                password: hash,
            })

            await user.save()

            sendRes(res, true, null, null)
        } else {
            return sendRes(res, false, null, "User is all ready existing")
        }
    },
    login: async (req, res) => {
        const {username, password} = req.body

        const user = await userDb.findOne({username})
        if (!user) return sendRes(res, false, null, "This user does not exist")

        const samePassword = await bcrypt.compare(password, user.password)
        if (!samePassword) return sendRes(res, false, null, "Password is incorrect")

        user.password = ""

        const token = jwt.sign({userId: user._id}, process.env.ACCESS_SECRET)

        io.emit("newRegisterUser", user)

        sendRes(res, true, {user, token}, "You logged in successfully")
    },
    autologin: async (req, res) => {
        const {user} = req.body
        if (!user) return  sendRes(res, false, null, "no auth token")

        const newUser = await userDb.findOne({_id: user.userId})
        const allUsers = await userDb.find({ _id: { $ne: user.userId } });
        allUsers.forEach(user => {
            user.password = undefined;
        });
        sendRes(res, true, {user: newUser, allUsers},  null)
    }
}