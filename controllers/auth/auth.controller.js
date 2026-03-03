const User = require('../../models/User');
const { sendResponse, sendError } = require('../../utils/response');
const redis = require('../../config/redis');
const { generateJwtToken, generateRefreshToken, setTokenCookie } = require('../../utils/auth');
require('dotenv').config();

/**
 * Authentication Controller
 * Handles user registration, login, and logout
 */

class AuthController {
    /**
     * Register a new user
     * POST /api/auth/register
    */

    static async register(req, res) {
        try {
            const { username, email, password } = req.body;

            // Check if user already exists
            const existingUser = await User.findOne({
                $or: [{ username }, { email }]
            });

            if (existingUser) {
                return sendError(res, 409, 'User already exists with this username or email');
            }

            const user = await User.create({
                username,
                email,
                password
            });

            return sendResponse(res, 201, 
                true,
                'Registration successful',
                {
                  user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                  },
                }
            );

        } catch (error) {
            console.error('Registration error');
            return sendError(res, 500, 'Registration error', error.message);
        }
    }

    /**
     * Login user
     * POST /api/auth/login
    */
    static async login(req, res) {
        try {
            const { username, password } = req.body;

            const baseKey = `login:v1:${username}`;
            const lockKey = `login:lock:${username}`;

            // check if the account is locked
            const isLocked = await redis.get(lockKey);
            if (isLocked) {
                const ttl = await redis.ttl(lockKey);
                return sendError(res, 429, `Account has been locked. Try again in ${ttl} seconds`);
            }

            // Check if user already exists
            const existingUser = await User.findOne(
                { username }
            );

            if (!existingUser) {
                return sendError(res, 401, 'User with this username does not exist. Please register if you havent.');
            }

            const isPasswordValid = await existingUser.comparePassword(password);

            if (!isPasswordValid) {
                const loginAttempt = await redis.incr(baseKey);

                if (loginAttempt == 1) {
                    await redis.expire(baseKey, process.env.LOGIN_WINDOW_IN_SECONDS);
                }

                if (loginAttempt > process.env.LOGIN_ATTEMPT_LIMIT) {
                    // start cooldown
                    await redis.set(lockKey, "1", "EX", process.env.LOGIN_WINDOW_IN_SECONDS);
                    const ttl = await redis.ttl(lockKey);
                    return sendError(res, 429, `Account has been locked. Try again in ${ttl} seconds.`); 
                }
                return sendError(res, 401, 'Password is invalid');
            }

            // Clear failed attempts so users start fresh next time
            await redis.del(baseKey);

            const accessToken = generateJwtToken(existingUser._id);
            const refreshToken = generateRefreshToken(existingUser._id);

            setTokenCookie(res, accessToken, refreshToken);

            return sendResponse(res, 201, 
                true,
                'login successful',
                {
                  user: {
                    id: existingUser._id,
                    username: existingUser.username,
                    email: existingUser.email,
                  },
                }
            );

        } catch (error) {
            console.error('Login error');
            return sendError(res, 500, 'Login error', error.message);
        }
    }


    static async refresh(req, res) {
        try {
            const refreshToken = req.ookies.refreshToken;

            if (!refreshToken) {
                return sendError(res, 401, 'No refresh token provided');
            }

            // verify refresh token
            const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

            // check if user still exists
            const user = await User.findById(payload.id);

            const accessToken = generateJwtToken(user._id);

            setTokenCookie(res, accessToken, refreshToken);

            return sendResponse(res, 201, 
                true,
                'Access token refreshed.',
            );

        } catch (error) {
            console.error('Refresh token error', error);
            return sendError(res, 401, 'Invalid or expired refresh token');
        }
    }


    static async logout(req, res) {
        try {
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            return sendResponse(res, 201, 
                true,
                'User logged out',
            );

        } catch (error) {
            console.error('Unsuccessful logout', error);
            return sendError(res, 401, 'Invalid or expired refresh token');
        }
    }

    
}

module.exports = AuthController;