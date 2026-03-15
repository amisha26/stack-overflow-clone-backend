// Model for Questions table

const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        tags: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Tags',
                default: []
            }
        ],

        votes: {
            type: Number,
            default: 0
        },

        answers: [
            {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Answers',
            default: []
        },
    ],

    created_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }

    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Questions', questionSchema);