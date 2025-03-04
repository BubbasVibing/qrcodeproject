import React, { useState } from 'react';
import axios from 'axios';
import './Home.css';

const Home = () => {
  const [qrCode, setQrCode] = useState('');
  const [feedbackUrl, setFeedbackUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateQRCode = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get('http://localhost:5001/api/generate-qr');
      
      if (response.data.success) {
        setQrCode(response.data.qrCode);
        setFeedbackUrl(response.data.feedbackUrl);
      } else {
        setError('Failed to generate QR code');
      }
    } catch (err) {
      setError('Error connecting to server: ' + (err.message || 'Unknown error'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <h1>Yosemite Burrito Feedback</h1>
      <p>Generate a QR code for customer feedback on their Yosemite Burrito experience</p>
      
      <button 
        className="generate-btn" 
        onClick={generateQRCode}
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate QR Code'}
      </button>
      
      {error && <div className="error-message">{error}</div>}
      
      {qrCode && (
        <div className="qr-result">
          <h2>Your QR Code</h2>
          <img src={qrCode} alt="QR Code" className="qr-image" />
          <p>Feedback URL: <a href={feedbackUrl} target="_blank" rel="noopener noreferrer">{feedbackUrl}</a></p>
          <p>Print this QR code and place it at your restaurant for customers to scan.</p>
          <button 
            className="download-btn" 
            onClick={() => {
              const link = document.createElement('a');
              link.href = qrCode;
              link.download = 'yosemite-burrito-feedback-qr.png';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            Download QR Code
          </button>
        </div>
      )}
    </div>
  );
};

export default Home; 