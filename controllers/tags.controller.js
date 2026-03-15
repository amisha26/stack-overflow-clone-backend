const Tags = require('../models/Tags');
const User = require('../models/User');
const { sendResponse, sendError } = require('../utils/response');

/**
 * Tags Controller
 * Handles updating, deleting and retrieving a tag
 */

class TagsController {

    static async getAllTags(req, res) {
        try {
            const tags = await Tags.find().populate('added_by', 'username');

            const formattedTags = tags.map(tag => ({
                _id: tag._id,
                tag_name: tag.tag_name,
                added_by: tag.added_by 
            }));
            return sendResponse(res, 201, true, 'List of all tags', formattedTags);
        }
        catch (error) {
            console.log('Tags cannot be retireved');
            return sendError(res, 500, 'Tags cannot be retrieved', error.message);
        }
    }
}

module.exports = TagsController;