const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));
// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Home route - now uses templates instead of plain text
app.get('/', (req, res) => {
  res.render('index', { 
    title: 'Home',
    message: 'Welcome to my personal website!'
  });
});

// About route - enhanced from Module 1
app.get('/about', (req, res) => {
  res.render('about', { 
    title: 'About Me',
    message: 'Learn more about my background and interests.'
  });
});
// Contact route (GET - show form)
app.get('/contact', (req, res) => {
    res.render('contact', {
          title: 'Contact Me',
              message: null,
                  formData: {}
                  });
                });
// Contact route (POST - handle form submission)
app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;
    // Simple validation
    if (!name || !email || !message) {
          return res.render('contact', {
            title: 'Contact Me',
            message: 'Please fill in all fields.',
            formData: req.body
   });
    }
    
  // In a real app, you'd save this to database or send email
  console.log('Contact form submission:', { name, email, message });
  setTimeout(()=>{
      console.log(`[${new Date().toISOString()}] Email sent to ${email}`)
    }, 5000);
 // Show success message
    res.render('contact', {
      title: 'Contact Me',
      message: 'Thank you for your message! I\'ll get back to you soon.',
      formData: {}
      });
    });

app.get('/block',(req, res) => {
console.log('Blocking route started');
const start= Date.now();
while (Date.now() - start < 10000){
  //busy wait loop
  // doing nothing
}
console.log('Blocking route finished');
res.send('Blocking take completed after 5 seconds');
});
// Start server
app.listen(PORT, () => {
  console.log(`Website running at http://localhost:${PORT}`);
  console.log(`Pages: / and /about`);
  console.log(`Try submitting the contact form!`);
});