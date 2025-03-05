const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello from the simple server!');
});

app.get('/test', (req, res) => {
  res.send('Test route works!');
});

app.get('/feedback/:feedbackId', (req, res) => {
  console.log(`Feedback route hit with ID: ${req.params.feedbackId}`);
  // Try sending a simple response first to see if the route works
  res.send(`Feedback page for ID: ${req.params.feedbackId}`);
  
  // If that works, then try serving the index.html
  // res.sendFile(path.resolve(__dirname, '../client/build/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Simple server running on port ${PORT}`);
}); 