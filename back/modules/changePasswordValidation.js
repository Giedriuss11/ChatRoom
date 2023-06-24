const sendRes = require("../modules/sendRes");
const bcrypt = require("bcrypt");
const userDb = require("../schema/userAuthSchema")

module.exports = async (req, res, next) => {
    const { passwords, user } = req.body;


    const oldUser = await userDb.findOne({_id: user.userId})

    const samePassword = await bcrypt.compare(passwords.oldPassword, oldUser.password);
    if (!samePassword) {
        return sendRes(res, false, null, "Password is incorrect");
    }
    if (!/[!@#$%^&*_+]/.test(passwords.password)) {
        return sendRes(res, false, null, "Password should include at least one symbol");
    }
    if (!/[A-Z]/.test(passwords.password)) {
        return sendRes(res, false, null, "Password should include at least one uppercase character");
    }
    if (passwords.password.length > 20 || passwords.password.length < 4) {
        return sendRes(res, false, null, "Password must be between 4 and 20 characters");
    }

    if (passwords.password !== passwords.passwordTwo) {
        return sendRes(res, false, null, "Passwords do not match");
    }

    next();
};
