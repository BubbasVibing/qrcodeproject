import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Feedback from './components/Feedback';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/feedback/:feedbackId" element={<Feedback />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
