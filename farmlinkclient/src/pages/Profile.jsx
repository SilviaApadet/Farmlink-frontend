import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Profile.css';
import axios from 'axios';
import toast from 'react-hot-toast';

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser, logout, getAuthHeader, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = "https://farmlink-server-bhlp.onrender.com";

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    // full_name: '',
    bio: '',
    location: '',
    image: ''
  });

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
        // full_name: currentUser.full_name || '',
        bio: '',
        location: '',
        image: ''
      });

      const fetchUserDetails = async () => {
        try {
          const response = await fetch(`${API_URL}/users/${currentUser.user_id}`, {
            headers: getAuthHeader()
          });

          if (response.ok) {
            const userData = await response.json();
            setFormData(prev => ({
              ...prev,
              bio: userData.bio || '',
              location: userData.location || '',
              image: userData.image || '',
              email: userData.email || prev.email
            }));
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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const uploadData = new FormData();

    uploadData.append('file', file);
    uploadData.append('upload_preset', 'uploads');
    uploadData.append('cloud_name', 'dhvgpxttr');

    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dhvgpxttr/image/upload',
        uploadData
      );
      setFormData(prev => ({ ...prev, image: response.data.secure_url }));
    } catch (error) {
      console.error('Image upload failed:', error);
      toast.error('Image upload failed');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/profile/${currentUser.user_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify({
          // full_name: formData.full_name,
          bio: formData.bio,
          location: formData.location,
          image: formData.image
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update profile');
      }

      toast.success('Profile updated successfully!');
      navigate('/home');
    } catch (err) {
      toast.error(err.message || 'An error occurred while updating your profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!currentUser) return <div className="loading">Loading...</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>Profile</h2>
        <input type="file" onChange={handleImageUpload} accept="image/*" />
        {formData.image && (
          <img src={formData.image} alt="Profile" width="200" className="profile-pic" />
        )}
      </div>

      <form onSubmit={handleSave}>
        <div className="profile-field">
          <label>Username</label>
          <input type="text" name="username" value={formData.username} disabled />
        </div>

        {/* <div className="profile-field">
          <label>Full Name</label>
          <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} />
        </div> */}

        <div className="profile-field">
          <label>Bio (About)</label>
          <textarea name="bio" rows="3" value={formData.bio} onChange={handleChange} />
        </div>

        <div className="profile-field">
          <label>Location</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} />
        </div>

        <div className="profile-field">
          <label>Email</label>
          <input type="email" name="email" value={formData.email} disabled />
        </div>

        <div className="button-group">
          <button type="submit" className="button save-button" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
          <button type="button" className="button logout-button" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
