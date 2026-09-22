const express = require('express');
const path = require('path');
require('dotenv').config(); // Load environment variables
const { sendContactEmail, sendConfirmationEmail } = require('./utils/emailservice');

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Also parse JSON for AJAX requests

// Custom middleware for logging requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Home route
app.get('/', (req, res) => {
  res.render('index', { 
    title: 'Home',
    currentPage: 'home',
    message: 'Welcome to my personal website!',
   
  });
});

// About route
app.get('/about', (req, res) => {
  res.render('about', { 
    title: 'About Me',
    currentPage: 'about',
    message: 'Learn more about my background and interests.'
  });
});

// Resume route
app.get('/resume', (req, res) => {
  res.render('resume', { 
    title: 'Resume',
    currentPage: 'resume'
  });
});

// Contact route (GET - show form)
app.get('/contact', (req, res) => {
  res.render('contact', { 
    title: 'Contact Me',
    currentPage: 'contact',
    message: null,
    formData: {}
  });
});

// Contact route (POST - handle form submission with email)
app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;
  
  // Basic validation
  if (!name || !email || !message) {
    return res.render('contact', {
      title: 'Contact Me',
      currentPage: 'contact',
      message: 'Please fill in all fields.',
      formData: req.body
    });
  }
  
  try {
    // Send email to yourself with the contact form data
    const emailResult = await sendContactEmail({ name, email, message });
    
    if (emailResult.success) {
      // Send confirmation email to the user
      await sendConfirmationEmail(email, name);
      
      // Show success message
      res.render('contact', { 
        title: 'Contact Me',
        currentPage: 'contact',
        message: 'Thank you for your message! I\'ve sent you a confirmation email and will get back to you soon.',
        formData: {}
      });
    } else {
      // Handle email sending failure
      res.render('contact', {
        title: 'Contact Me',
        currentPage: 'contact',
        message: 'Sorry, there was an error sending your message. Please try again later.',
        formData: req.body
      });
    }
    
  } catch (error) {
    console.error('Contact form error:', error);
    res.render('contact', {
      title: 'Contact Me',
      currentPage: 'contact',
      message: 'Sorry, there was an error processing your request. Please try again later.',
      formData: req.body
    });
  }
});

// AJAX endpoint for sending emails (we'll use this later)
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ 
      success: false, 
      message: 'Please fill in all fields.' 
    });
  }
  
  try {
    const emailResult = await sendContactEmail({ name, email, message });
    
    if (emailResult.success) {
      await sendConfirmationEmail(email, name);
      res.json({ 
        success: true, 
        message: 'Message sent successfully! Check your email for confirmation.' 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to send email. Please try again.' 
      });
    }
    
  } catch (error) {
    console.error('API contact error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error. Please try again later.' 
    });
  }
});

// 404 Error Handler
app.use((req, res) => {
  res.status(404).render('404', { 
    title: '404 - Page Not Found',
    currentPage: '404'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Personal website running at http://localhost:${PORT}`);
  console.log(`📧 Email functionality enabled!`);
  console.log(`🔒 Environment variables loaded`);
});