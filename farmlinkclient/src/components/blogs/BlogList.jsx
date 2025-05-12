import React, { useEffect, useState } from 'react';
import BlogCard from './BlogCard';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const BlogList = () => {
  const [loading, setLoading] = useState(false);
  const API_URL = "https://farmlink-server-bhlp.onrender.com";
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/blogs`);
      const data = response.data;
      
      // Sort blogs by creation date in descending order (most recent first)
      const sortedBlogs = data.sort((a, b) => {
        const dateA = new Date(a.created_at || 0);
        const dateB = new Date(b.created_at || 0);
        return dateB.getTime() - dateA.getTime();
      });
      
      setBlogs(sortedBlogs);
    } catch (error) {
      toast.error('Cannot fetch blogs');
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (id) => {
    try {
      await axios.delete(`${API_URL}/blogs/${id}`);
      toast.success('Blog deleted successfully');
      await fetchBlogs();
    } catch (error) {
      toast.error(error.message || 'Error deleting blog');
    }
  };

  // Filter blogs based on search term
  const filteredBlogs = blogs?.filter(blog => 
    !searchTerm || 
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (blog.content && blog.content.toLowerCase().includes(searchTerm.toLowerCase())) ||
    blog.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Header section */}
      <div className="bg-green-700 text-white py-8 mb-8 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Agricultural Blogs</h1>
              <p className="text-green-100">Discover farming insights and knowledge</p>
            </div>
            <Link
              to="/blogs/create"
              className="mt-4 md:mt-0 bg-white text-green-700 px-6 py-2 rounded-md font-medium hover:bg-green-100 transition-colors duration-300 flex items-center justify-center max-w-xs"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New Blog
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Search section */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="relative flex-grow max-w-lg mx-auto">
            <input
              type="text"
              placeholder="Search blogs..."
              className="w-full border border-gray-300 rounded-md py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Blog listing section */}
        <div className="max-w-4xl mx-auto">
          {filteredBlogs && filteredBlogs.length > 0 ? (
            <div className="space-y-6">
              {filteredBlogs.map(blog => (
                <div key={blog.id} className="bg-white rounded-lg shadow-md">
                  <BlogCard 
                    blog={blog} 
                    onBlogLike={fetchBlogs} 
                    deleteBlog={() => deleteBlog(blog.id)} 
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <p className="text-gray-500 text-lg">
                {searchTerm ? 'No blogs found matching your search.' : 'No blogs found. Be the first to create one!'}
              </p>
              <Link
                to="/blogs/create"
                className="mt-6 inline-block bg-green-600 text-white px-6 py-2 rounded-md font-medium hover:bg-green-700 transition-colors duration-300"
              >
                Create a Blog
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogList;