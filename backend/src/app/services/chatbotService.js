import { GoogleGenAI } from '@google/genai';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import os from 'os';
import mime from 'mime';

/**
 * Send a question to the Google Gemini API along with a file
 * @param {string} question - The user's question
 * @param {string} fileUrl - URL of the file for context
 * @param {string} userId - ID of the user asking the question
 * @returns {Promise<Object>} The chatbot's response
 */
export const askChatbot = async (question, fileUrl, userId) => {
    let tempFilePath = '';

    try {
        const startTime = Date.now();
        // Use environment variable instead of hardcoded API key for security
        const apiKey = process.env.CHATBOT_API_KEY;

        if (!apiKey) {
            throw new Error('CHATBOT_API_KEY environment variable is not set');
        }

        // Initialize the Google Gemini AI client
        const ai = new GoogleGenAI({ apiKey });
        const config = {
            responseMimeType: 'text/plain',
        };
        // Use gemini-1.5-flash-latest which has a free tier
        const model = 'gemini-1.5-flash-latest';

        // Download the file from the URL
        if (fileUrl) {
            // Create a temporary file path to download the file
            const tempDir = os.tmpdir();
            const urlParts = fileUrl.split('/');
            const fileName = urlParts[urlParts.length - 1];
            tempFilePath = path.join(tempDir, `file_${Date.now()}_${Math.floor(Math.random() * 1000)}_${fileName}`);

            console.log(`Downloading file from ${fileUrl} to ${tempFilePath}`);
            const fileResponse = await axios({
                method: 'get',
                url: fileUrl,
                responseType: 'stream'
            });

            // Save the file to the temporary path
            await new Promise((resolve, reject) => {
                const writer = fs.createWriteStream(tempFilePath);
                fileResponse.data.pipe(writer);
                writer.on('finish', resolve);
                writer.on('error', reject);
            });

            // Determine the MIME type of the file
            const mimeType = mime.getType(tempFilePath) || 'application/octet-stream';
            console.log(`File MIME type: ${mimeType}`);

            try {
                // Upload the file to Gemini's servers
                const uploadedFile = await ai.files.upload({
                    file: tempFilePath,
                    mimeType
                });

                console.log('File uploaded successfully to Google servers');

                // Create the contents with the file
                const contents = [
                    {
                        role: 'user',
                        parts: [
                            {
                                fileData: {
                                    fileUri: uploadedFile.uri,
                                    mimeType: mimeType
                                }
                            },
                            {
                                text: question
                            }
                        ]
                    }
                ];

                // Stream the response
                const response = await ai.models.generateContentStream({
                    model,
                    config,
                    contents,
                });

                let fullText = '';
                for await (const chunk of response) {
                    fullText += chunk.text;
                }

                console.log('Received text response from Gemini');

                const processingTime = `${((Date.now() - startTime) / 1000).toFixed(2)}s`;

                return {
                    answer: fullText,
                    modelUsed: model,
                    processingTime
                };
            } catch (fileError) {
                console.error('Error using file with Gemini:', fileError);
                console.log('Falling back to text-only approach');

                // Fallback: Read file content and send as text only
                const fileContent = fs.readFileSync(tempFilePath, { encoding: 'utf8', flag: 'r' });

                // Limit file content length
                const truncatedContent = fileContent.length > 10000
                    ? fileContent.substring(0, 10000) + "... [Content truncated due to length]"
                    : fileContent;

                // Create the prompt with file content
                const prompt = `Question: ${question}\n\nContext from file (${path.basename(tempFilePath)}):\n${truncatedContent}`;

                const contents = [
                    {
                        role: 'user',
                        parts: [{ text: prompt }]
                    }
                ];

                const response = await ai.models.generateContentStream({
                    model,
                    config,
                    contents,
                });

                let fullText = '';
                for await (const chunk of response) {
                    fullText += chunk.text;
                }

                const processingTime = `${((Date.now() - startTime) / 1000).toFixed(2)}s`;

                return {
                    answer: fullText,
                    modelUsed: `${model} (text-only fallback)`,
                    processingTime
                };
            }
        } else {
            // If no file provided, just send the question
            const contents = [
                {
                    role: 'user',
                    parts: [{ text: question }]
                }
            ];

            const response = await ai.models.generateContentStream({
                model,
                config,
                contents,
            });

            let fullText = '';
            for await (const chunk of response) {
                fullText += chunk.text;
            }

            const processingTime = `${((Date.now() - startTime) / 1000).toFixed(2)}s`;

            return {
                answer: fullText,
                modelUsed: model,
                processingTime
            };
        }
    } catch (error) {
        console.error('Error in chatbot service:', error);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
        }

        // Return a user-friendly error message
        return {
            answer: "I'm sorry, but I encountered an error processing your request. Please try again later or with a different file.",
            modelUsed: "error",
            processingTime: "0s",
            error: error.message
        };
    } finally {
        // Clean up the temporary file
        if (tempFilePath && fs.existsSync(tempFilePath)) {
            try {
                fs.unlinkSync(tempFilePath);
                console.log(`Temporary file ${tempFilePath} deleted`);
            } catch (err) {
                console.error(`Error deleting temporary file: ${err.message}`);
            }
        }
    }
};

/**
 * Log user question for analytics purposes
 * @param {string} userId - ID of the user
 * @param {string} question - Question asked
 * @param {string} fileUrl - URL of referenced file
 */
export const logChatbotInteraction = async (userId, question, fileUrl) => {
    // This could be expanded to store interactions in the database
    console.log(`User ${userId} asked: "${question}" (File: ${fileUrl})`);
}; 