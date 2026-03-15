const { z } = require('zod');
const { textField } = require('./common');

const answerSchema = z.object({
    description: textField
});

module.exports = answerSchema;