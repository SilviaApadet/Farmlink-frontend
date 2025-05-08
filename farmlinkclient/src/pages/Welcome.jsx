// src/pages/Welcome.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Welcome.css';

const Welcome = () => {
  return (
    <div className="welcome-container">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Farmlink 🌱</h1>
          <p>Your one-stop hub for sustainable farming, expert advice, and thriving communities.</p>
          <div className="hero-buttons">
            <Link to="/signup" className="btn primary-btn">Get Started</Link>
            <Link to="/login" className="btn secondary-btn">Log In</Link>
          </div>
        </div>
        <div className="hero-image">
          <img src="https://images.unsplash.com/photo-1605733160314-4d70b4d1c9a4" alt="Farming" />
        </div>
      </section>

      <section className="features">
        <div className="feature">
          <h3>🌾 Join Communities</h3>
          <p>Connect with like-minded farmers and experts in your field.</p>
        </div>
        <div className="feature">
          <h3>📚 Expert Advice</h3>
          <p>Access articles, blogs, and real-time help from top experts.</p>
        </div>
        <div className="feature">
          <h3>📊 Track Progress</h3>
          <p>Keep tabs on your farm’s performance and milestones.</p>
        </div>
      </section>
      {/* Footer Section */}
      <footer className="footer">
        <div className="footer-content">
          <p>© 2025 Farmlink. All rights reserved.</p>
          <div className="footer-links">
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/privacy">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;
