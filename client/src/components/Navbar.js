import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-yellow-500 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-white">
            Smart Baking Profiles
          </Link>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/dashboard" className="text-white hover:text-yellow-200">
                  Dashboard
                </Link>
                <Link to="/calculator" className="text-white hover:text-yellow-200"> {/* Add this link */}
                  Calculator
                </Link>
                <span className="text-white">Hello, {user.bakeryName || user.username}</span>
                <button 
                  onClick={handleLogout}
                  className="bg-white text-yellow-500 px-4 py-2 rounded hover:bg-yellow-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white hover:text-yellow-200">
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-white text-yellow-500 px-4 py-2 rounded hover:bg-yellow-100"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;