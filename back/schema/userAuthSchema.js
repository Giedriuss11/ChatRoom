const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema ({
    username: {
        type: String,
        require:true
    },
    password: {
        type: String,
        require:true
    },
    image: {
        type: String,
        require: false,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgtRCZxJGNSbC62Q0YHool1uGPaNRQY_huow&usqp=CAU"
    },
})

const UserSchema = mongoose.model("endProjectSchema", userSchema)
module.exports = UserSchema