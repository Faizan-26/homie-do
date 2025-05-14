import { create } from 'zustand';
import { toast } from 'sonner';

const useChatbotStore = create((set, get) => ({
    // State
    messages: [],
    isLoading: false,
    error: null,

    // Actions
    sendMessage: async (question, fileUrl, token) => {
        if (!question.trim()) {
            toast.error('Please enter a question');
            return;
        }

        if (!fileUrl) {
            toast.error('No document selected for context');
            return;
        }

        // Add user message to state
        set(state => ({
            messages: [...state.messages, {
                id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
                role: 'user',
                content: question
            }],
            isLoading: true,
            error: null
        }));

        try {
            // Use direct URL instead of environment variable
            const response = await fetch('http://localhost:5000/api/chatbot/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    question,
                    fileUrl
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to get response from chatbot');
            }

            const data = await response.json();

            // Add AI response to state
            set(state => ({
                messages: [...state.messages, {
                    id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
                    role: 'assistant',
                    content: data.answer,
                    modelInfo: {
                        model: data.modelUsed,
                        processingTime: data.processingTime
                    }
                }],
                isLoading: false
            }));
        } catch (error) {
            console.error('Chatbot error:', error);

            // Add error message
            set(state => ({
                messages: [...state.messages, {
                    id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
                    role: 'assistant',
                    content: 'Sorry, I encountered an error while processing your request. Please try again.',
                    isError: true
                }],
                isLoading: false,
                error: error.message
            }));

            toast.error('Failed to get response from chatbot');
        }
    },

    clearMessages: () => set({ messages: [], error: null })
}));

export default useChatbotStore; 