import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Components/Login';
import Register from './Components/Register';
import RecipeList from './Components/RecipeList';
import ProfilePage from './Components/ProfilePage'; // Correct import here
import PrivateRoute from './Components/PrivateRoute';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recipes" element={<PrivateRoute element={<RecipeList />} />} />
        <Route path="/profile" element={<PrivateRoute element={<ProfilePage />} />} /> {/* Ensure correct route */}
      </Routes>
    </Router>
  );
};

export default App;
