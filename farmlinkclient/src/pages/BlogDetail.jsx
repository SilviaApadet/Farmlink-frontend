import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { likeBlog } from '../redux/slices/blogSlice';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import axios from 'axios';
import CommentSection from '../components/comments/CommentSection';

const BlogDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const state = location.state || {};
  const dispatch = useDispatch();
  const [blog, setBlog] = useState(state?.blog);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  // Add local states for optimistic UI updates
  const [localLiked, setLocalLiked] = useState(false);
  const [localLikeCount, setLocalLikeCount] = useState(0);

  const API_URL = "https://farmlink-server-bhlp.onrender.com";
  
  // Get blogs from Redux store
  const blogs = useSelector(state => state.blogs.blogs);
  const blogStatus = useSelector(state => state.blogs.status);
  const likedBlogs = useSelector(state => state.blogs.likedBlogs);

  // Fetch blog data if not provided via state
  useEffect(() => {
    const fetchBlog = async () => {
      if (!blog) {
        try {
          setLoading(true);
          const response = await axios.get(`${API_URL}/blogs/${id}`);
          setBlog(response.data);
        } catch (error) {
          console.error("Error fetching blog:", error);
          toast.error("Failed to load blog");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    
    fetchBlog();
  }, [id, blog, API_URL]);

  // Update local state when blog data or Redux state changes
  useEffect(() => {
    if (blog) {
      const isLiked = likedBlogs.includes(blog.id);
      setLocalLiked(isLiked);
      setLocalLikeCount(blog.likes || 0);
    }
  }, [blog, likedBlogs]);

  // Format date to be more readable
  const formatDate = (dateString) => {
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (e) {
      return dateString; // Return the original string if parsing fails
    }
  };

  // Handle like button click with optimistic updates
  const handleLike = async () => {
    if (!currentUser) {
      toast.error("Please login to like posts");
      return;
    }

    // Optimistically update local UI state
    setLocalLiked(!localLiked);
    setLocalLikeCount(prevCount => localLiked ? prevCount - 1 : prevCount + 1);
    
    try {
      // Call API to like blog
      const response = await axios.post(`${API_URL}/blogs/${id}/like`, {
        user_id: currentUser?.user_id
      });
      
      // Update Redux store
      if (!localLiked) {
        dispatch({ type: 'ADD_LIKED_BLOG', payload: parseInt(id) || id });
      } else {
        dispatch({ type: 'REMOVE_LIKED_BLOG', payload: parseInt(id) || id });
      }
      
      // Update full blog object
      setBlog(prev => ({
        ...prev,
        likes: localLiked ? (prev.likes || 1) - 1 : (prev.likes || 0) + 1
      }));
      
      toast.success(response.data?.message || "Blog like updated!");
    } catch (error) {
      console.error("Error liking blog:", error);
      toast.error("Failed to update like status");
      
      // Revert optimistic update on error
      setLocalLiked(!localLiked);
      setLocalLikeCount(prevCount => localLiked ? prevCount + 1 : prevCount - 1);
    }
  };

  // Handle comment added
  const handleCommentAdded = (newComment) => {
    setBlog(prev => ({
      ...prev,
      commentList: [...(prev.commentList || []), newComment],
      comments: ((prev.comments || 0) + 1)
    }));
  };

  // Handle comment deleted
  const handleCommentDeleted = (commentId) => {
    setBlog(prev => ({
      ...prev,
      commentList: (prev.commentList || []).filter(c => c.id !== commentId),
      comments: Math.max((prev.comments || 0) - 1, 0)
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-4">Blog not found</h1>
          <Link to="/" className="text-green-600 hover:text-green-800">
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="relative h-64 sm:h-80 md:h-96">
            <img 
              src={blog.image} 
              alt={blog.title} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold uppercase">{blog.title}</h1>
                <div className="flex items-center mt-2 text-sm text-gray-600">
                  <span className="mr-4">By {blog.author}</span>
                  <span>{formatDate(blog.date)}</span>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <button 
                  onClick={handleLike}
                  className={`flex items-center space-x-2 transition-colors duration-200 ${localLiked ? 'text-red-500' : 'text-gray-600 hover:text-green-600'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1" fill={localLiked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>{localLikeCount}</span>
                </button>
                <div className="flex items-center text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>{blog.comments || 0}</span>
                </div>
              </div>
            </div>
            
            <div className="prose max-w-none">
              {blog.content ? (
                <p className="text-gray-700">{blog.content}</p>
              ) : (
                <p className="text-gray-700">{blog.summary}</p>
              )}
              
              {/* If there's no content, add placeholder paragraphs */}
              {!blog.content && (
                <>
                  <p className="mt-4 text-gray-700">
                    Farmers worldwide are increasingly moving away from chemical pesticides, driven by a convergence of environmental, economic, and market factors. This shift represents a significant transformation in agricultural practices that have dominated for decades. Environmental concerns stand at the forefront.
                  </p>
                  <p className="mt-4 text-gray-700">
                    Studies have demonstrated that chemical pesticides can contaminate water sources, harm wildlife, reduce biodiversity, and contribute to soil degradation. As farmers witness these impacts firsthand on their land, many are reconsidering traditional pest management approaches in favor of more sustainable alternatives.
                  </p>
                  <p className="mt-4 text-gray-700">
                    Consumer demand for organic and pesticide-free products continues to grow globally. Market research indicates that consumers are increasingly willing to pay premium prices for products they perceive as healthier and more environmentally friendly. This market pressure has incentivized farmers to explore alternative pest management strategies.
                  </p>
                  <p className="mt-4 text-gray-700">
                    Regenerative agricultural practices, such as crop rotation, cover cropping, and biological pest control, are gaining traction as viable alternatives to chemical pesticides. These approaches not only address pest management but also contribute to overall soil health and ecosystem resilience.
                  </p>
                </>
              )}
            </div>
            
            {/* Comments section */}
            <CommentSection 
              blogId={id}
              comments={blog.commentList || []}
              currentUser={currentUser}
              onCommentAdded={handleCommentAdded}
              onCommentDeleted={handleCommentDeleted}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;