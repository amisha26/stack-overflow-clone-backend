const { z } = require('zod');
const { textField } = require('./common');

const questionSchema = z.object({

  title: textField.max(150),

  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(5000),

  tags: z
    .array(textField)
    .min(1, "At least one tag is required"),

  votes: z
    .number()
    .min(0)
    .optional()
});

module.exports = questionSchema;