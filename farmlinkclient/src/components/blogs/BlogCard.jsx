import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const BlogCard = ({ blog, onBlogLike, deleteBlog, editBlog }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const likedBlogs = useSelector(state => state.blogs.likedBlogs);
  const isLiked = likedBlogs.includes(blog.id);
  const { currentUser } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [localLiked, setLocalLiked] = useState(isLiked);
  const [localLikeCount, setLocalLikeCount] = useState(blog.likes || 0);
  const dropdownRef = useRef(null);

  const API_URL = "https://farmlink-server-bhlp.onrender.com";

  // Update local state when Redux state changes
  useEffect(() => {
    setLocalLiked(isLiked);
  }, [isLiked]);

  // Format date to be more readable
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Truncate content if it's too long
  const truncateContent = (text, maxLength = 200) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Handle like button click
  const handleLike = async (e) => {
    e.stopPropagation(); // Stop event propagation to prevent navigation
    
    // Optimistically update local UI state
    setLocalLiked(!localLiked);
    setLocalLikeCount(prevCount => localLiked ? prevCount - 1 : prevCount + 1);
    
    // Then perform the actual API call
    await likeBlog(blog.id);
    
    // Dispatch Redux action (if your Redux is set up to handle this)
    if (!localLiked) {
      dispatch({ type: 'ADD_LIKED_BLOG', payload: blog.id });
    } else {
      dispatch({ type: 'REMOVE_LIKED_BLOG', payload: blog.id });
    }
  };

  const likeBlog = async (blogId) => {
    try {
      const response = await axios.post(`${API_URL}/blogs/${blogId}/like`, { "user_id": currentUser.user_id }, {
        headers: {
          "Content-Type": 'application/json'
        }
      });
      const res = response.data;
      onBlogLike()
      toast(res.message)
    } catch (error) {
      console.log("Error", error)
      toast(error.message)
    }
  }

  // Handle card click to navigate to blog detail
  const handleCardClick = () => {
    navigate(`/blogs/${blog.id}`, { state: { blog } });
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    setShowDropdown(false);
    await deleteBlog();
  }

  const handleEdit = (e) => {
    e.stopPropagation();
    setShowDropdown(false);
    navigate(`/blogs/create`, { state: { blog, editMode: true } });
  }

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  // Determine if the current user is the author or has edit permissions
  const canEditOrDelete = true; // Replace with your actual permission logic

  return (
    <div
      className="mb-12 border-b pb-8 cursor-pointer hover:bg-gray-50 transition-colors rounded-lg p-4 relative"
      onClick={handleCardClick}
    >
      <div className="flex flex-col md:flex-row md:items-start">
        <div className="flex-grow">
          <h2 className="text-2xl font-bold mb-3 uppercase">{blog.title}</h2>
          <div className="mb-4 text-sm text-gray-600">
            By {blog.author}
          </div>
          <div className="mb-4">
            {truncateContent(blog.content)}
          </div>
          <div className="flex items-center space-x-6">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 transition-colors duration-200 ${localLiked ? 'text-red-500' : 'text-gray-600 hover:text-green-600'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={localLiked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{localLikeCount}</span>
            </button>
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>{blog.comments || 0}</span>
            </div>
            <Link
              to={`/blogs/${blog.id}`}
              state={{
                blog
              }}
              className="text-green-600 hover:text-green-800 ml-auto"
              onClick={(e) => e.stopPropagation()} // Prevent double navigation
            >
              Read More
            </Link>
          </div>
        </div>
        {blog.image && (
          <div className="w-full md:w-1/3 md:ml-6 mt-4 md:mt-0">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-auto rounded-lg object-cover"
              style={{ maxHeight: '200px' }}
            />
          </div>
        )}
        
        {/* Three-dot menu for edit/delete */}
        {canEditOrDelete && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="p-2 ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1">
                <button
                  onClick={handleEdit}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </div>
                </button>
                <button
                  onClick={handleDelete}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </div>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogCard;