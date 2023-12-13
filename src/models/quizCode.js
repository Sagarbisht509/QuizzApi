const mongoose = require("mongoose");

const QuizCodeSchema = mongoose.Schema({
    currentQuizCode: {
        type: Number,
        default: 9999
    }
});

// Define a method to get the currentQuizCode and decrease it by 1
QuizCodeSchema.methods.getQuizCodeAndDecrease = async function () {
    // Get the current value
    const currentCode = this.currentQuizCode;

    // Decrease it by 1
    this.currentQuizCode = currentCode - 1;

    // Save the updated value to the database
    await this.save();

    // Return the original currentQuizCode
    return currentCode;
};

const QuizCodeModel = mongoose.model("QuizCode", QuizCodeSchema);

module.exports = QuizCodeModel