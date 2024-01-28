const quizModel = require("../models/quiz")
const quizCodeModel = require("../models/quizCode");

const createQuiz = async (req, res) => {

    const { author, title, category, questions } = req.body;
    const quizCodeInstance = await quizCodeModel.findOne();

    let currentCode;
    if (quizCodeInstance) {
        currentCode = await quizCodeInstance.getQuizCodeAndDecrease();
    } else {
        // Creating First Quiz Code
        const firstQuizCode = new quizCodeModel({
            currentQuizCode: 9999
        });

        currentCode = 9999;

        try {
            await firstQuizCode.save();
        } catch (error) {
            console.log(error);
            res.status(500).json({message: "Something went wrong" });
        }
    }

    const newQuiz = new quizModel({
        title: title,
        category: category,
        questions: questions,
        userId: req.userId,
        author: author,
        quizCode: currentCode,
    });

    try {
        await newQuiz.save();
        res.status(201).json(newQuiz);
    } catch (error) {
        console.log(error);
        res.status(400).json({message: "Invalid request. Please check your parameters and try again." });
    }
}

const getAllQuizzes = async (req, res) => {
    try {
        //const quizzes = await quizModel.find({ userId: req.userId });
        const quizzes = await quizModel.find();
        res.status(200).json(quizzes);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Something went wrong"});
    }
}

const updateQuiz = async (req, res) => {

    const quizId = req.params.id;

    const { title, category, questions } = req.body;

    const newQuiz = {
        title: title,
        category: category,
        questions: questions,
        userId: req.userId
    }

    try {
        await quizModel.findByIdAndUpdate(quizId, newQuiz, { new: true });
        res.status(200).json(newQuiz);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}

const deleteQuiz = async (req, res) => {
    const quizId = req.params.id;
    try {
        const deletedQuiz = await quizModel.findOneAndDelete({ _id: quizId });
        res.status(202).json(deletedQuiz);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}

const upVote = async (req, res) => {

    const quizId = req.params.id;
    const voterId = req.userId;

    const alreadyVoted = await quizModel.findOne({ upVotedBy: voterId });
    if (alreadyVoted) {
        return res.status(400).json({ message: "already voted" });
    }

    try {
        await quizModel.updateOne({ _id: quizId }, { $inc: { voteCount: 1 } });
        await quizModel.updateOne({ _id: quizId }, { $push: { upVotedBy: voterId } });
        res.status(200).json({ message: "Upvoted successful" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}

const getTopRatedQuizzes = async (req, res) => {
    try {
        const topQuizzes = await quizModel.find().sort({ voteCount: -1 }).limit(5);
        res.status(200).json(topQuizzes);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}

const getQuizByCode = async (req, res) => {

    const quizCode = req.params.code;

    try {
        const quiz = await quizModel.findOne({ quizCode: quizCode });

        if (!quiz) {
            res.json({ status: "Invalid", message: "Invalid Quiz Code" });
        } else {
            res.json(quiz);
        }
    } catch (error) {
        console.log(error);
        res.json({ message: error.message });
    }
}

const getQuizByCategories = async (req, res) => {

    console.log(req.query.categories);

    try {
        const selectedCategories = req.query.categories;

        // Check if categories are provided in the request
        if (!selectedCategories || !Array.isArray(selectedCategories) || selectedCategories.length === 0) {
            return res.status(400).json({ message: 'Please provide one or more categories in the query parameters.' });
        }

        // Split the categories string into an array
        const categoriesArray = selectedCategories.split(',');

        // Query the database for quizzes with the specified categories
        const quizzes = await quizModel.find({ category: { $in: categoriesArray } });

        if (quizzes.length > 0) {
            res.status(200).json(quizzes);
        } else {
            res.status(404).json({ message: 'No quizzes found for the specified categories.' });
        }
    } catch (error) {
        console.error('Error getting quizzes by categories:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    createQuiz,
    updateQuiz,
    deleteQuiz,
    getAllQuizzes,
    getTopRatedQuizzes,
    upVote,
    getQuizByCode,
    getQuizByCategories
}