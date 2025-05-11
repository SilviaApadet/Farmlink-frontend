import React, { useEffect, useState } from 'react';
import BlogCard from './BlogCard';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const BlogList = () => {
  const [loading, setLoading] = useState(false);
  const API_URL = "https://farmlink-server-bhlp.onrender.com";
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetchBlogs()
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${API_URL}/blogs`)
      const data = response.data;
      setBlogs(data)
    } catch (error) {
      toast('Cannot fetch blogs')
    }
  }

  const deleteBlog = async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/blogs/${id}`)
      const data = response.data;
      await fetchBlogs()
    } catch (error) {
      toast(error.message);
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 uppercase text-center md:text-left">Agricultural Blogs</h1>
      <Link
        to="/blogs/create"
        className="bg-green-600 text-white px-4 py-2 hover:text-green-800 font-medium"
      >
        CREATE BLOG
      </Link>
      <div className="max-w-4xl mx-auto">
        {blogs?.length > 0 ? (
          blogs?.map(blog => (
            <BlogCard key={blog.id} blog={blog} onBlogLike={fetchBlogs} deleteBlog={() => deleteBlog(blog.id)} editBlog={() => editBlog(blog.id)} />
          ))
        ) : (
          <p className="text-center text-gray-500">No blogs found.</p>
        )}
      </div>
    </div>
  );
};

export default BlogList;