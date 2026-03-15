const jwt = require('jsonwebtoken');
require('dotenv').config();
const { sendResponse, sendError } = require('../utils/response');

const authenticate = (req, res, next) => {

    const token = req.cookies.accessToken;

    if (!token) {
        return sendError(res, 401, 'Unauthorized');
    }
    try {
        const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.user = { id: payload.id };
        next();
      } catch (err) {
        console.log(err)
        return sendError(res, 401, 'Access token expired or invalid');
      }
}

module.exports = authenticate;