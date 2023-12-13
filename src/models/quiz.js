const mongoose = require("mongoose");

const QuizSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    questions: [{
        question: String,
        option1: String,
        option2: String,
        option3: String,
        option4: String,
        correctAnswer: String
    }],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    author: {
        type: String,
        required: true
    },
    voteCount: {
        type: Number,
        default: 0
    },
    upVotedBy: [String],
    quizCode: Number
}, { timestamps: true });

const QuizModel = mongoose.model("Quiz", QuizSchema);

module.exports = QuizModel;