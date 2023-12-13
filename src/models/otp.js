const mongoose = require("mongoose");

const OtpSchema = mongoose.Schema({
    userId: String,
    optCode: String,
    type: String,
    createdAt: Date,
    expiresAt: Date
});

const OtpModel = mongoose.model("OTP", OtpSchema);

module.exports = OtpModel;