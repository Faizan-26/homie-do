import fetch from 'node-fetch';

const API_URL = 'http://localhost:5500/api';

// Test the health endpoint
async function testHealthEndpoint() {
    try {
        const response = await fetch(`${API_URL.replace('/api', '')}/health`);
        const data = await response.json();
        console.log('Health Endpoint Response:', data);
        return data;
    } catch (error) {
        console.error('Error testing health endpoint:', error);
        return null;
    }
}

// Test the API test endpoint
async function testApiEndpoint() {
    try {
        const response = await fetch(`${API_URL}/test`);
        const data = await response.json();
        console.log('API Test Endpoint Response:', data);
        return data;
    } catch (error) {
        console.error('Error testing API endpoint:', error);
        return null;
    }
}

// Test the subjects endpoint
async function testSubjectsEndpoint() {
    try {
        const response = await fetch(`${API_URL}/subjects`);
        const data = await response.json();
        console.log('Subjects Endpoint Response:', data);
        return data;
    } catch (error) {
        console.error('Error testing subjects endpoint:', error);
        return null;
    }
}

// Run all tests
async function runTests() {
    console.log('=== TESTING API ===');
    await testHealthEndpoint();
    await testApiEndpoint();
    await testSubjectsEndpoint();
    console.log('=== TESTS COMPLETE ===');
}

runTests(); 