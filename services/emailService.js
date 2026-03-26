const SibApiV3Sdk = require('sib-api-v3-sdk');
const defaultClient = SibApiV3Sdk.ApiClient.instance;

// Configure Brevo API key
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = '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';

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

async function sendResetEmail(email, resetToken) {
  const resetUrl = `https://reset-passwordflow.netlify.app/username/reset-password/${resetToken}`;

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