import React, { useState, useRef } from 'react';

const DirectCreateBlog = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          setImage(file);
          const reader = new FileReader();
          reader.onload = () => {
            setImagePreview(reader.result);
          };
          reader.readAsDataURL(file);
          break;
        }
      }
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Navigation Bar */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 30px',
        backgroundColor: 'white',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div>
          <span style={{ fontWeight: 'bold', fontSize: '20px', color: '#4CAF50' }}>FarmLink</span>
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <a href="/create" style={{ color: '#4CAF50', fontWeight: 'bold', textDecoration: 'none' }}>CREATE</a>
          <a href="#" style={{ color: '#333', textDecoration: 'none' }}>LOG OUT</a>
          <a href="/blogs" style={{ color: '#333', textDecoration: 'none' }}>BLOGS</a>
          <a href="/community" style={{ color: '#333', textDecoration: 'none' }}>COMMUNITY</a>
          <a href="/experts" style={{ color: '#333', textDecoration: 'none' }}>EXPERTS</a>
          <a href="/profile" style={{ color: '#333', textDecoration: 'none' }}>PROFILE</a>
        </div>
      </div>

      {/* Create Blog Form */}
      <div style={{ 
        maxWidth: '800px',
        margin: '30px auto',
        padding: '25px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Create New Blog Post</h1>
        
        <div onPaste={handlePaste}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your blog title"
              style={{ 
                width: '100%',
                padding: '10px',
                fontSize: '16px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your blog content here..."
              style={{ 
                width: '100%',
                padding: '10px',
                fontSize: '16px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                minHeight: '250px'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Blog Image</label>
            <div style={{ 
              border: '2px dashed #ddd',
              padding: '20px',
              borderRadius: '4px',
              backgroundColor: '#f9f9f9',
              textAlign: 'center'
            }}>
              <div>
                <button 
                  onClick={() => fileInputRef.current.click()}
                  style={{ 
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    padding: '10px 15px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Choose Image
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                <p style={{ marginTop: '10px', color: '#666', fontSize: '14px' }}>
                  Or paste an image directly into the form (Ctrl+V)
                </p>
              </div>
              
              {imagePreview && (
                <div style={{ marginTop: '20px' }}>
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    style={{ 
                      maxWidth: '100%',
                      maxHeight: '250px',
                      borderRadius: '4px'
                    }} 
                  />
                  <button 
                    onClick={() => {
                      setImage(null);
                      setImagePreview(null);
                    }}
                    style={{ 
                      backgroundColor: '#ff5252',
                      color: 'white',
                      border: 'none',
                      padding: '8px 15px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginTop: '10px'
                    }}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '30px'
          }}>
            <button 
              onClick={() => window.history.back()}
              style={{ 
                backgroundColor: '#f5f5f5',
                color: '#333',
                border: '1px solid #ddd',
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Cancel
            </button>
            <button 
              onClick={() => {
                console.log('Publishing blog:', { title, content, image });
                alert('Blog published successfully!');
                // Redirect or handle submission
              }}
              style={{ 
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Publish Blog
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectCreateBlog;