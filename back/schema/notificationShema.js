const mongoose = require("mongoose")
const Schema = mongoose.Schema

const notificationSchema = new Schema ({
    image: {
        type: String,
        require: true
    },
    id: {
        type: String,
        require: true
    },
    idToLogin: {
        type: String,
        require: true
    },
    message: {
        type: String,
        require: true
    },
    invitation: {
        type: String,
        require: false
    },
    invitationId: {
        type: String,
        require: false
    }
})

const UserSchema = mongoose.model("endProjectNotification", notificationSchema)
module.exports = UserSchema