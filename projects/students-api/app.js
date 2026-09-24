// app.js
const express = require('express');
const app = express();

const PORT = 4000;                               // port as a variable

app.use(express.json());                         // parse JSON bodies

// mount the students router under a shared base path
app.use('/api/students', require('./routes/students'));

// root route
app.get('/', (req, res) => {
  res.send('Students API is running');
});

// 404 fallback — no route matched
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// centralized error handler — MUST be last, MUST have 4 params
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Something went wrong',
  });
});

app.listen(PORT, () =>
  console.log(`Listening on http://localhost:${PORT}`)
);