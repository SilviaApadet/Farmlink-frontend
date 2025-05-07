import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';  // Single import statement
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { AuthProvider } from './contexts/AuthContext';

import Layout from './components/common/Layout';
import Welcome from './pages/Welcome';
import CreateBlog from './pages/CreateBlog';
import ExpertList from './components/experts/ExpertList';
import CommunityList from './components/communities/CommunityList';
import Profile from './pages/Profile';
import BlogList from './components/blogs/BlogList';  // Updated to import BlogList
import Home from './pages/Home';  // Assuming you have a Home page
import BlogDetail from './pages/BlogDetail';  // Assuming BlogDetail exists
import Login from './pages/Login';  // Assuming Login exists
import SignUp from './pages/Signup';  // Assuming SignUp exists

// Private route component
const PrivateRoute = ({ element }) => {
  const isAuthenticated = localStorage.getItem('token') !== null;
  return isAuthenticated ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              {/* Public routes */}
              <Route index element={<Welcome />} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<SignUp />} />

              {/* Main app routes */}
              <Route path="home" element={<Home />} />
              <Route path="blogs" element={<BlogList />} />
              <Route path="blogs/create" element={<CreateBlog />} />
              <Route path="blogs/:id" element={<BlogDetail />} />
              <Route path="communities" element={<CommunityList />} />
              <Route path="experts" element={<ExpertList />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            {/* Protected routes */}
            <Route path="home" element={<PrivateRoute element={<Home />} />} />
            <Route path="blogs" element={<PrivateRoute element={<BlogList />} />} />
            <Route path="blogs/create" element={<PrivateRoute element={<CreateBlog />} />} />
            <Route path="blogs/:id" element={<BlogDetail />} />
            <Route path="communities" element={<PrivateRoute element={<CommunityList />} />} />
            <Route path="profile" element={<PrivateRoute element={<Profile />} />} />
          </Routes>
        </Router>
      </AuthProvider>
    </Provider>
  );
}

export default App;

