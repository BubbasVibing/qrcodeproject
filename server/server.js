const express = require('express');
const path = require('path');
const QRCode = require('qrcode');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

console.log(`Starting server with NODE_ENV: ${process.env.NODE_ENV}`);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple test routes
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the server!' });
});

// Generate QR code
app.get('/api/generate-qr', async (req, res) => {
  try {
    // Use the actual deployment URL
    const baseUrl = process.env.CLIENT_URL || 'https://qrcodeproject.onrender.com';
    
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

// Serve static files from React app
app.use(express.static(path.join(__dirname, '../client/build')));

// Catch-all route to serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
