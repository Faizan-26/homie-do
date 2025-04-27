import express, { json } from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './database/mongo.config.js';
import routes from './app/routes/index.js';
import corsCheckMiddleware from './app/middleware/corsCheck.js';

// Load environment variables
config();

var corsOptions = {
    origin: process.env.CLIENT_URL || 'http://localhost:5173/',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.use(corsCheckMiddleware);

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    console.log('Request Body:', req.body);
    console.log('Request Headers:', req.headers);

    const originalSend = res.send;
    res.send = function (body) {
        console.log('Response Status:', res.statusCode);
        console.log('Response Body:', body);
        return originalSend.call(this, body);
    };

    next();
});

// Routes
app.use('/api', routes);

app.get('/health', (req, res) => {
    console.log('Health check', req.headers);
    res.status(200).json({ status: 'ok', message: 'Server is running' });
});

app.get('/ff', (req, res) => {
    console.log('Health check', req.headers);
    res.status(200).json({ status: 'ok', message: 'Server is running' });
});

app.use((err, req, res, next) => {
    console.error(`${new Date().toISOString()} - ERROR:`, err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Server error'
    });
});



connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

}).catch(err => {
    console.error('Database connection failed:', err);
    process.exit(1);
});

