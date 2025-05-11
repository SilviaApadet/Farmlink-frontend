import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Profile.css';
import axios from 'axios';

import toast, { Toaster } from 'react-hot-toast';


const Profile = () => {
  const navigate = useNavigate();
  const { currentUser, logout, getAuthHeader, isAuthenticated } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = "https://farmlink-server-bhlp.onrender.com";
  
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
          const response = await fetch(`${API_URL}/users/${currentUser.user_id}`, {
            headers: { ...getAuthHeader() }
          });
          
          if (response.ok) {
            const userData = await response.json();
            setFormData(prevData => ({
              ...prevData,
              bio: userData.bio || '',
              location: userData.location || '',
              expertise: userData.expertise || '',
              profile_picture: userData.profile_picture || '',
              email: userData.email
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

  const [imageUrl, setImageUrl] = useState('');

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();

    formData.append('file', file);
    formData.append('upload_preset', 'uploads')
    formData.append('cloud_name', 'dhvgpxttr');

    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dhvgpxttr/image/upload',
        formData
      );
      setImageUrl(response.data.secure_url);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/profile/${currentUser.user_id}`, {
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
          profile_picture: imageUrl
        })
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update profile');
      }
    
  
      if (response.ok) {
        toast('Profile updated successfully!');
        navigate('/home')
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update profile');
      }
    } catch (err) {
      toast(err.message || 'An error occurred while updating your profile');
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
      <input type="file" 
      onChange={handleImageUpload}
      
       />
      {imageUrl && <img src={imageUrl} alt="Uploaded" width="300" />}
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