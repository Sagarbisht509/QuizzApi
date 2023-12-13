const nodemailer = require("nodemailer");

const sendEmail = async (option) => {
    
    // Create a Transporter 
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        auth: {
            user: "quizz509@gmail.com",
            pass: "eyqy veta imes hffc",
        }
    });

    // Define Email Option
    const emailOption = {
        from: "quizz509@gmail.com",
        to: option.email,
        subject: option.subject,
        html: option.message
    }

    await transporter.sendMail(emailOption);
}

module.exports = sendEmail;