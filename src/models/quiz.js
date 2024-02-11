const mongoose = require("mongoose");

//Schema For the Question
const QuestionSchema = mongoose.Schema({
    question: String,
    options: [String],
    answer: String
});

const QuizSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    questions: [QuestionSchema],
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