import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // or any other email provider like SendGrid, Mailjet
    auth: {
      user: process.env.EMAIL_USERNAME, // e.g. 'your-email@gmail.com'
      pass: process.env.EMAIL_PASSWORD  // e.g. 'your-app-password'
    }
  });

  // 2) Define the email options
  const mailOptions = {
    from: 'Cognisphere Admin <noreply@cognisphere.com>',
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
