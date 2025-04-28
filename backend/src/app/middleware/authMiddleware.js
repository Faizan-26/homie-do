import jwt from 'jsonwebtoken';
import { findUserById } from '../services/userService.js';

/**
 * Middleware to authenticate JWT tokens
 * Extracts token from Authorization header and validates it
 */
export const authenticateJWT = async (req, res, next) => {
    try {
        // Get token from authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authorization token required' });
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Authorization token required' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if user still exists
        const user = await findUserById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: 'User no longer exists' });
        }

        // Add user info to request object
        req.user = {
            id: decoded.id,
            email: decoded.email
        };

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }

        res.status(500).json({ message: 'Authentication error', error: error.message });
    }
};

// /**
//  * Optional JWT authentication middleware
//  * Validates token if present, but doesn't require it
//  */
// export const optionalAuthJWT = async (req, res, next) => {
//     try {
//         const authHeader = req.headers.authorization;

//         if (!authHeader || !authHeader.startsWith('Bearer ')) {
//             req.user = null;
//             return next();
//         }

//         const token = authHeader.split(' ')[1];

//         if (!token) {
//             req.user = null;
//             return next();
//         }

//         // Verify token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         // Check if user still exists
//         const user = await findUserById(decoded.id);

//         if (user) {
//             req.user = {
//                 id: decoded.id,
//                 email: decoded.email
//             };
//         } else {
//             req.user = null;
//         }

//         next();
//     } catch (error) {
//         req.user = null;
//         next();
//     }
// }; 