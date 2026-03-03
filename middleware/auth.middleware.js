const jwt = require('jsonwebtoken');
require('dotenv').config();

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
        return sendError(res, 401, 'Access token expired or invalid');
      }
}

module.exports = authenticate;