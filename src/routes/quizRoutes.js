const express = require("express");
const { deleteQuiz, updateQuiz, createQuiz, getTopRatedQuizzes, upVote, getAllQuizzes, getQuizByCode, getQuizByCategories } = require("../controller/quizController");
const quizRoute = express.Router();
const auth = require("../middleware/auth");

quizRoute.get('/', auth, getAllQuizzes);

quizRoute.get('/:code', auth, getQuizByCode);

quizRoute.get('/quizzes', auth, getQuizByCategories);

quizRoute.post('/', auth, createQuiz);

quizRoute.delete('/:id', auth, deleteQuiz);

quizRoute.put('/:id', auth, updateQuiz);

quizRoute.get('/top', auth, getTopRatedQuizzes);

quizRoute.put('/upvote/:id', auth, upVote);

module.exports = quizRoute;