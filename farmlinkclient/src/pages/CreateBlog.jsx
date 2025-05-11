import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addBlog } from '../redux/slices/blogSlice';
import RichTextEditor from '../components/RichTextEditor.jsx';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext.jsx';
import toast from 'react-hot-toast';

const CreateBlog = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const state = location.state || {}
  const editMode = !!state?.editMode;
  const blog = state?.blog;
  const [title, setTitle] = useState(editMode ? blog.title : '');
  const [content, setContent] = useState(editMode ?  blog.content : '');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUrl, setImageUrl] = useState( editMode ? blog.imageUrl : '');
  const { currentUser } = useAuth();

  const API_URL = "https://farmlink-server-bhlp.onrender.com";


  // Handle image upload from computer
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

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

  // Handle image paste from clipboard
  const handlePaste = (e) => {
    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        setImage(blob);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(blob);
        break;
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    editMode ? await editBlog() : await createBlog();
  };

  const editBlog = async () => {
    const newBlog = {
      title,
      content,
      image: imageUrl,
      author: currentUser.username,
      user_id: currentUser.user_id,
      date: new Date().toISOString(),
      likes: 0,
      comments: 0,
    }

    try {
      const response = await fetch(`${API_URL}/blogs/${blog.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBlog)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update blog');
      }


      if (response.ok) {
        toast('Blog updated successfully!');
        navigate('/home')
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update blog');
      }

      // Redirect to blogs page after creation
      navigate('/blogs');
    } catch (err) {
      toast(err.message || 'An error occurred while updating your blog');
    }
  }

  const createBlog = async () => {
    const newBlog = {
      title,
      content,
      image: imageUrl,
      author: currentUser.username,
      user_id: currentUser.user_id,
      date: new Date().toISOString(),
      likes: 0,
      comments: 0,
    };

    try {
      const response = await fetch(`${API_URL}/blogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBlog)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create blog');
      }


      if (response.ok) {
        toast('Blog created successfully!');
        navigate('/home')
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update blog');
      }

      // Redirect to blogs page after creation
      navigate('/blogs');
    } catch (err) {
      toast(err.message || 'An error occurred while creating your blog');
    }

  }

  return (
    <div className="min-h-screen bg-green-50">
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header section similar to Canva design */}
          <div className="p-6 bg-gradient-to-r from-green-100 to-green-50 border-b border-gray-200">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white mr-3">
                <span className="text-xl">+</span>
              </div>
              <h1 className="text-2xl font-bold text-green-800">{editMode ? "Edit blog post" : "Create New Blog Post"}</h1>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6" onPaste={handlePaste}>
            {/* Title input */}
            <div className="mb-6">
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 text-xl font-bold border-b-2 border-gray-300 focus:outline-none focus:border-green-500 bg-gray-50"
                placeholder="TITLE"
                required
              />
            </div>

            {/* Image upload */}
            <div className="mb-6 flex items-center space-x-4">
              <button
                type="button"
                className="p-2 border border-gray-300 rounded hover:bg-gray-100"
                title="Add Image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>

              <button
                type="button"
                className="p-2 border border-gray-300 rounded hover:bg-gray-100"
                title="Add Image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>

              <button
                type="button"
                className="p-2 border border-gray-300 rounded hover:bg-gray-100"
                title="Add Link"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </button>

              <div className="relative ml-auto">
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label
                  htmlFor="image"
                  className="cursor-pointer"
                >
                  <div className="px-4 py-2 text-sm text-green-600 border border-green-600 rounded-md hover:bg-green-50">
                    Upload Image
                  </div>
                </label>
              </div>
            </div>

            {/* Image preview */}
            {imageUrl && (
              <div className="mb-6 relative">
                <img src={imageUrl} alt="Preview" className="max-h-64 rounded-md border border-gray-300" />
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setImageUrl(null);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  title="Remove Image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}

            {/* Content editor */}
            <div className="mb-6">
              <RichTextEditor
                value={content}
                onChange={setContent}
              />
            </div>

            {/* Action buttons */}
            <div className="flex justify-end space-x-4 mt-8">
              <button
                type="button"
                onClick={() => navigate('/blogs')}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500 text-white hover:bg-red-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <button
                type="submit"
                onClick={(e) => handleSubmit(e)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                POST
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateBlog;