const UserModel = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sendEmail = require("../utils/email");
const OtpModel = require("../models/otp");

const SECRET_KEY = process.env.SECRET_KEY;

// Register User
const signup = async (req, res) => {

    const { username, email, password, avatar } = req.body;

    try {
        const userExist = await UserModel.findOne({ email: email });
        if (userExist) {
            return res.status(400).json({ message: "User already exist" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await UserModel.create({
            username: username,
            email: email,
            password: hashedPassword,
            avatar: avatar,
            verified: false,
            exp: 0
        });

        const token = jwt.sign({ email: user.email, id: user._id }, SECRET_KEY);

        SendOTPVerificationMail({ _id: user._id, email: user.email, type: "VERIFICATION" }, res);

        res.status(200)
            .json({
                // status: "pending",
                //  message: "Email verification pending. Please check your email for the OTP.",
                user: user,
                token: token
            });
    } catch (error) {
        console.log(error);
        res.status(500)
            .json({ message: error.message });
    }
}

// Login
const signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const userExist = await UserModel.findOne({ email: email });
        if (!userExist) {
            return res.status(400).json({ message: "There is no user with this email please register first." });
        }

        const isPasswordMatched = await bcrypt.compare(password, userExist.password);
        if (!isPasswordMatched) {
            return res.status(400).json({ message: "Wrong password" });
        }

        const token = jwt.sign({ email: userExist.email, id: userExist._id }, SECRET_KEY);

        res.status(200).json({
            //  message: "User successfully signed in.",
            user: userExist,
            token: token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

// Send OTP verification mail
const SendOTPVerificationMail = async (option, res) => {
    try {
        // Generating OTP
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

        // Hashing OTP
        const hastedOTP = await bcrypt.hash(otp, 10);

        // New OTP Record
        const otpVerification = await OtpModel.create({
            userId: option._id,
            optCode: hastedOTP,
            type: option.type,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000
        });

        await otpVerification.save();

        let email_subject, email_message;
        if (option.type == "VERIFICATION") {
            email_subject = "Verify Email OTP";
            email_message = `<p>OTP: <b>${otp}</b></p> <p>Please enter this OTP on our app to verify your email address. Note that this OTP is valid for<b>1 hour</b></p> <p>If you did not request this verification, please disregard this email.</p>`;
        }
        else if (option.type == "FORGOT") {
            email_subject = "Forgot password OTP";
            email_message = `<p>Enter <b>${otp}</b> in the app to verify.</p>    <p>This OTP will expires in <b>1 hour</b></p>`;
        }

        await sendEmail({
            email: option.email,
            subject: email_subject,
            message: email_message
        });
    } catch (error) {
        console.log(error);
        res.json({
            message: error.message,
        });
    }
};

// Verify Otp
const verifyOTP = async (req, res) => {
    try {

        const { userId, otp, type } = req.body;
        const userOTPVerificationRecord = await OtpModel.find({ userId: userId, type: type });

        console.log(userOTPVerificationRecord);

        if (userOTPVerificationRecord.length <= 0) {
            res.json({ message: "Account does't exist or already verified." });
        } else {
            const { expiresAt } = userOTPVerificationRecord[0];
            const hastedOTP = userOTPVerificationRecord[0].optCode;

            if (expiresAt < Date.now()) {
                // user OTP has expired
                await OtpModel.deleteMany({ userId: userId, type: type });
                res.json({ message: "OTP has expired, Please request again." });
            }

            const validOTP = await bcrypt.compare(otp, hastedOTP);
            if (!validOTP) {
                res.json({ message: "Invalid OTP. Please enter the correct one." });
            } else {
                if (type == "VERIFICATION") {
                    await UserModel.updateOne({ _id: userId }, { verified: true });
                }
                await OtpModel.deleteMany({ userId: userId, type: type });
                res.json({ message: "OTP successfully verified." });
            }
        }
    } catch (error) {
        console.log(error);
        res.json({ message: error.message });
    }
}

// Resend OTP verification mail 
const resendOtpVerificationCode = async (req, res) => {
    try {
        const { userId, type } = req.body;
        const user = await UserModel.findOne({ userId: userId });

        await OtpModel.deleteMany({ userId });

        SendOTPVerificationMail({ _id: user._id, email: user.email, type: type }, res);
    } catch (error) {
        console.log(error);
        res.json({
            message: error.message,
        });
    }
}

// Frogot Password
const frogotPassword = async (req, res) => {

    const email = req.body.email;

    try {
        const user = await UserModel.findOne({ email: email });
        if (!user) {
            res.status(200).json({ message: "No user found with this email" });
        }
        console.log(user);
        SendOTPVerificationMail({ _id: user._id, email: user.email, type: "FORGOT" }, res);
        res.json({ message: "OTP sent successfully. Check your email for the One-Time Password." });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
}

const updateFavoriteQuizzes = async (req, res) => {

    const favoriteQuizIds = req.body;
    const userId = req.params.id;

    try {
        const userExist = await UserModel.findById(userId);
        if (userExist) {
            return res.status(400).json({ message: "User doesn't exist" });
        }

        userExist.favoriteQuizIds = favoriteQuizIds;
        await userExist.save();

        res.status(200).json({ message: 'Favorite quizzes updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error });
    }
}

module.exports = {
    signin,
    signup,
    verifyOTP,
    resendOtpVerificationCode,
    frogotPassword,
    updateFavoriteQuizzes
};