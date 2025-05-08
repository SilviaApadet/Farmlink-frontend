import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import blogsData from '../../data/blogs.json';

// Async thunk to fetch blogs (simulating API call)
export const fetchBlogs = createAsyncThunk(
  'blogs/fetchBlogs',
  async (_, { rejectWithValue }) => {
    try {
      // Check localStorage first
      const savedBlogs = localStorage.getItem('farmlink-blogs');
      
      if (savedBlogs) {
        return JSON.parse(savedBlogs);
      }
      
      // Simulate API delay
      return new Promise((resolve) => {
        setTimeout(() => {
          // Make sure each blog has a commentList property
          const blogs = blogsData.blogs.map(blog => ({
            ...blog,
            likes: blog.likes || 0,
            comments: blog.comments || 0,
            commentList: blog.commentList || []
          }));
          resolve(blogs);
        }, 500);
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  blogs: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  likedBlogs: JSON.parse(localStorage.getItem('farmlink-liked-blogs') || '[]')
};

const blogSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    addBlog: (state, action) => {
      // Create a new blog with default values for likes and comments
      const newBlog = {
        ...action.payload,
        id: Date.now(), // Ensure unique ID
        likes: 0,
        comments: 0,
        commentList: []
      };
      
      // Add new blog to the beginning of the array
      state.blogs.unshift(newBlog);
      // Save to localStorage
      localStorage.setItem('farmlink-blogs', JSON.stringify(state.blogs));
    },
    likeBlog: (state, action) => {
      const blog = state.blogs.find(blog => blog.id === action.payload);
      if (blog) {
        // Check if blog is already liked
        const isLiked = state.likedBlogs.includes(blog.id);
        
        if (isLiked) {
          // Unlike: decrease count and remove from liked blogs
          blog.likes = Math.max(0, blog.likes - 1);
          state.likedBlogs = state.likedBlogs.filter(id => id !== blog.id);
        } else {
          // Like: increase count and add to liked blogs
          blog.likes = (blog.likes || 0) + 1;
          state.likedBlogs.push(blog.id);
        }
        
        // Save to localStorage
        localStorage.setItem('farmlink-blogs', JSON.stringify(state.blogs));
        localStorage.setItem('farmlink-liked-blogs', JSON.stringify(state.likedBlogs));
      }
    },
    addComment: (state, action) => {
      const { blogId, commentText, author } = action.payload;
      const blog = state.blogs.find(blog => 
        blog.id === blogId || blog.id === parseInt(blogId) || blog.id.toString() === blogId
      );
      
      if (blog) {
        // Initialize commentList array if it doesn't exist
        if (!blog.commentList) {
          blog.commentList = [];
        }
        
        // Create a new comment
        const newComment = {
          id: Date.now(), // Use timestamp as a simple ID
          text: commentText,
          author: author || 'Current User',
          date: new Date().toISOString()
        };
        
        // Add comment to the blog
        blog.commentList.push(newComment);
        
        // Update comment count
        blog.comments = blog.commentList.length;
        
        // Save to localStorage
        localStorage.setItem('farmlink-blogs', JSON.stringify(state.blogs));
      }
    },
    deleteComment: (state, action) => {
      const { blogId, commentId } = action.payload;
      const blog = state.blogs.find(blog => 
        blog.id === blogId || blog.id === parseInt(blogId) || blog.id.toString() === blogId
      );
      
      if (blog && blog.commentList) {
        // Remove the comment
        blog.commentList = blog.commentList.filter(comment => comment.id !== commentId);
        
        // Update comment count
        blog.comments = blog.commentList.length;
        
        // Save to localStorage
        localStorage.setItem('farmlink-blogs', JSON.stringify(state.blogs));
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        
        // Ensure each blog has the necessary fields
        state.blogs = action.payload.map(blog => ({
          ...blog,
          likes: blog.likes || 0,
          comments: blog.comments || 0,
          commentList: blog.commentList || []
        }));
        
        // Save to localStorage
        localStorage.setItem('farmlink-blogs', JSON.stringify(state.blogs));
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { addBlog, likeBlog, addComment, deleteComment } = blogSlice.actions;

export default blogSlice.reducer;