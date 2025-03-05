const express = require('express');
const QRCode = require('qrcode');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
console.log(`Using PORT: ${PORT}`);

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.CLIENT_URL || true  // Allow the client URL or any origin in production
    : 'http://localhost:3000'  // Allow localhost:3000 in development
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// Add at the beginning of your file, after the imports
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);

// Add after your imports
const indexPath = path.join(__dirname, '../client/build/index.html');
console.log(`Index path: ${indexPath}`);
console.log(`Index file exists: ${require('fs').existsSync(indexPath)}`);

// Add a root route at the very beginning
app.get('/', (req, res) => {
  console.log('Root route hit');
  res.send('Server is running! Try /hello or /api/test');
});

// Add these test routes at the very beginning
app.get('/hello', (req, res) => {
  console.log('Hello route hit');
  res.send('Hello from the server!');
});

app.get('/api/test', (req, res) => {
  console.log('API test route hit');
  res.json({ message: 'API is working' });
});

// API Routes

// Generate QR code
app.get('/api/generate-qr', async (req, res) => {
  try {
    // IMPORTANT: Update this with your actual Render app URL
    const actualRenderUrl = 'https://qrcodeproject.onrender.com'; // Replace with your exact URL
    
    // Use the hardcoded URL for now
    const baseUrl = actualRenderUrl;
    
    // Generate a unique ID for this feedback session
    const feedbackId = Date.now().toString();
    
    // Create the feedback URL
    const feedbackUrl = `${baseUrl}/feedback/${feedbackId}`;
    
    console.log("Generated feedback URL:", feedbackUrl);
    
    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(feedbackUrl);
    
    res.json({
      success: true,
      qrCode: qrCodeDataUrl,
      feedbackUrl,
      feedbackId
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).json({ success: false, message: 'Failed to generate QR code' });
  }
});

// Process feedback
app.post('/api/feedback', (req, res) => {
  try {
    const { rating, feedbackId } = req.body;
    
    if (!rating || !feedbackId) {
      return res.status(400).json({ success: false, message: 'Rating and feedbackId are required' });
    }
    
    // Here you would typically store the feedback in a database
    console.log(`Received feedback for ID ${feedbackId}: ${rating} stars`);
    
    // Determine redirect based on rating
    let redirectUrl = null;
    if (rating >= 4) {
      // For high ratings, redirect to Yosemite Burrito Google Reviews
      redirectUrl = 'https://www.google.com';
      console.log("Setting redirect URL:", redirectUrl);
    }
    
    res.json({
      success: true,
      redirectUrl,
      message: 'Feedback received successfully'
    });
    
    console.log("Response sent:", { success: true, redirectUrl });
  } catch (error) {
    console.error('Error processing feedback:', error);
    res.status(500).json({ success: false, message: 'Failed to process feedback' });
  }
});

// Add this temporary debugging code
app.get('/debug-build', (req, res) => {
  const fs = require('fs');
  try {
    const buildPath = path.join(__dirname, '../client/build');
    const files = fs.readdirSync(buildPath);
    const indexHtml = fs.existsSync(path.join(buildPath, 'index.html'));
    
    res.json({
      buildPathExists: fs.existsSync(buildPath),
      files,
      indexHtmlExists: indexHtml
    });
  } catch (error) {
    res.json({ error: error.message });
  }
});

// Test route for feedback
app.get('/feedback/:feedbackId', (req, res) => {
  console.log(`Feedback route hit with ID: ${req.params.feedbackId}`);
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Add before your catch-all route
app.get('/test-route', (req, res) => {
  res.send('Test route works!');
});

// Modify your catch-all route
// Catch-all handler for client-side routing in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    console.log(`Catch-all route hit: ${req.url}`);
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

const startServer = () => {
  // Always try to use the PORT provided by Render first
  const serverPort = process.env.PORT || PORT;
  
  app.listen(serverPort, '0.0.0.0', () => {
    console.log(`Server running on port ${serverPort}`);
    console.log(`Full server address: http://0.0.0.0:${serverPort}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${serverPort} is busy, trying port ${parseInt(serverPort) + 1}`);
      process.env.PORT = parseInt(serverPort) + 1;
      startServer();
    } else {
      console.error('Server error:', err);
    }
  });
};

startServer();
