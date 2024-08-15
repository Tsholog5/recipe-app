import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import logo from '../recipelogo.jpg'; 

const Register = () => {
  const [email, setEmail] = useState(''); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [registrationError, setRegistrationError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setRegistrationError('Passwords do not match');
      return;
    }

    
    const existingUser = localStorage.getItem(username);
    if (existingUser) {
      setRegistrationError('Username already exists');
      return;
    }

    
    const userData = { email, password };
    localStorage.setItem(username, JSON.stringify(userData));

    navigate('/'); 
  };

  return (
    <div className="register-container">
      <div className="logo-container">
        <img src={logo} alt="Recipe Logo" className="logo" />
      </div>
      <form className="register-form" onSubmit={handleRegister}>
        <h1>Register</h1>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
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
        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {registrationError && <p>{registrationError}</p>}
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
