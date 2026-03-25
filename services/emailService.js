const nodemailer = require('nodemailer');

// Validate environment variables on startup
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.warn('WARNING: EMAIL_USER or EMAIL_PASSWORD environment variables are not set!');
    console.warn('Password reset emails will not be sent. Configure these in your .env file.');
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD  // Must be an App Password, not your Gmail password
    },
    pool: {
        maxConnections: 5,  // Increased for better concurrency
        maxMessages: 50,
        rateDelta: 20000,
        rateLimit: 5
    },
    secure: true,
    requireTLS: true
});

// Verify transporter configuration
transporter.verify((error, success) => {
    if (error) {
        console.error('Email transporter error:', error);
    } else {
        console.log('✓ Email service is ready to send emails');
    }
});

const sendResetEmail = async (email, resetToken) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
        console.error('Email service not configured - EMAIL_USER or EMAIL_PASSWORD is missing');
        return { success: false, error: 'Email service not configured' };
    }

    const resetUrl = `${'http://localhost:3000'}/reset-password/${resetToken}`;
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset Request',
        html: `
<h2>Password Reset Request</h2>
<p>You requested a password reset. Click the link below to reset your password:</p>
<a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
<p>This link expires in 15 minutes.</p>
<p>If you did not request this, please ignore this email.</p>
<hr>
<p><small>For security reasons, do not share this email with anyone.</small></p>
        `
    };

    try {
        console.log(`[EMAIL] Sending reset email to: ${email}`);
        const info = await transporter.sendMail(mailOptions);
        console.log(`[EMAIL] ✓ Email sent successfully to ${email} - MessageId: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (err) {
        console.error(`[EMAIL] ✗ Failed to send email to ${email}:`);
        console.error(`[EMAIL] Error: ${err.message}`);
        if (err.message.includes('Invalid login') || err.message.includes('unauthorized')) {
            console.error('[EMAIL] CHECK: Verify your EMAIL_PASSWORD is an App Password, not your Gmail password');
        }
        return { success: false, error: err.message };
    }
}

module.exports = {
    sendResetEmail
}