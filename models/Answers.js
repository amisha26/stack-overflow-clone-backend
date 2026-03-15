// Model for Answers

const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    added_by: {
        type: String,
        ref: 'User',
        required: true
    },
    votes: {
        type: Number,
        min: 0
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
        }
    ]
},
{
    timestamps: true
});

module.exports = mongoose.model('Answers', answerSchema);