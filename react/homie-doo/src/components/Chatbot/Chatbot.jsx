import React, { useState, useRef, useEffect } from 'react';
import { Send, RefreshCw } from 'lucide-react';
import useChatbotStore from '../../store/chatbotStore';
import { useAuth } from '../../hooks/useAuth';
import { getToken } from '../../utils/authUtils';

const Chatbot = ({ fileUrl, documentName }) => {
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);
    const { messages, isLoading, sendMessage, clearMessages } = useChatbotStore();
    const { token: authToken } = useAuth();
    
    // Fallback to direct localStorage if hook doesn't work
    const token = authToken || getToken();

    useEffect(() => {
        // Scroll to bottom whenever messages change
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim() && !isLoading) {
            sendMessage(inputValue, fileUrl, token);
            setInputValue('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <div className="flex flex-col h-full border rounded-lg overflow-hidden bg-white dark:bg-gray-900">
            <div className="p-3 border-b bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">
                        Document Assistant
                        {documentName && <span className="ml-2 text-xs text-gray-500">({documentName})</span>}
                    </h3>
                    <button 
                        onClick={clearMessages}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        title="Clear chat"
                    >
                        <RefreshCw size={16} />
                    </button>
                </div>
            </div>

            <div 
                className="flex-1 overflow-y-auto p-4 space-y-4"
                ref={chatContainerRef}
            >
                {messages.length === 0 ? (
                    <div className="text-center text-gray-500 dark:text-gray-400 text-sm mt-8">
                        <p>Ask questions about the document.</p>
                        <p className="mt-2">Examples:</p>
                        <ul className="mt-2 space-y-2">
                            <li className="p-2 bg-gray-100 dark:bg-gray-800 rounded cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                                onClick={() => {
                                    setInputValue('What are the main topics covered in this document?');
                                }}
                            >
                                What are the main topics covered in this document?
                            </li>
                            <li className="p-2 bg-gray-100 dark:bg-gray-800 rounded cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                                onClick={() => {
                                    setInputValue('Can you summarize the key points?');
                                }}
                            >
                                Can you summarize the key points?
                            </li>
                        </ul>
                    </div>
                ) : (
                    messages.map((message) => (
                        <div 
                            key={message.id} 
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div 
                                className={`max-w-[80%] p-3 rounded-lg ${
                                    message.role === 'user' 
                                    ? 'bg-blue-500 text-white'
                                    : message.isError
                                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                                }`}
                            >
                                <div className="whitespace-pre-wrap">{message.content}</div>
                                {message.modelInfo && (
                                    <div className="mt-2 text-xs opacity-70">
                                        {message.modelInfo.model} • {message.modelInfo.processingTime}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="max-w-[80%] p-3 rounded-lg bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                            <div className="flex space-x-2">
                                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form 
                onSubmit={handleSubmit}
                className="border-t p-2 dark:border-gray-700"
            >
                <div className="flex items-end space-x-2">
                    <textarea
                        className="flex-1 min-h-[40px] max-h-[120px] p-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        placeholder="Ask a question..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        rows={1}
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        className={`p-2 rounded-lg ${
                            isLoading || !inputValue.trim() 
                            ? 'bg-gray-300 cursor-not-allowed dark:bg-gray-700' 
                            : 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'
                        } text-white`}
                        disabled={isLoading || !inputValue.trim()}
                    >
                        <Send size={20} />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Chatbot; 