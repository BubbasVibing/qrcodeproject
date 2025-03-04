import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Feedback.css';

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const { feedbackId } = useParams();

  const handleRatingHover = (hoveredValue) => {
    setHoveredRating(hoveredValue);
  };

  const handleRatingClick = async (selectedRating) => {
    try {
      setRating(selectedRating);
      setSubmitting(true);
      setError('');
      
      // If rating is 4 or 5, open Google Reviews in a new tab immediately
      if (selectedRating >= 4) {
        window.open('https://www.google.com/search?q=yosemite+burrito+reviews&sca_esv=71fa22d63362fc25&rlz=1C5CHFA_enUS1064US1064&biw=1512&bih=794&sxsrf=AHTn8zoomy2vTobziF2IjOBru1waSeoOVA%3A1741107217692&ei=ETDHZ8nyKc-r5NoPy5awyAk&ved=0ahUKEwiJv-fp8fCLAxXPFVkFHUsLDJkQ4dUDCBA&uact=5&oq=yosemite+burrito+reviews&gs_lp=Egxnd3Mtd2l6LXNlcnAiGHlvc2VtaXRlIGJ1cnJpdG8gcmV2aWV3czIKECMYgAQYJxiKBTIGEAAYFhgeMgIQJjILEAAYgAQYhgMYigUyCxAAGIAEGIYDGIoFMgsQABiABBiGAxiKBTILEAAYgAQYhgMYigUyCBAAGIAEGKIEMggQABiABBiiBDIFEAAY7wVIumFQqgVYhmFwCngBkAEAmAF-oAHfEaoBBDI2LjK4AQPIAQD4AQGYAiagApUTqAISwgIKEAAYsAMY1gQYR8ICDRAAGLADGNYEGEcYyQPCAg4QABiABBiwAxiSAxiKBcICBxAjGCcY6gLCAhQQABiABBiRAhi0AhiKBRjqAtgBAcICFBAAGIAEGOMEGLQCGOkEGOoC2AEBwgIdEC4YgAQYkQIY0QMYtAIYxwEYyAMYigUY6gLYAQHCAhcQLhiABBiRAhi0AhjIAxiKBRjqAtgBAcICHRAuGIAEGNEDGOMEGLQCGMcBGMgDGOkEGOoC2AEBwgIEECMYJ8ICExAuGIAEGMcBGCcYigUYjgUYrwHCAhcQLhiABBiRAhixAxjRAxiDARjHARiKBcICCxAuGIAEGLEDGIMBwgIQEC4YgAQYQxjHARiKBRivAcICChAAGIAEGEMYigXCAhEQLhiABBixAxjRAxiDARjHAcICCxAuGIAEGNEDGMcBwgIREC4YgAQYxwEYmAUYmgUYrwHCAgoQABiABBgUGIcCwgIWEC4YgAQYFBiHAhjHARiYBRiaBRivAcICCBAuGIAEGOUEwgIFECEYoAHCAgcQIxiwAhgnwgIQEC4YgAQYxwEYDRiOBRivAcICBxAAGIAEGA3CAgYQABgNGB7CAg4QLhiABBjHARiOBRivAcICCBAAGKIEGIkFmAMI8QUomuOi0fxX8ogGAZAGCboGBggBEAEYAZIHBDMzLjWgB8qzAw&sclient=gws-wiz-serp#lrd=0x89c6c32b39864fa3:0xb452bb81619ce59b,3,,,,', '_blank');
      }
      
      // Still send the feedback to the server
      const response = await axios.post('http://localhost:5001/api/feedback', {
        rating: selectedRating,
        feedbackId
      });
      
      setSubmitted(true);
      
    } catch (err) {
      setError('Failed to submit feedback: ' + (err.message || 'Unknown error'));
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`star ${i <= (hoveredRating || rating) ? 'active' : ''}`}
          onMouseEnter={() => handleRatingHover(i)}
          onMouseLeave={() => handleRatingHover(0)}
          onClick={() => handleRatingClick(i)}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  if (submitted) {
    return (
      <div className="feedback-container thank-you">
        <h1>Thank You!</h1>
        <p>We appreciate your feedback on Yosemite Burrito.</p>
        {rating >= 4 && (
          <>
            <p>Your opinion helps others discover great food!</p>
            <button 
              className="review-btn" 
              onClick={() => window.open('https://www.google.com/search?q=yosemite+burrito+reviews&sca_esv=71fa22d63362fc25&rlz=1C5CHFA_enUS1064US1064&biw=1512&bih=794&sxsrf=AHTn8zoomy2vTobziF2IjOBru1waSeoOVA%3A1741107217692&ei=ETDHZ8nyKc-r5NoPy5awyAk&ved=0ahUKEwiJv-fp8fCLAxXPFVkFHUsLDJkQ4dUDCBA&uact=5&oq=yosemite+burrito+reviews&gs_lp=Egxnd3Mtd2l6LXNlcnAiGHlvc2VtaXRlIGJ1cnJpdG8gcmV2aWV3czIKECMYgAQYJxiKBTIGEAAYFhgeMgIQJjILEAAYgAQYhgMYigUyCxAAGIAEGIYDGIoFMgsQABiABBiGAxiKBTILEAAYgAQYhgMYigUyCBAAGIAEGKIEMggQABiABBiiBDIFEAAY7wVIumFQqgVYhmFwCngBkAEAmAF-oAHfEaoBBDI2LjK4AQPIAQD4AQGYAiagApUTqAISwgIKEAAYsAMY1gQYR8ICDRAAGLADGNYEGEcYyQPCAg4QABiABBiwAxiSAxiKBcICBxAjGCcY6gLCAhQQABiABBiRAhi0AhiKBRjqAtgBAcICFBAAGIAEGOMEGLQCGOkEGOoC2AEBwgIdEC4YgAQYkQIY0QMYtAIYxwEYyAMYigUY6gLYAQHCAhcQLhiABBiRAhi0AhjIAxiKBRjqAtgBAcICHRAuGIAEGNEDGOMEGLQCGMcBGMgDGOkEGOoC2AEBwgIEECMYJ8ICExAuGIAEGMcBGCcYigUYjgUYrwHCAhcQLhiABBiRAhixAxjRAxiDARjHARiKBcICCxAuGIAEGLEDGIMBwgIQEC4YgAQYQxjHARiKBRivAcICChAAGIAEGEMYigXCAhEQLhiABBixAxjRAxiDARjHAcICCxAuGIAEGNEDGMcBwgIREC4YgAQYxwEYmAUYmgUYrwHCAgoQABiABBgUGIcCwgIWEC4YgAQYFBiHAhjHARiYBRiaBRivAcICCBAuGIAEGOUEwgIFECEYoAHCAgcQIxiwAhgnwgIQEC4YgAQYxwEYDRiOBRivAcICBxAAGIAEGA3CAgYQABgNGB7CAg4QLhiABBjHARiOBRivAcICCBAAGKIEGIkFmAMI8QUomuOi0fxX8ogGAZAGCboGBggBEAEYAZIHBDMzLjWgB8qzAw&sclient=gws-wiz-serp#lrd=0x89c6c32b39864fa3:0xb452bb81619ce59b,3,,,,')}
            >
              Share Your Review on Google
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="feedback-container">
      <h1>How was your Yosemite Burrito experience?</h1>
      <p>Please rate your satisfaction with our food and service</p>
      
      <div className="rating-container" style={{ pointerEvents: submitting ? 'none' : 'auto' }}>
        {renderStars()}
      </div>
      
      <div className="rating-labels">
        <span>Poor</span>
        <span>Excellent</span>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {submitting && <div className="loading">Submitting...</div>}
    </div>
  );
};

export default Feedback; 