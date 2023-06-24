const sendRes = require("../modules/sendRes")


module.exports = async (req, res, next) => {

    const {username, password, passwordTwo} = req.body

    if (username.length > 20 || username.length < 4)
        return sendRes(res, false, null, "Username must be between 4 and 20 characters ")
    if (!/[!@#$%^&*_+]/.test(password))
        return sendRes("Password should include at least one symbol ");
    if (!/[A-Z]/.test(password))
        return sendRes("Password should include at least one uppercase character ");
    if (password.length > 20 || password.length < 4)
        return sendRes(res, false, null, "Password must be between 4 and 20 characters")
    if (password !== passwordTwo)
        return sendRes(res, false,null, "Password should match")

    next()
}

