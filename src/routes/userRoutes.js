const express = require("express");
const { signup, signin, verifyOTP, resendOtpVerificationCode, frogotPassword } = require("../controller/userController");
const userRoute = express.Router();

userRoute.post("/signup", signup);

userRoute.post("/signin", signin);

userRoute.post("/verifyOTP", verifyOTP);

userRoute.post("/resendOTP", resendOtpVerificationCode);

userRoute.post("/forgotPassword", frogotPassword);

module.exports = userRoute;