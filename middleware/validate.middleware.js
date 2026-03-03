const { sendResponse, sendError } = require('../utils/response');

const validate = (schema) => (req, res, next) => {
    try {
      req.validatedData = schema.parse(req.body);
      return next();
    } catch (error) {
        console.error('Validation Failed');
        return sendError(res, 400, 'Validation Failed', error.issues[0]["message"]);
    }
  };
  
module.exports = validate;