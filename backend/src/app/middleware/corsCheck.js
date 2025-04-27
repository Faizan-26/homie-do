/**
 * CORS Check Middleware
 * Logs information about incoming requests to help debug CORS issues
 */
export const corsCheckMiddleware = (req, res, next) => {
    console.log('==== CORS DEBUG INFO ====');
    console.log('Request Origin:', req.headers.origin);
    console.log('Request Method:', req.method);
    console.log('Request Headers:');
    console.log('  Content-Type:', req.headers['content-type']);
    console.log('  Authorization:', req.headers.authorization ? 'Present' : 'Not present');
    console.log('  Accept:', req.headers.accept);
    console.log('========================');
    next();
};

export default corsCheckMiddleware; 