// src/components/common/Layout.jsx
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Add this to get the current location
  const isWelcomePage = location.pathname === '/' || location.pathname === '/welcome';
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <div>
      {/* Only render the header/navbar if not on the welcome page */}
      {!isWelcomePage && (
        <header>
          <nav style={styles.navbar}>
            <div>
              <Link style={styles.link} to="/home">Home</Link>
              <Link style={styles.link} to="/blogs">Blogs</Link>
              <Link style={styles.link} to="/communities">Communities</Link>
              <Link style={styles.link} to="/experts">Experts</Link>
              <Link style={styles.link} to="/profile">Profile</Link>
            </div>
            <div>
              {!isLoggedIn ? (
                <>
                  <Link style={styles.link} to="/login">Login</Link>
                  <Link style={styles.link} to="/signup">Sign Up</Link>
                </>
              ) : (
                <button style={styles.logoutButton} onClick={handleLogout}>Logout</button>
              )}
            </div>
          </nav>
        </header>
      )}
      <main style={isWelcomePage ? {} : styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#4caf50',
    color: 'white',
  },
  link: {
    marginRight: '15px',
    color: 'white',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  logoutButton: {
    padding: '8px 16px',
    backgroundColor: '#dc3545',
    border: 'none',
    borderRadius: '4px',
    color: 'white',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  mainContent: {
    padding: '20px',
  },
};

export default Layout;