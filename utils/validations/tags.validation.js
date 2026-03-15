const { z } = require('zod');
const { textField } = require("./common");

const tagSchema = z.object({
  tag_name: textField,
  added_by: textField
});

module.exports = tagSchema;