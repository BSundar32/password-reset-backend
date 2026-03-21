const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

const sendResetEmail = async(email,resetToken)=>{
    console.log("resetToken in emailService:", resetToken);
     const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000/username'}/reset-password/${resetToken}`;
    try{
        const mailOptions={
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Request',
            html: `
      <h2>Password Reset Request</h2>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link expires in 15 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
    `
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch(err){
        console.log("Error sending email:",err);
        return false;   
    }
}

module.exports = {
    sendResetEmail
}