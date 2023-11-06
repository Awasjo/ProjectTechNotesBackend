const mongoose = require('mongoose')

//refer to the userStories.md for waht needs to be in the user data model
//we can have on boolean data for a user so that an admin can set active or not active
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roles: {
        type: [String],
        default: ["Employee"]
    },
    active: {
        type: Boolean,
        default: true
    }

})

module.exports = mongoose.model('User', userSchema)