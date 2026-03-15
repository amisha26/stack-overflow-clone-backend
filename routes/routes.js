const express = require('express');
const { registerSchema, loginSchema, forgotPasswordSchema } = require('../utils/validations/auth.validation');
const questionSchema = require('../utils/validations/question.validation');
const answerSchema = require('../utils/validations/answer.validation');
const AnswerController = require('../controllers/answers.controller');
const AuthController = require('../controllers/auth/auth.controller');
const QuestionController = require('../controllers/question.controller');
const TagsController = require('../controllers/tags.controller');
const validate = require('../middleware/validate.middleware');
const globalRateLimiter = require('../middleware/rateLimiter.middleware');
const authenticate = require('../middleware/auth.middleware');


const router = express.Router();

// Auth Routes
router.post('/auth/register', globalRateLimiter(100, 3600), validate(registerSchema), AuthController.register);
router.post('/auth/login', globalRateLimiter(200, 3600), validate(loginSchema), AuthController.login);
router.post('/auth/refresh', AuthController.refresh);
router.post('/auth/logout', globalRateLimiter(100, 3600), authenticate, AuthController.logout);


// Question Routes
router.post('/question', globalRateLimiter(10000, 3600), validate(questionSchema), authenticate, QuestionController.createQuestion);
router.get('/all-questions', globalRateLimiter(10000, 3600), QuestionController.getAllQuestions);
router.get('/questions/:tag_id', globalRateLimiter(100000, 3600), QuestionController.getQuestionsBasedOnTag);
router.get('/questions', globalRateLimiter(100000, 3600), QuestionController.getQuestionBasedOnFilter);
router.post('/upvote-question/:questionId', globalRateLimiter(100000, 3600), authenticate, QuestionController.upvoteQuestion);
router.post('/downvote-question/:questionId', globalRateLimiter(100000, 3600), authenticate, QuestionController.downvoteQuestion);


// Tag Routes
router.get('/all-tags', globalRateLimiter(100000, 3600), authenticate, TagsController.getAllTags);


// Answer Routes
router.post('/answer/:question_id', globalRateLimiter(100000, 3600), validate(answerSchema), authenticate, AnswerController.createAnswer);


module.exports = router;