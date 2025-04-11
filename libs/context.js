import cookie from 'cookie'
import User from '../db/models/userModel.js';
import { verifyToken } from './verifyToken.js';

export const context = async ({ req, res }) => {

    const cookies = cookie.parse(req.headers.cookie || '')

    // check if there is a token in the request headers
    const token = cookies["auth-token"]

    // if there is no token, return an empty context object
    if (!token) return {};

    try {
        // Verify the token
        const decoded = verifyToken(token);

        // Fetch the user from the database (optional but useful)
        const user = await User.findById(decoded?.id);

        if (!user) return {};
        
        // if the user is found, return the user object
        return { user, res };

    } catch (error) {
        // if the token is invalid, log the error and return an empty context object
        console.error('TOKEN_VERIFICATION_ERROR:', error.message);
        return {};
    }
}