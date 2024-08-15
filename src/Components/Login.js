import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import logo from '../recipelogo.jpg'; // Adjust the path as needed

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const storedPassword = localStorage.getItem(username);
    if (storedPassword && storedPassword === password) {
      localStorage.setItem('loggedIn', true);
      navigate('/recipes'); // Redirect to the recipes page
    } else {
      alert('Invalid username or password');
    }
  };

  return (
    <div className="login-container">
      <div className="logo-container">
        <img src={logo} alt="Recipe Logo" className="logo" />
      </div>
      <form className="login-form" onSubmit={handleLogin}>
        <h1>Login</h1>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
        <p>
          Don't have an account? <a href="/register">Register here</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
