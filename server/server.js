const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

console.log(`Starting server with NODE_ENV: ${process.env.NODE_ENV}`);

// Simple test routes
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the server!' });
});

// Serve static files from React app
app.use(express.static(path.join(__dirname, '../client/build')));

// Catch-all route to serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
