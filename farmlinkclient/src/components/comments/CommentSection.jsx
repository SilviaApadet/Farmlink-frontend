// src/components/comments/CommentSection.jsx
import React, { useState } from 'react';
import Comments from './Comments';
import axios from 'axios';
import toast from 'react-hot-toast';

const CommentSection = ({ 
  blogId, 
  comments = [], 
  currentUser,
  onCommentAdded,
  onCommentDeleted
}) => {
  const [commentText, setCommentText] = useState('');
  const API_URL = "https://farmlink-server-bhlp.onrender.com";

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

  // Handle comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      try {
        const response = await axios.post(`${API_URL}/blogs/${blogId}/comment`, {
          content: commentText,
          user_id: currentUser.user_id
        });

        const data = response.data;
        toast(data.message);
        
        // Call the parent callback to update comments
        if (onCommentAdded) {
          onCommentAdded(data.comment || {
            id: Date.now(),
            text: commentText,
            author: currentUser.username || 'Current User',
            date: new Date().toISOString()
          });
        }
        
        setCommentText('');
      } catch (error) {
        console.error("Error adding comment:", error);
        toast.error("Failed to add comment. Please try again.");
      }
    }
  };

  // Handle comment deletion
  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`${API_URL}/blogs/${blogId}/comment/${commentId}`);
      toast.success("Comment deleted successfully");
      
      // Call the parent callback to update UI
      if (onCommentDeleted) {
        onCommentDeleted(commentId);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment. Please try again.");
    }
  };

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold mb-4">Comments ({comments.length})</h2>
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
          {comments && comments.length > 0 ? (
            comments.map(comment => (
              <Comments 
                key={comment.id}
                comment={comment}
                currentUser={currentUser?.username || 'Current User'}
                onDelete={handleDeleteComment}
                getTimeElapsed={getTimeElapsed}
              />
            ))
          ) : (
            <div className="text-center text-gray-500 py-6">
              No comments yet. Be the first to comment!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentSection;