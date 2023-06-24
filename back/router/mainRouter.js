const express = require("express")
const router = express.Router()

const {register, login, autologin} = require("../controllers/authController")
const {changePicture, changePassword, changeUsername} = require("../controllers/changeController")
const {groupChats,personalChat,
    personaMessage,groupChatMessage,
    myChat, deleteMessage,
    likeMessage,personalInvitation
} = require("../controllers/chatController")
const {notifications, joinInChat, deleteNoti} = require("../controllers/notificationController")

const validationRegister = require("../modules/registerValidation")
const validationLogin = require("../modules/loginValidation")
const jwtMiddle = require("../modules/jwtMiddle")
const validationPassMatch = require("../modules/changePasswordValidation")

router.post("/register", validationRegister, register)
router.post("/login", validationLogin, login)
router.post("/autologin", jwtMiddle, autologin)

router.post("/changePicture", jwtMiddle, changePicture)
router.post("/changePassword", jwtMiddle, validationPassMatch, changePassword)
router.post("/changeUsername", jwtMiddle, changeUsername)

router.post("/groupChats",jwtMiddle, groupChats)
router.post("/personalChat",jwtMiddle, personalChat)

router.post("/personaMessage",jwtMiddle, personaMessage)
router.post("/groupChatMessage",jwtMiddle, groupChatMessage)

router.post("/findAllMyChats",jwtMiddle, myChat)
router.post("/deleteMessage",jwtMiddle, deleteMessage)
router.post("/likeMessage",jwtMiddle, likeMessage)
router.post("/invitation",jwtMiddle, personalInvitation)

router.post("/notifications",jwtMiddle, notifications)
router.post("/joinInChat",jwtMiddle, joinInChat)
router.post("/deleteNoti", jwtMiddle, deleteNoti)

module.exports = router