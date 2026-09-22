const nodemailer = require('nodemailer');

// Create reusable transporter object using SMTP
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Function to send contact form email
const sendContactEmail = async (formData) => {
  try {
    const transporter = createTransporter();
    
    // Define email options
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_FROM, // Send to yourself
      subject: `Contact Form Submission from ${formData.name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${formData.name}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Message:</strong></p>
        <p>${formData.message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><em>Sent from your personal website contact form</em></p>
      `,
      // Also include plain text version
      text: `
        New Contact Form Submission
        
        Name: ${formData.name}
        Email: ${formData.email}
        
        Message:
        ${formData.message}
        
        Sent from your personal website contact form
      `
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// Function to send confirmation email to the user
const sendConfirmationEmail = async (userEmail, userName) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: userEmail,
      subject: 'Thank you for contacting me!',
      html: `
        <h2>Thank you for your message, ${userName}!</h2>
        <p>I've received your contact form submission and will get back to you soon.</p>
        <p>Best regards,<br>Your Name</p>
      `,
      text: `
        Thank you for your message, ${userName}!
        
        I've received your contact form submission and will get back to you soon.
        
        Best regards,
        Your Name
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent:', info.messageId);
    return { success: true };
    
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendContactEmail,
  sendConfirmationEmail
};