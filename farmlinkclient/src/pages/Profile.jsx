import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser, logout, getAuthHeader, isAuthenticated } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    full_name: '',
    bio: '',
    location: '',
    expertise: '',
    profile_picture: ''
  });
  
  const [previewPic, setPreviewPic] = useState(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Load user data
  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.username || '',
        email: currentUser.email || '',
        full_name: currentUser.full_name || '',
        bio: '',
        location: '',
        expertise: '',
        profile_picture: ''
      });
      
      // Fetch additional user details
      const fetchUserDetails = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/v1/users/${currentUser.user_id}`, {
            headers: { ...getAuthHeader() }
          });
          
          if (response.ok) {
            const userData = await response.json();
            setFormData(prevData => ({
              ...prevData,
              bio: userData.bio || '',
              location: userData.location || '',
              expertise: userData.expertise || '',
              profile_picture: userData.profile_picture || ''
            }));
            
            if (userData.profile_picture) {
              setPreviewPic(userData.profile_picture);
            }
          }
        } catch (err) {
          console.error("Error fetching user details:", err);
        }
      };
      
      fetchUserDetails();
    }
  }, [currentUser, getAuthHeader]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profilePic: file });
      setPreviewPic(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);
    
    try {
      // Update user profile
      const response = await fetch(`http://localhost:5000/api/v1/users/${currentUser.user_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify({
          full_name: formData.full_name,
          bio: formData.bio,
          location: formData.location,
          expertise: formData.expertise,
          // Handle profile picture separately if it's a file
        })
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update profile');
      }
      
      // Handle image upload separately if there's a new profile picture
      if (formData.profilePic && formData.profilePic instanceof File) {
        const formDataForImage = new FormData();
        formDataForImage.append('image', formData.profilePic);
        
        const imageResponse = await fetch('http://localhost:5000/api/v1/posts/upload-image', {
          method: 'POST',
          headers: {
            ...getAuthHeader()
          },
          body: formDataForImage
        });
        
        if (imageResponse.ok) {
          const imageData = await imageResponse.json();
          
          // Update user with new profile picture URL
          await fetch(`http://localhost:5000/api/v1/users/${currentUser.user_id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              ...getAuthHeader()
            },
            body: JSON.stringify({
              profile_picture: imageData.image_url
            })
          });
        }
      }
      
      if (response.ok) {
        setSuccess('Profile updated successfully!');
        alert('Profile updated successfully!'); // ✅ ALERT POPUP
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update profile');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while updating your profile');
      alert(err.message || 'An error occurred while updating your profile'); // ✅ ALERT POPUP
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Simulate recent activity
  const recentActivity = [
    'Commented on "Best Crops for 2025"',
    'Liked "Organic Fertilizer Tips"',
    'Joined Community: Sustainable Farmers',
  ];

  if (!currentUser) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="profile-container">
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <div className="profile-header">
        <h2>Profile</h2>
        <img
          src={previewPic || 'https://via.placeholder.com/120'}
          alt="Profile"
          className="profile-pic"
        />
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </div>
      
      <form onSubmit={handleSave}>
        <div className="profile-field">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            disabled // Username can't be changed
          />
        </div>
        
        <div className="profile-field">
          <label>Full Name</label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
          />
        </div>
        
        <div className="profile-field">
          <label>Bio (About)</label>
          <textarea
            name="bio"
            rows="3"
            value={formData.bio}
            onChange={handleChange}
          />
        </div>
        
        <div className="profile-field">
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
        </div>
        
        <div className="profile-field">
          <label>Expertise</label>
          <input
            type="text"
            name="expertise"
            value={formData.expertise}
            onChange={handleChange}
          />
        </div>

        <div className="section">
          <h3>Recent Activity</h3>
          {recentActivity.map((item, index) => (
            <div key={index} className="activity-item">
              {item}
            </div>
          ))}
        </div>

        <div className="section">
          <h3>Contact</h3>
          <div className="profile-field">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled // Email can't be changed
            />
          </div>
        </div>

        <div className="button-group">
          <button 
            type="submit" 
            className="button save-button"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
          <button 
            type="button" 
            className="button logout-button" 
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;