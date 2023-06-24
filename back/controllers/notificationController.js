const sendRes = require("../modules/sendRes")
const notificationDb = require("../schema/notificationShema")
const messageDb = require("../schema/messageSchema")

module.exports = {
    notifications: async (req, res) => {
        const { user } = req.body;
        const noti = await notificationDb.find({id: user.userId})
        sendRes(res, true, {noti}, null);
    },
    joinInChat: async (req, res) => {
        const { inv, user } = req.body;

        const addToGroup = await messageDb.findOneAndUpdate(
            { _id: inv },
            { $addToSet: { sender: user.userId } }, // Use $addToSet instead of $push
            { new: true }
        );

        sendRes(res, true, addToGroup, null);
    },
    deleteNoti: async (req, res) => {
        const {id, user} = req.body
        await notificationDb.findByIdAndDelete({_id: id})
        const noti = await notificationDb.find({id: user.userId})
        sendRes(res, true, {noti}, null);
    }
}