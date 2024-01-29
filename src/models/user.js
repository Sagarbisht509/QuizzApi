const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    },
    favoriteQuizIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz"
    }],
    verified: Boolean,
    exp: Number,
}, { timestamps: true });

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;