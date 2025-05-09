import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Home.css';

const Home = () => {
  const { currentUser } = useAuth();
  const isExpert = currentUser?.role === 'expert';

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <header className="dashboard-header">
        <h2>Welcome back, {currentUser?.name || 'Farmer'}! 👋</h2>
        <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      </header>

      {isExpert ? <ExpertDashboard /> : <UserDashboard />}
    </div>
  );
};

// Dashboard for regular users
const UserDashboard = () => {
  const communities = ['Organic Growers', 'Sustainable Farming', 'AgriTech Innovators'];
  const recentPosts = [
    { id: 1, title: '5 Tips for Better Crop Yields', author: 'Dr. Green', comments: 12, likes: 34 },
    { id: 2, title: 'How to Start Organic Farming', author: 'Farmer Lee', comments: 8, likes: 27 },
    { id: 3, title: 'Pest Control Without Chemicals', author: 'EcoAgri', comments: 15, likes: 42 },
  ];
  const expertRecommendations = [
    { id: 1, text: 'Check soil moisture levels this week.', expert: 'Dr. Soil', category: 'Maintenance' },
    { id: 2, text: 'Join the upcoming webinar on AgriTech.', expert: 'Tech Farmer', category: 'Education' },
    { id: 3, text: 'Review your farm financial report.', expert: 'AgriFinance', category: 'Business' },
  ];
  const weatherForecast = {
    today: { temp: '28°C', condition: 'Sunny', humidity: '65%' },
    tomorrow: { temp: '25°C', condition: 'Partly Cloudy', humidity: '70%' },
  };

  return (
    <div className="user-dashboard">
      <div className="dashboard-grid">
        {/* Weather Widget */}
        <div className="dashboard-card weather-card">
          <h3>Weather Forecast</h3>
          <div className="weather-info">
            <div className="today">
              <h4>Today</h4>
              <p className="temp">{weatherForecast.today.temp}</p>
              <p>{weatherForecast.today.condition}</p>
              <p>Humidity: {weatherForecast.today.humidity}</p>
            </div>
            <div className="tomorrow">
              <h4>Tomorrow</h4>
              <p className="temp">{weatherForecast.tomorrow.temp}</p>
              <p>{weatherForecast.tomorrow.condition}</p>
              <p>Humidity: {weatherForecast.tomorrow.humidity}</p>
            </div>
          </div>
        </div>

        {/* Expert Recommendations */}
        <div className="dashboard-card recommendations-card">
          <h3>Expert Recommendations</h3>
          <ul className="recommendations-list">
            {expertRecommendations.map((item) => (
              <li key={item.id} className="recommendation-item">
                <p className="recommendation-text">{item.text}</p>
                <div className="recommendation-meta">
                  <span className="expert-name">{item.expert}</span>
                  <span className="category-tag">{item.category}</span>
                </div>
              </li>
            ))}
          </ul>
          <Link to="/experts" className="see-more-link">See More Recommendations</Link>
        </div>

        {/* Recent Posts */}
        <div className="dashboard-card posts-card">
          <h3>Recent Posts</h3>
          <ul className="recent-posts-list">
            {recentPosts.map((post) => (
              <li key={post.id} className="recent-post-item">
                <Link to={`/posts/${post.id}`} className="post-link">
                  <h4>{post.title}</h4>
                  <div className="post-meta">
                    <span className="post-author">by {post.author}</span>
                    <div className="post-stats">
                      <span>{post.comments} comments</span>
                      <span>{post.likes} likes</span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <Link to="/blogs" className="see-more-link">Browse All Posts</Link>
        </div>

        {/* Communities */}
        <div className="dashboard-card communities-card">
          <h3>Your Communities</h3>
          <ul className="community-list">
            {communities.map((community, index) => (
              <li key={index} className="community-item">
                <Link to={`/communities/${community}`} className="community-link">
                  {community}
                </Link>
              </li>
            ))}
          </ul>
          <Link to="/communities" className="see-more-link">Explore Communities</Link>
        </div>
      </div>
    </div>
  );
};

// Dashboard for experts
const ExpertDashboard = () => {
  const clientQuestions = [
    { id: 1, question: 'What is the best time to plant corn in my region?', user: 'John Smith', status: 'New', date: '2023-05-07' },
    { id: 2, question: 'How do I prevent tomato blight?', user: 'Maria Garcia', status: 'Pending', date: '2023-05-06' },
    { id: 3, question: 'Best practices for organic pest control?', user: 'Alex Johnson', status: 'New', date: '2023-05-07' },
  ];
  
  const scheduledConsultations = [
    { id: 1, client: 'Sarah Wilson', topic: 'Crop Rotation Strategy', date: '2023-05-10', time: '10:00 AM' },
    { id: 2, client: 'Robert Brown', topic: 'Soil Health Assessment', date: '2023-05-12', time: '2:30 PM' },
  ];
  
  const articleDrafts = [
    { id: 1, title: 'Sustainable Irrigation Methods', status: 'Draft', lastEdited: '2023-05-05' },
    { id: 2, title: 'Composting for Beginners', status: 'Published', lastEdited: '2023-04-28' },
  ];

  const expertStats = {
    questionsAnswered: 128,
    articlesPublished: 14,
    consultationsCompleted: 32,
    rating: 4.8
  };

  return (
    <div className="expert-dashboard">
      <div className="dashboard-grid">
        {/* Expert Stats */}
        <div className="dashboard-card stats-card">
          <h3>Your Stats</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-value">{expertStats.questionsAnswered}</span>
              <span className="stat-label">Questions Answered</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{expertStats.articlesPublished}</span>
              <span className="stat-label">Articles Published</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{expertStats.consultationsCompleted}</span>
              <span className="stat-label">Consultations</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{expertStats.rating}</span>
              <span className="stat-label">Average Rating</span>
            </div>
          </div>
        </div>

        {/* Recent Questions */}
        <div className="dashboard-card questions-card">
          <h3>Recent Questions</h3>
          <ul className="questions-list">
            {clientQuestions.map((item) => (
              <li key={item.id} className="question-item">
                <Link to={`/questions/${item.id}`}>
                  <h4>{item.question}</h4>
                  <div className="question-meta">
                    <span className="question-user">From: {item.user}</span>
                    <span className={`question-status status-${item.status.toLowerCase()}`}>{item.status}</span>
                    <span className="question-date">{item.date}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <Link to="/expert/questions" className="see-more-link">View All Questions</Link>
        </div>

        {/* Scheduled Consultations */}
        <div className="dashboard-card consultations-card">
          <h3>Upcoming Consultations</h3>
          <ul className="consultations-list">
            {scheduledConsultations.map((item) => (
              <li key={item.id} className="consultation-item">
                <h4>{item.topic}</h4>
                <div className="consultation-details">
                  <p className="consultation-client">With: {item.client}</p>
                  <p className="consultation-datetime">{item.date} at {item.time}</p>
                </div>
                <div className="consultation-actions">
                  <Link to={`/consultations/${item.id}`} className="view-link">View Details</Link>
                  <button className="reschedule-button">Reschedule</button>
                </div>
              </li>
            ))}
          </ul>
          <Link to="/expert/consultations" className="see-more-link">Manage All Consultations</Link>
        </div>

        {/* Article Drafts */}
        <div className="dashboard-card articles-card">
          <h3>Your Articles</h3>
          <ul className="articles-list">
            {articleDrafts.map((item) => (
              <li key={item.id} className="article-item">
                <div className="article-info">
                  <h4>{item.title}</h4>
                  <div className="article-meta">
                    <span className={`article-status status-${item.status.toLowerCase()}`}>{item.status}</span>
                    <span className="article-date">Last edited: {item.lastEdited}</span>
                  </div>
                </div>
                <div className="article-actions">
                  <Link to={`/expert/articles/${item.id}/edit`} className="edit-link">Edit</Link>
                </div>
              </li>
            ))}
          </ul>
          <div className="article-buttons">
            <Link to="/expert/articles/new" className="new-article-button">Write New Article</Link>
            <Link to="/expert/articles" className="see-more-link">View All Articles</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;