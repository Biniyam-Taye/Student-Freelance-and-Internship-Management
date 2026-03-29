const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.ethereal.email',
        port: process.env.SMTP_PORT || 587,
        auth: {
            user: process.env.SMTP_EMAIL || 'ethereal_user',
            pass: process.env.SMTP_PASSWORD || 'ethereal_pass'
        }
    });

    // Define the email options
    const message = {
        from: `${process.env.FROM_NAME || 'Frelaunch'} <${process.env.FROM_EMAIL || 'noreply@frelaunch.com'}>`,
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    // Send the email
    const info = await transporter.sendMail(message);

    console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
