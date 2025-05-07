// src/components/common/NavBar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavBar = () => {
  const location = useLocation();
  
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo/Brand */}
        <Link to="/" className="text-xl font-bold text-green-600">FarmLink</Link>
        
        {/* Main Navigation */}
        <div className="hidden md:flex space-x-6">
          <Link 
            to="/blogs" 
            className={`font-medium ${location.pathname.startsWith('/blogs') ? 'text-green-700' : 'text-gray-600 hover:text-green-600'}`}
          >
            BLOGS
          </Link>
          <Link 
            to="/community" 
            className={`font-medium ${location.pathname.startsWith('/community') ? 'text-green-700' : 'text-gray-600 hover:text-green-600'}`}
          >
            COMMUNITY
          </Link>
          <Link 
            to="/experts" 
            className={`font-medium ${location.pathname.startsWith('/experts') ? 'text-green-700' : 'text-gray-600 hover:text-green-600'}`}
          >
            EXPERTS
          </Link>
          <Link 
            to="/profile" 
            className={`font-medium ${location.pathname.startsWith('/profile') ? 'text-green-700' : 'text-gray-600 hover:text-green-600'}`}
          >
            PROFILE
          </Link>
        </div>

        {/* Actions */}
        <div className="flex space-x-4">
          <Link 
            to="/blogs/create" 
            className="text-green-600 hover:text-green-800 font-medium"
          >
            CREATE
          </Link>
          <button className="text-gray-600 hover:text-gray-800 font-medium">
            LOG OUT
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;