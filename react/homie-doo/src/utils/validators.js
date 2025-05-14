/**
 * Email validation utility functions
 */

/**
 * Validates if an email is in proper format and from an allowed domain
 * 
 * @param {string} email - The email to validate
 * @returns {boolean} - Whether the email is valid
 */
export const isValidEmail = (email) => {
    if (!email) return false;

    // Basic format validation
    const basicFormatRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!basicFormatRegex.test(email)) return false;

    // Check for valid domains
    const validDomains = [
        // Common email providers
        'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'live.com', 'aol.com', 'icloud.com', 'protonmail.com',
        'mail.com', 'zoho.com', 'yandex.com', 'gmx.com', 'msn.com',

        // Education domains
        'edu', 'ac.uk', 'edu.au', 'edu.cn', 'edu.hk', 'edu.sg', 'edu.in', 'edu.pk', 'ac.in', 'ac.jp',

        // Business and other common TLDs
        'com', 'org', 'net', 'gov', 'mil', 'io', 'co', 'us', 'uk', 'ca', 'au', 'de', 'fr', 'jp', 'cn',
        'in', 'pk', 'ru', 'nl', 'it', 'es', 'br', 'mx'
    ];

    // Extract domain from email
    const domain = email.split('@')[1].toLowerCase();

    // Check if domain exactly matches any in our list
    if (validDomains.includes(domain)) return true;

    // Check if domain ends with any of our valid TLDs
    return validDomains.some(validDomain =>
        domain.endsWith(`.${validDomain}`)
    );
};

/**
 * Get email validation error message
 * 
 * @param {string} email - The email to validate
 * @returns {string|null} - Error message or null if email is valid
 */
export const getEmailValidationError = (email) => {
    if (!email) return 'Email is required';

    const basicFormatRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!basicFormatRegex.test(email)) {
        return 'Please enter a valid email format (example@domain.com)';
    }

    if (!isValidEmail(email)) {
        return 'Please enter an email from a valid domain';
    }

    return null;
}; 