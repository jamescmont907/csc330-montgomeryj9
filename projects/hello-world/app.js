// Import the Express framework
const express = require('express');

// Create an Express application
const app = express();

// Set the port (use environment variable or default to 3000)
const PORT = process.env.PORT || 3000;

// Create a route for the home page
app.get('/', (req, res) => {
  res.send(`
    <h1>Hello, World!</h1>
    <p>Welcome to my first Node.js Express application!</p>
    <p>This is running on port ${PORT}</p>
  `);
});

// Create another route to demonstrate routing
app.get('/about', (req, res) => {
  res.send(`
    <h1>About This App</h1>
    <p>This is a simple Express.js application created for CS330.</p>
    <a href="/">Go back to home</a>
  `);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  console.log(`Visit http://localhost:${PORT}/about for the about page`);
});
