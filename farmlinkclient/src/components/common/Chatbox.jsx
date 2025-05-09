import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Chatbox = ({ currentUserId, recipientId }) => {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const chatRef = useRef(null);

  const api = 'http://localhost:5000/api/v1/messages';

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await axios.get(api);

      if (!Array.isArray(res.data)) {
        throw new Error("Unexpected response format");
      }

      const userMessages = res.data.filter(
        (msg) =>
          (msg.sender_id === currentUserId && msg.recipient_id === recipientId) ||
          (msg.sender_id === recipientId && msg.recipient_id === currentUserId)
      );

      setMessages(userMessages);
      setLoading(false);

      // Mark unread messages as read
      userMessages.forEach(async (msg) => {
        if (!msg.is_read && msg.recipient_id === currentUserId) {
          await axios.put(`${api}/${msg.message_id}/read`);
        }
      });
    } catch (err) {
      console.error('Failed to fetch messages', err);
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!content.trim()) return;

    const newMessage = {
      sender_id: currentUserId,
      recipient_id: recipientId,
      content,
    };

    // Optimistic message
    const tempMessage = {
      ...newMessage,
      message_id: Date.now(), // temporary ID
      created_at: new Date().toISOString(),
      is_read: false,
    };

    setMessages((prev) => [...prev, tempMessage]);
    setContent('');

    try {
      const res = await axios.post(api, newMessage);

      // Replace temp message with actual one
      setMessages((prev) =>
        [...prev.filter(msg => msg.message_id !== tempMessage.message_id), res.data]
      );
    } catch (err) {
      if (
        err.code === 'ERR_CONNECTION_REFUSED' ||
        err.response?.status === 404
      ) {
        console.warn('Server unavailable, message shown locally only.');
      } else {
        console.error('Failed to send message:', err);
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.chatBox} ref={chatRef}>
        {loading ? (
          <p>Loading messages...</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.message_id}
              style={{
                ...styles.message,
                alignSelf: msg.sender_id === currentUserId ? 'flex-end' : 'flex-start',
                backgroundColor: msg.sender_id === currentUserId ? '#dcf8c6' : '#fff',
              }}
            >
              {msg.content}
              {!msg.message_id.toString().startsWith('server_') && (
                <span style={styles.timestamp}>
                  {new Date(msg.created_at).toLocaleTimeString()}
                </span>
              )}
            </div>
          ))
        )}
      </div>
      <div style={styles.inputRow}>
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.sendBtn}>Send</button>
      </div>
    </div>
  );
};

// Basic inline styles
const styles = {
  container: {
    width: '100%',
    maxWidth: 500,
    border: '1px solid #ccc',
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'column',
    height: 400,
    margin: 'auto',
  },
  chatBox: {
    flex: 1,
    padding: 10,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f0f0f0',
  },
  message: {
    padding: '8px 12px',
    margin: '5px 0',
    borderRadius: 8,
    maxWidth: '70%',
    position: 'relative',
  },
  timestamp: {
    fontSize: 10,
    color: '#888',
    marginLeft: 8,
  },
  inputRow: {
    display: 'flex',
    padding: 10,
    borderTop: '1px solid #ccc',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    padding: 8,
    borderRadius: 4,
    border: '1px solid #ccc',
    marginRight: 8,
  },
  sendBtn: {
    padding: '8px 16px',
    borderRadius: 4,
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  },
};

export default Chatbox;
