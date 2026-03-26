const SibApiV3Sdk = require('sib-api-v3-sdk');
require('dotenv').config();

const defaultClient = SibApiV3Sdk.ApiClient.instance;

// Configure Brevo API key
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

async function sendResetEmail(email, resetToken) {
  const resetUrl = `https://reset-passwordflow.netlify.app/reset-password/${resetToken}`;

  const emailData = {
    sender: { name: 'Password Reset Service', email: 'sundarbala381998@gmail.com' },
    to: [{ email }],
    subject: 'Password Reset Request',
    htmlContent: `
    <h2>Password Reset Request</h2>
    <p>You requested a password reset. Click the link below to reset your password:</p>
    <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
    <p>This link expires in 15 minutes.</p>
    <p>If you did not request this, please ignore this email.</p>
<hr>
<p><small>For security reasons, do not share this email with anyone.</small></p>`
  };

  try {
    const response = await apiInstance.sendTransacEmail(emailData);
    console.log('Email sent successfully:', response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

module.exports = {
  sendResetEmail
};