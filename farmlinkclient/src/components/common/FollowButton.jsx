import React, { useState } from 'react';
import Chatbox from './Chatbox';

// Props: currentUserId (logged-in user), recipientId (user to message)
const FollowButton = ({ currentUserId, recipientId }) => {
  const [isFollowed, setIsFollowed] = useState(false);
  const [showChatbox, setShowChatbox] = useState(false);

  const handleFollowClick = () => {
    setIsFollowed(prev => !prev);
    setShowChatbox(false);
  };

  const handleMessageClick = () => {
    if (isFollowed) {
      setShowChatbox(true);
      console.log('Opening chat');
    }
  };

  const closeChatbox = () => {
    setShowChatbox(false);
  };

  return (
    <div className="relative">
      {!isFollowed ? (
        <button
          onClick={handleFollowClick}
          className="px-4 py-2 rounded text-white font-semibold transition duration-300 bg-green-600 hover:bg-green-700"
        >
          Follow
        </button>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={handleFollowClick}
            className="px-4 py-2 rounded text-white font-semibold transition duration-300 bg-gray-600"
          >
            Unfollow
          </button>

          <button
            onClick={handleMessageClick}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition duration-300"
          >
            Message
          </button>
        </div>
      )}

      {showChatbox && (
        <Chatbox
          onClose={closeChatbox}
          currentUserId={currentUserId}
          recipientId={recipientId}
        />
      )}
    </div>
  );
};

export default FollowButton;
