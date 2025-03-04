const express = require('express');
const QRCode = require('qrcode');
const path = require('path');
const cors = require('cors');

const app = express();
let PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// API Routes

// Generate QR code
app.get('/api/generate-qr', async (req, res) => {
  try {
    const baseUrl = process.env.CLIENT_URL || 
      (process.env.NODE_ENV === 'production' 
        ? 'https://your-production-domain.com' 
        : 'http://localhost:3000');
    
    // Generate a unique ID for this feedback session
    const feedbackId = Date.now().toString();
    
    // Create the feedback URL
    const feedbackUrl = `${baseUrl}/feedback/${feedbackId}`;
    
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

// Catch-all handler for client-side routing in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${PORT} is busy, trying port ${PORT + 1}`);
      PORT += 1;
      startServer();
    } else {
      console.error(err);
    }
  });
};

startServer();
