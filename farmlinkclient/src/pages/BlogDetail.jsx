import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import NavBar from '../components/common/NavBar';
import { likeBlog, addComment, deleteComment } from '../redux/slices/blogSlice';

const BlogDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  
  // Get blogs from Redux store
  const blogs = useSelector(state => state.blogs.blogs);
  const blogStatus = useSelector(state => state.blogs.status);
  const likedBlogs = useSelector(state => state.blogs.likedBlogs);

  useEffect(() => {
    if (blogStatus === 'succeeded') {
      // Try to find the blog by ID
      // First try with the ID as a number (parseInt)
      let foundBlog = blogs.find(blog => blog.id === parseInt(id));
      
      // If not found, try with the ID as a string
      if (!foundBlog) {
        foundBlog = blogs.find(blog => blog.id === id || blog.id.toString() === id);
      }
      
      setBlog(foundBlog);
      setLoading(false);
    }
  }, [id, blogs, blogStatus]);

  // Format date to be more readable
  const formatDate = (dateString) => {
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (e) {
      return dateString; // Return the original string if parsing fails
    }
  };

  // Get time elapsed since comment was posted
  const getTimeElapsed = (dateString) => {
    const commentDate = new Date(dateString);
    const now = new Date();
    const diffMs = now - commentDate;
    
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    
    if (diffWeeks > 0) return `${diffWeeks} ${diffWeeks === 1 ? 'week' : 'weeks'} ago`;
    if (diffDays > 0) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    if (diffHours > 0) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    if (diffMinutes > 0) return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
    return 'Just now';
  };

  // Handle like button click
  const handleLike = () => {
    dispatch(likeBlog(parseInt(id) || id));
  };

  // Handle comment submission
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      dispatch(addComment({
        blogId: parseInt(id) || id,
        commentText,
        author: 'Current User' // In a real app, get from user profile
      }));
      setCommentText('');
    }
  };

  // Handle comment deletion
  const handleDeleteComment = (commentId) => {
    dispatch(deleteComment({
      blogId: parseInt(id) || id,
      commentId
    }));
  };

  // Check if blog is liked
  const isLiked = blog && likedBlogs.includes(blog.id);

  if (loading && blogStatus !== 'succeeded') {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="container mx-auto px-4 py-8">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
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
      <NavBar />
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
                  className={`flex items-center ${isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1" fill={isLiked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>{blog.likes}</span>
                </button>
                <div className="flex items-center text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>{blog.comments}</span>
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
            <div className="mt-10">
              <h2 className="text-xl font-bold mb-4">Comments ({blog.comments})</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <form onSubmit={handleCommentSubmit} className="flex space-x-4 mb-6">
                  <textarea 
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                    placeholder="Add a comment..."
                    rows="3"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    required
                  />
                  <button 
                    type="submit" 
                    className="h-12 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded self-start"
                  >
                    Post
                  </button>
                </form>
                
                <div className="space-y-4">
                  {/* Real comments from blog.commentList */}
                  {blog.commentList && blog.commentList.length > 0 ? (
                    blog.commentList.map(comment => (
                      <div key={comment.id} className="flex">
                        <div className="mr-3 flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center justify-between mb-1">
                            <div>
                              <span className="font-medium mr-2">{comment.author}</span>
                              <span className="text-sm text-gray-500">{getTimeElapsed(comment.date)}</span>
                            </div>
                            {comment.author === 'Current User' && (
                              <button 
                                onClick={() => handleDeleteComment(comment.id)}
                                className="text-gray-400 hover:text-red-500"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            )}
                          </div>
                          <p className="text-gray-700">{comment.text}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-6">
                      No comments yet. Be the first to comment!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;