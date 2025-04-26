import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

/**
 * Send password reset email
 * @param {string} email - Recipient email address
 * @param {string} resetUrl - Password reset URL
 */
export const sendPasswordResetEmail = async (email, resetUrl) => {
    console.log("Reset URL: ", resetUrl);
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset Request',
        html: `
      <h1>Reset Your Password</h1>
      <p>You requested a password reset. Please click the link below to reset your password:</p>
      <a href="${resetUrl}" style="padding: 10px 15px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>This link is valid for 10 minutes only.</p>
      <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
    `
    };

    try {
        const result = await transporter.sendMail(mailOptions);
        return result;
    } catch (error) {
        console.error("Email sending failed:", error);
        throw new Error("Could not send email");
    }
};

/**
 * Send welcome email to new user
 * @param {string} email - Recipient email address
 * @param {string} name - User's name
 */
export const sendWelcomeEmail = async (email, name) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Welcome to Homie-Do!',
        html: `
      <h1>Welcome to Homie-Do, ${name}!</h1>
      <p>Thank you for joining us. We're excited to have you on board!</p>
      <p>If you have any questions or need assistance, feel free to contact our support team.</p>
    `
    };

    return await transporter.sendMail(mailOptions);
}; 