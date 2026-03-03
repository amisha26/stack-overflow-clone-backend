// Send relevant responses

/**
 * Sends a standardized success JSON response.
 */
const sendResponse = (res, statusCode, success, message, data = null) => {
    return res.status(statusCode).json({
        success,
        message,
        data
    });
};


/*
* Sends a standardized error JSON response. 
*/
const sendError = (res, statusCode, message, errors = null) => {
    return res.status(statusCode).json({
        success: false,
        message,
        errors
    });
};


module.exports = { sendResponse, sendError };