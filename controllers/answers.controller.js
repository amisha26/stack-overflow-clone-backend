const Answers = require('../models/Answers');
const Questions = require('../models/Questions');
const User = require('../models/User');
const { sendResponse, sendError } = require('../utils/response');


/**
 * Answers Controller
 * Handles creating, updating, deleting and retrieving an answer
 */

class AnswerController {
    static async createAnswer(req, res) {
        try {
            const { question_id } = req.params;
            const { description } = req.body;

            const userId = req.user.id;


            const question = await Questions.findOne({ _id: question_id });

            if (!question) {
                if (!question) {
                    return sendError(res, 404, 'Question not found with the provided ID');
                }
            }

            const newAnswer = await Answers.create({
                description,
                added_by: userId
            });

            question.answers.push(newAnswer._id);
            await question.save();

            return sendResponse(res, 201,
                true,
                'Answer added successfully',
                {
                    answer: {
                        _id: newAnswer._id,
                        description: newAnswer.description,
                        added_by: newAnswer.added_by
                    }
                }
            );

        } catch (error) {
            console.error('Answer cannot be posted');
            return sendError(res, 500, 'Answer cannot be posted', error.message);
        }
    }


    static async upvoteAnswer(req, res) {
        try {
            const { answerId } = req.params;

            const userId = req.user.id;

            // check if user can upvote
            const user = await User.findById(userId);
            console.log(user);
            if ( user.reputation <= 50 ) {
                return sendError(res, 403, true, 'User reputation too low to upvote');
            }
            
            const answer = await Answers.findById(answerId);

            if (!answer) {
                return sendError(res, 404, true, 'No answers exist with this id');
            }
            answer.votes += 1;
            await answer.save();

            const answerAuthor = await User.findById(answer.created_by);
            if ( user.reputation < 50 ) {
                return sendError(res, 403, true, 'Author does not exist for this answer');
            }
            answerAuthor.reputation += 5;
            await answerAuthor.save();

            return sendResponse(res, 201, true, 'Answer upvoted successfully');

        } catch (error) {
            console.log('Answer cannot be upvoted.');
            return sendError(res, 500, 'Answer cannot be upvoted.', error.message);
        }
    }

    static async downvoteAnswer(req, res) {
        try {
            const { answerId } = req.params;

            const userId = req.user.id;

            // check if user can downvote
            const user = await User.findById(userId);
            console.log(user);
            if ( user.reputation <= 50 ) {
                return sendError(res, 403, true, 'User reputation too low to downvote');
            }
            
            const answer = await Answers.findById(answerId);

            if (!answer) {
                return sendError(res, 404, true, 'No answers exist with this id');
            }
            answer.votes -= 1;
            await answer.save();

            const answerAuthor = await User.findById(answer.created_by);
            if ( user.reputation < 50 ) {
                return sendError(res, 403, true, 'Author does not exist for this answer');
            }
            answerAuthor.reputation -= 10;
            await answerAuthor.save();

            return sendResponse(res, 201, true, 'Answer downvoted successfully');

        } catch (error) {
            console.log('Answer cannot be downvoted.');
            return sendError(res, 500, 'Answer cannot be downvoted.', error.message);
        }
    }
}

module.exports = AnswerController;