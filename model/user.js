const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
    },
    password:{
        type: String,
    },
    resetToken:{
        type: String
    }
})

module.exports = mongoose.model("UserLists",userSchema)