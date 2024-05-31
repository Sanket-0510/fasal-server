const User = require("../models/User");

async function checkUser(email) {
    try {
         let user = await User.findOne({ email: email });
         return user;
    } catch (err) {
        console.log(err);
        return false;
    }
}

module.exports = { checkUser };