const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "sundarb3898@gmail.com",
    pass: "ckfc avsa mtwb gits" // must be Google App Password
  }
});

async function sendResetEmail(email, resetToken) {
  const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

  const mailOptions = {
    from: "sundarb3898@gmail.com",
    to: email,
    subject: 'Password Reset Request',
    html: `<p>Click here to reset: <a href="${resetUrl}">${resetUrl}</a></p>`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (err) {
    console.error('Error sending email:', err);
  }
}

sendResetEmail("sundarb3898@gmail.com", "testtoken123");