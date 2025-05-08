// src/components/comments/Comment.jsx
import React from 'react';

const Comment = ({ comment, currentUser, onDelete, getTimeElapsed }) => {
  return (
    <div className="flex mb-4 p-4 bg-gray-50 rounded-lg">
      <div className="mr-3 flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
          <span className="text-gray-600 text-sm">
            {comment.author.charAt(0).toUpperCase()}
          </span>
        </div>
      </div>
      <div className="flex-grow">
        <div className="flex items-center justify-between mb-1">
          <div>
            <span className="font-medium mr-2">{comment.author}</span>
            <span className="text-sm text-gray-500">
              {getTimeElapsed(comment.date)}
            </span>
          </div>
          {comment.author === currentUser && (
            <button 
              onClick={() => onDelete(comment.id)}
              className="text-gray-400 hover:text-red-500 transition-colors"
              aria-label="Delete comment"
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
  );
};

export default Comment;