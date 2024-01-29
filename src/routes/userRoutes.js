const express = require("express");
const { signup, signin, verifyOTP, resendOtpVerificationCode, frogotPassword, updateFavoriteQuizzes } = require("../controller/userController");
const auth = require("../middleware/auth");
const userRoute = express.Router();

userRoute.post("/signup", signup);

userRoute.post("/signin", signin);

userRoute.post("/verifyOTP", verifyOTP);

userRoute.post("/resendOTP", resendOtpVerificationCode);

userRoute.post("/forgotPassword", frogotPassword);

userRoute.put("/updateFavoriteQuiz", auth, updateFavoriteQuizzes);

module.exports = userRoute;