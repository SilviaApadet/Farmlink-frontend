// src/components/common/NavBar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavBar = () => {
  const location = useLocation();
  
  return (
    <nav className="bg-gradient-to-r from-blue-400 via-purple-500 to-green-400 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo/Brand */}
        <Link to="/" className="flex items-center">
          <div className="text-white">
            {/* Simple leaf logo */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="green">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-9.23V14h4v-3.23l2.71-2.71L15.3 6.63 12 9.93 8.7 6.63 7.29 8.06 10 10.77z"/>
            </svg>
          </div>
          <span className="ml-2 text-xl font-bold text-white">FarmLink</span>
        </Link>
        
        {/* Main Navigation */}
        <div className="hidden md:flex space-x-8">
          <Link 
            to="/blogs" 
            className={`font-bold uppercase ${location.pathname.startsWith('/blogs') ? 'text-green-900' : 'text-white hover:text-green-100'}`}
          >
            Blogs
          </Link>
          <Link 
            to="/community" 
            className={`font-bold uppercase ${location.pathname.startsWith('/community') ? 'text-green-900' : 'text-white hover:text-green-100'}`}
          >
            Community
          </Link>
          <Link 
            to="/experts" 
            className={`font-bold uppercase ${location.pathname.startsWith('/experts') ? 'text-green-900' : 'text-white hover:text-green-100'}`}
          >
            Experts
          </Link>
          <Link 
            to="/profile" 
            className={`font-bold uppercase ${location.pathname.startsWith('/profile') ? 'text-green-900' : 'text-white hover:text-green-100'}`}
          >
            Profile
          </Link>
        </div>

        {/* Actions */}
        <div className="flex space-x-6">
          <Link 
            to="/blogs/create" 
            className="text-white hover:text-green-100 font-bold uppercase"
          >
            Create
          </Link>
          <button className="text-white hover:text-green-100 font-bold uppercase">
            Log Out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;