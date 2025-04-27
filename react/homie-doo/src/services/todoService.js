import api from './api';

const todoService = {
    /**
     * Get all todos for a user
     * @returns {Promise<Array>} - Array of todo items
     */
    getTodos: async () => {
        try {
            const response = await api.get('/todos');
            return response.data;
        } catch (error) {
            console.error('Error fetching todos:', error);
            throw error;
        }
    },

    /**
     * Create a new todo
     * @param {Object} todoData - Todo data
     * @returns {Promise<Object>} - Created todo
     */
    createTodo: async (todoData) => {
        try {
            const response = await api.post('/todos', todoData);
            return response.data;
        } catch (error) {
            console.error('Error creating todo:', error);
            throw error;
        }
    },

    /**
     * Update a todo
     * @param {string} todoId - Todo ID
     * @param {Object} updateData - Data to update
     * @returns {Promise<Object>} - Updated todo
     */
    updateTodo: async (todoId, updateData) => {
        try {
            const response = await api.put(`/todos/${todoId}`, updateData);
            return response.data;
        } catch (error) {
            console.error(`Error updating todo ${todoId}:`, error);
            throw error;
        }
    },

    /**
     * Delete a todo
     * @param {string} todoId - Todo ID
     * @returns {Promise<boolean>} - True if deleted successfully
     */
    deleteTodo: async (todoId) => {
        try {
            await api.delete(`/todos/${todoId}`);
            return true;
        } catch (error) {
            console.error(`Error deleting todo ${todoId}:`, error);
            throw error;
        }
    },

    /**
     * Mark a todo as complete
     * @param {Object} completionData - Data with assignmentId and completedDate
     * @returns {Promise<Object>} - Updated todo
     */
    markTodoComplete: async (completionData) => {
        try {
            const response = await api.post('/todos/complete', completionData);
            return response.data;
        } catch (error) {
            console.error('Error marking todo as complete:', error);
            throw error;
        }
    },

    /**
     * Mark a todo as incomplete
     * @param {string} assignmentId - Assignment ID
     * @returns {Promise<Object>} - Updated todo
     */
    markTodoIncomplete: async (assignmentId) => {
        try {
            const response = await api.post('/todos/incomplete', { assignmentId });
            return response.data;
        } catch (error) {
            console.error('Error marking todo as incomplete:', error);
            throw error;
        }
    },

    /**
     * Get all completed todos
     * @returns {Promise<Array>} - Array of completed todos
     */
    getCompletedTodos: async () => {
        try {
            const response = await api.get('/todos/completed');
            return response.data;
        } catch (error) {
            console.error('Error fetching completed todos:', error);
            throw error;
        }
    }
};

export default todoService; 