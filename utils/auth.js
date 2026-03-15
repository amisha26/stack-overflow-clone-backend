const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateJwtToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: process.env.JWT_EXPIRE },
    );
};

const generateRefreshToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRE },
    );
}

const setTokenCookie = (res, accessToken, refreshToken) => {
    const cookieOptions = {
        httpOnly: true,
        sameSite: 'strict',
        secure: false,
    };
    
    // Access Token: expires in 15 mins
    res.cookie(
        'accessToken', 
        accessToken, 
        {
            ...cookieOptions,
            maxAge: parseInt(process.env.JWT_COOKIE_EXPIRES) * 60 * 1000,
            path: '/'
        }
    );

    // Refresh Token: expires in 7 days
    res.cookie(
        'refreshToken', 
        refreshToken, 
        {
            ...cookieOptions,
            maxAge: parseInt(process.env.JWT_REFRESH_COOKIE_EXPIRE) * 24 * 60 * 60 * 1000,
            path: '/api/auth/refresh'
        }
    );
}

module.exports = { generateJwtToken, generateRefreshToken, setTokenCookie };