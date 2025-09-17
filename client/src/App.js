import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PublicProfile from './pages/PublicProfile';
import PublicCategory from './pages/PublicCategory';
import BakingCalculator from './components/BakingCalculator'; // Add this import

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/calculator" element={ // Add this route
              <PrivateRoute>
                <BakingCalculator />
              </PrivateRoute>
            } />
            <Route path="/:username" element={<PublicProfile />} />
            <Route path="/:username/:categorySlug" element={<PublicCategory />} />
            <Route path="/" element={<PublicProfile />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;