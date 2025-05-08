import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { likeBlog } from '../../redux/slices/blogSlice';

const BlogCard = ({ blog }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const likedBlogs = useSelector(state => state.blogs.likedBlogs);
  const isLiked = likedBlogs.includes(blog.id);

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
  const handleLike = (e) => {
    e.stopPropagation(); // Stop event propagation to prevent navigation
    dispatch(likeBlog(blog.id));
  };

  // Handle card click to navigate to blog detail
  const handleCardClick = () => {
    navigate(`/blogs/${blog.id}`);
  };

  return (
    <div 
      className="mb-12 border-b pb-8 cursor-pointer hover:bg-gray-50 transition-colors rounded-lg p-4" 
      onClick={handleCardClick}
    >
      <div className="flex flex-col md:flex-row md:items-start">
        <div className="flex-grow">
          <h2 className="text-2xl font-bold mb-3 uppercase">{blog.title}</h2>
          <div className="mb-4 text-sm text-gray-600">
            By {blog.author} · {formatDate(blog.date)}
          </div>
          <div className="mb-4">
            {truncateContent(blog.content)}
          </div>
          <div className="flex items-center space-x-6">
            <button 
              onClick={handleLike}
              className={`flex items-center space-x-2 ${isLiked ? 'text-red-500' : 'hover:text-green-600'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={isLiked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{blog.likes || 0}</span>
            </button>
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>{blog.comments || 0}</span>
            </div>
            <Link 
              to={`/blogs/${blog.id}`} 
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
      </div>
    </div>
  );
};

export default BlogCard;