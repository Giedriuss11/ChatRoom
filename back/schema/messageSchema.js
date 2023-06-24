const mongoose = require("mongoose")
const Schema = mongoose.Schema

const messageSchema = new Schema ({
    usernameWhoSent: {
        type: String,
        require:true
    },
    usernameWhoReceive: {
        type: String,
        require:true
    },
    id: {
        type: String,
        require: true
    },
    senderId: {
        type: String,
        require: true
    },
    sender: {
        type: Array,
        require: false,
        default: []
    },
    imagePerson: {
        type: String,
        require: true
    },
    imageWhoSend: {
        type: String,
        require: true
    },
    message: {
        type: Array,
        require: false,
        default: []
    }
})

const UserSchema = mongoose.model("endProjectMessage", messageSchema)
module.exports = UserSchema