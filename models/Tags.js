// Model for Tags

const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    tag_name: {
        type: String,
        required: true,
    },

    added_by: {
        type: String,
        ref: 'User',
        required: true
    },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Tags', tagSchema);