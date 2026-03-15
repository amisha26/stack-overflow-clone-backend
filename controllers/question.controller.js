const Questions = require('../models/Questions');
const Tags = require('../models/Tags');
const User = require('../models/User');
const { sendResponse, sendError } = require('../utils/response');

/**
 * Questions Controller
 * Handles creating, updating, deleting and retrieving a question
 */

class QuestionController {

    static async createQuestion(req, res) {
        try {
            const { title, description, tags } = req.body;

            const userId = req.user.id;

            let tagIds = [];

            for (const tag of tags) {
                const existingTag = await Tags.findOne({ tag_name: tag });

                if (!existingTag) {
                    const user = User.findById(userId);
                    if (user.reputation < 50) {
                        return sendError(res, 403, 'User reputation is too low to create a new tag.');
                    }
                    const newTag = await Tags.create({
                        tag_name: tag,
                        added_by: userId
                    });
                    tagIds.push(newTag._id);
                }
                else {
                    tagIds.push(existingTag._id);         
                }
            }

            const question = await Questions.create({
                title,
                description,
                tags: tagIds,
                created_by: userId
            })

            return sendResponse(res, 201, 
                true,
                'Question created successfully',
                {
                  question: {
                    _id: question._id,
                    title: question.title,
                    description: question.description,
                    tags: question.tags,
                  },
                }
            );

        } catch (error) {
            console.error('Question cannot be posted');
            return sendError(res, 500, 'Question cannot be posted', error.message);
        }
    }


    static async getAllQuestions(req, res) {
        try {
            const questions = await Questions.find()
            .sort({ updatedAt: -1 })
            .populate('tags', 'tag_name')
            .populate('created_by', 'username')
            .populate('answers', 'description'); 

            if (!questions) {
                sendError(res, 404, 'Questions dont exist in the db');
            }

            return sendResponse(res, 201, true, 'List of all questions', questions);

        } catch (error) {
            console.error('Cannot fetch all questions');
            return sendError(res, 500, 'Cannot fetch all questions', error.message);
        }
    }


    static async getQuestionsBasedOnTag(req, res) {
        try {
            const { tag_id } = req.params;
            
            const question = await Questions.find({ tags: tag_id })
            .populate('tags', 'tag_name')
            .populate('created_by', 'username')
            .populate('answers', 'description')
            .sort({ updatedAt: -1 });

            if (!question) {
                sendError(res, 404, true, 'No questions exist for this tag');
            }

            return sendResponse(res, 201, true, 'List of questions for the tag', question);

        } catch (error) {
            console.log('Questions for this tag cannot be retrieved');
            return sendError(res, 500, 'Questions for this tag cannot be retrieved', error.message);
        }
    }

    static async getQuestionBasedOnFilter(req, res) {
        try {
            const { filter } = req.query;

            if (filter == "newest") {
                const questions = await Questions.find()
                .sort({ updatedAt: -1 })
                .populate('tags', 'tag_name')
                .populate('created_by', 'username')
                .populate('answers', 'description');

                if (!questions) {
                    sendError(res, 404, 'Questions dont exist in the db');
                }

                return sendResponse(res, 201, true, 'List of all questions sorted on the basis of newest.', questions);
            }

            else if (filter == "unanswered") {
                const questions = await Questions.find({ $or: [
                    { answers: { $size: 0 } }, 
                    { answers: { $exists: false } }
                ] })
                .populate('tags', 'tag_name')
                .populate('created_by', 'username')
                .populate('answers', 'description');

                if (questions.length === 0) {
                    sendError(res, 404, 'Unanswered questions dont exist in the db');
                }

                return sendResponse(res, 201, true, 'List of all unanswered questions.', questions);

            }

        } catch (error) {
            console.log('Questions cannot be retrieved for this filter');
            return sendError(res, 500, 'Questions cannot be retrieved for this filter', error.message);
        }
    }


    static async upvoteQuestion(req, res) {
        try {
            const { questionId } = req.params;

            const userId = req.user.id;

            // check if user can upvote
            const user = await User.findById(userId);
            console.log(user);
            if ( user.reputation <= 50 ) {
                return sendError(res, 403, true, 'User reputation too low to upvote');
            }
            
            const question = await Questions.findById(questionId);

            if (!question) {
                return sendError(res, 404, true, 'No questions exist with this id');
            }
            question.votes += 1;
            await question.save();

            const questionAuthor = await User.findById(question.created_by);
            if ( user.reputation < 50 ) {
                return sendError(res, 403, true, 'Author does not exist for this question');
            }
            questionAuthor.reputation += 5;
            await questionAuthor.save();

            return sendResponse(res, 201, true, 'Question upvoted successfully');

        } catch (error) {
            console.log('Questions cannot be upvoted.');
            return sendError(res, 500, 'Questions cannot be upvoted.', error.message);
        }
    }

    static async downvoteQuestion(req, res) {
        try {
            const { questionId } = req.params;

            const userId = req.user.id;

            // check if user can downvote
            const user = await User.findById(userId);
            if ( user.reputation <= 50 ) {
                sendError(res, 403, true, 'User reputation too low to downvote');
            }
            
            const question = await Questions.findById(questionId);

            if (!question) {
                sendError(res, 404, true, 'No questions exist with this id');
            }
            question.votes -= 1;
            await question.save();

            const questionAuthor = await User.findById(question.created_by);
            if ( user.reputation <= 50 ) {
                sendError(res, 403, true, 'Author does not exist for this question');
            }
            questionAuthor.reputation -= 10;
            await questionAuthor.save();

            return sendResponse(res, 201, true, 'Question downvoted successfully');

        } catch (error) {
            console.log('Questions cannot be downvoted.');
            return sendError(res, 500, 'Questions cannot be downvoted.', error.message);
        }
    }
}

module.exports = QuestionController;