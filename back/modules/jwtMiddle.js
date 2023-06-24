const jwt = require("jsonwebtoken")
const sendRes = require("../modules/sendRes")

module.exports = (req, res, next) => {

    const token = req.headers['authorization']


    if (!token) return sendRes(res, false, null, "no auth token")

    jwt.verify(token, process.env.ACCESS_SECRET, (err, user) => {
        if (err) return sendRes(res, false, null , "auth error")
        req.body.user = user
        return next()
    })
}