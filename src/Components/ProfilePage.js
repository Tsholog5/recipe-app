import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css'; // Add styles if needed

const ProfilePage = () => {
  const [userData, setUserData] = useState({
    name: '',
    surname: '',
    cellNumber: '',
    email: '',
    phoneNumber: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data from API or local storage
    const fetchUserData = async () => {
      try {
        const response = await fetch('/user-data'); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        setUserData(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/update-user-data', { // Replace with your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        throw new Error('Failed to update user data');
      }
      alert('Profile updated successfully!');
    } catch (err) {
      setError(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedIn');
    navigate('/');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="profile-page">
      <h1>User Profile</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={userData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Surname:</label>
          <input
            type="text"
            name="surname"
            value={userData.surname}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Cell Number:</label>
          <input
            type="text"
            name="cellNumber"
            value={userData.cellNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Phone Number:</label>
          <input
            type="text"
            name="phoneNumber"
            value={userData.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Update Profile</button>
      </form>
      <button onClick={handleLogout} className="logout-button">Logout</button>
    </div>
  );
};

export default ProfilePage;
