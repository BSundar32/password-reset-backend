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
    htmlContent: `<p>Click here to reset: <a href="${resetUrl}">${resetUrl}</a></p>`
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