const express = require("express");
const { signup, signin, verifyOTP, resendOtpVerificationCode, frogotPassword, updateFavoriteQuizzes, updateAvatar, updateUserDetails } = require("../controller/userController");
const userRoute = express.Router();

userRoute.post("/signup", signup);

userRoute.post("/signin", signin);

userRoute.post("/verifyOTP", verifyOTP);

userRoute.post("/resendOTP", resendOtpVerificationCode);

userRoute.post("/forgotPassword", frogotPassword);

userRoute.put("/updateFavoriteQuiz", updateFavoriteQuizzes);

userRoute.put("/updateAvatar", updateAvatar)

userRoute.put("/updateDetails", updateUserDetails)

module.exports = userRoute;