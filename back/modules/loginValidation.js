const sendRes = require("../modules/sendRes")


module.exports = async (req, res, next) => {

    const {username, password} = req.body

    if (username.length > 20 || username.length < 4)
        return sendRes(res, false, null, "Username must be between 4 and 20 characters ")
    if (password.length > 20 || password.length < 4)
        return sendRes(res, false, null, "Password must be between 4 and 20 characters")

    next()
}
