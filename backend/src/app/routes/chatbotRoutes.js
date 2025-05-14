import express from 'express';
import * as chatbotService from '../services/chatbotService.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';

const chatbotRouter = express.Router();

// Apply authentication middleware to all routes
chatbotRouter.use(authenticateJWT);

/**
 * @route POST /api/chatbot/ask
 * @desc Ask a question to the chatbot with a file reference
 * @access Private
 */
chatbotRouter.post('/ask', async (req, res) => {
    try {
        const { question, fileUrl } = req.body;

        // Validate required fields
        if (!question) {
            return res.status(400).json({ error: 'Question is required' });
        }
        if (!fileUrl) {
            return res.status(400).json({ error: 'File URL is required' });
        }

        console.log(`Received chatbot question: "${question}" with file: ${fileUrl}`);

        // Log the interaction for potential future analytics
        await chatbotService.logChatbotInteraction(req.user.id, question, fileUrl);

        // Process the request through model
        const response = await chatbotService.askChatbot(question, fileUrl, req.user.id);

        res.status(200).json(response);
    } catch (error) {
        console.error('Error in chatbot endpoint:', error);
        res.status(500).json({ error: error.message || 'Failed to process chatbot request' });
    }
});

export default chatbotRouter; 