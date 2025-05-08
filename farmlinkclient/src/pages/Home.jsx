import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';  // ✅ Use the hook for cleaner access
import './Home.css';

const Home = () => {
  const { currentUser } = useAuth();  // ✅ Note: using `currentUser`

  const communities = ['Organic Growers', 'Sustainable Farming', 'AgriTech Innovators'];
  const recentPosts = [
    { id: 1, title: '5 Tips for Better Crop Yields', author: 'Dr. Green' },
    { id: 2, title: 'How to Start Organic Farming', author: 'Farmer Lee' },
    { id: 3, title: 'Pest Control Without Chemicals', author: 'EcoAgri' },
  ];
  const expertRecommendations = [
    'Check soil moisture levels this week.',
    'Join the upcoming webinar on AgriTech.',
    'Review your farm’s financial report.',
  ];

  return (
    <div className="home-container">
      {/* Welcome Section */}
      <section className="welcome-section">
        <h2>Welcome back, {currentUser?.name || 'Farmer'}! 👋</h2>
        <p>Here’s what’s happening on Farmlink today:</p>
      </section>

      {/* Communities Section */}
      <section className="communities-section">
        <h3>Popular Communities</h3>
        <ul className="community-list">
          {communities.map((community, index) => (
            <li key={index} className="community-item">
              <Link to={`/communities/${community}`} className="community-link">
                {community}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Recent Posts Section */}
      <section className="recent-posts-section">
        <h3>Recent Posts</h3>
        <ul className="recent-posts-list">
          {recentPosts.map((post) => (
            <li key={post.id} className="recent-post-item">
              <Link to={`/posts/${post.id}`} className="post-link">
                <h4>{post.title}</h4>
                <p>by {post.author}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Expert Recommendations Section */}
      <section className="expert-recommendations-section">
        <h3>Expert Recommendations</h3>
        <ul className="recommendations-list">
          {expertRecommendations.map((recommendation, index) => (
            <li key={index} className="recommendation-item">
              <p>{recommendation}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Home;

