import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Chatbox = ({ onClose, currentUserId, recipientId }) => {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  const api = '/api/v1/messages';  // replace with you full endpoint

  const fetchMessages = async () => {
    try {
      const res = await axios.get(api);
      const userMessages = res.data.filter(
        (msg) =>
          (msg.sender_id === currentUserId && msg.recipient_id === recipientId) ||
          (msg.sender_id === recipientId && msg.recipient_id === currentUserId)
      );
      setMessages(userMessages);
      setLoading(false);

      // On marking unread messages as read
      userMessages.forEach(async (msg) => {
        if (!msg.is_read && msg.recipient_id === currentUserId) {
          await axios.put(`${api}/${msg.message_id}/read`);
        }
      });
    } catch (err) {
      console.error('Failed to fetch messages', err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const sendMessage = async () => {
    if (!content.trim()) return;

    const newMessage = {
      sender_id: currentUserId,
      recipient_id: recipientId,
      content,
    };

    try {
      // Optimistically update UI
      const tempMessage = {
        ...newMessage,
        message_id: Date.now(), 
        created_at: new Date().toISOString(),
        is_read: false,
      };

      setMessages((prev) => [...prev, tempMessage]);
      setContent('');

      const res = await axios.post(api, newMessage);

      // Replace temp message with real one (optional improvement)
      setMessages((prev) =>
        prev.map((msg) =>
          msg.message_id === tempMessage.message_id ? res.data : msg
        )
      );
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  return (
    <div className="fixed z-50 bg-white shadow-lg border rounded-md w-full h-full sm:w-96 sm:h-[500px] sm:top-5 sm:right-5 sm:rounded-xl">
      <div className="flex justify-between items-center px-4 py-2 border-b">
        <h2 className="text-lg font-semibold">Chat</h2>
        <button onClick={onClose} className="text-gray-600 hover:text-red-500 text-xl">&times;</button>
      </div>

      <div className="p-4 h-[calc(100%-130px)] overflow-y-auto">
        {loading ? (
          <p className="text-gray-500">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-gray-400">No messages yet.</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.message_id}
              className={`mb-2 p-2 rounded max-w-[80%] ${
                msg.sender_id === currentUserId ? 'bg-green-100 ml-auto text-right' : 'bg-gray-100'
              }`}
            >
              <p className="text-sm">{msg.content}</p>
              <p className="text-xs text-gray-400">{new Date(msg.created_at).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t flex gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 border rounded px-3 py-2 focus:outline-none"
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbox;
