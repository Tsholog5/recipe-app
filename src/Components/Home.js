import React from 'react';
import Navigation from './Navigation'; 
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <h1 className="home-title">RECIPE-APP</h1>
      <Navigation /> 
    </div>
  );
}

export default Home;