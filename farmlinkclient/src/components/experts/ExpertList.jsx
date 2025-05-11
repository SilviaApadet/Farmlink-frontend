import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ExpertCard from './ExpertCard';
import toast from 'react-hot-toast';

const ExpertList = () => {
  const [experts, setExperts] = useState([]);
  const API_URL = "https://farmlink-server-bhlp.onrender.com";
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperts()
  }, []);

  const fetchExperts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/experts`)
      const data = response.data;
      setExperts(data)
    } catch (error) {
      toast('Cannot fetch experts')
    }
    finally {
      setLoading(false);
    }
  }

  const filteredExperts = experts.filter((expert) => {
    const name = expert.full_name || expert.username || '';
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (expert.expertise || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (expert.location || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">EXPERTS</h1>

      <input
        type="text"
        placeholder="Search by name, field, or location..."
        className="w-full p-2 mb-4 border border-gray-300 rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading ? (
        <p>Loading experts...</p>
      ) : (
        <>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="grid grid-cols-1 gap-4">
            {filteredExperts.length > 0 ? (
              filteredExperts.map((expert) => (
                <ExpertCard key={expert.user_id || expert.id} expert={expert} />
              ))
            ) : (
              <p className="text-gray-500">No experts found matching your search.</p>
            )}
          </div>
        </>
      )}
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


export default ExpertList;
