import User from '../mongoDB/models/userModel.js';
import { verifyAccessToken } from './verifyToken.js';

export const context = async ({ req, res }) => {

    const authHeader = req.headers.authorization || ''; 

    // check if there is a token in the request headers
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null

    // if there is no token, return response
    if (!token) return { res }

    try {
        // Verify the token
        const decoded = verifyAccessToken(token);

        // Fetch the user from the database (optional but useful)
        const user = await User.findById(decoded?.id);

        if (!user) return { res };
        
        // if the user is found, return the user object
        return { user, res };

    } catch (error) {
        // if the token is invalid, log the error and return an empty context object
        console.error('TOKEN_VERIFICATION_ERROR:', error.message);
        return {};
    }
}