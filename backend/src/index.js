import express, { json } from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './database/mongo.config.js';
import routes from './app/routes/index.js';

// Load environment variables
config();

var corsOptions = {
    origin: process.env.CLIENT_URL || 'http://localhost:5173/',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

const app = express();
const PORT = process.env.PORT || 5500;

// Middleware
app.use(json()); // this is used to parse the json data from the request
app.use(cookieParser()); // this is used to parse the cookie from the request
app.use(cors(corsOptions));

// Routes
app.use('/api', routes);


app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
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



