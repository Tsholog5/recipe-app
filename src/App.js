// src/App.js
import React from 'react';
import RecipeList from './Components/RecipeList';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>EMBRACE THE ART OF FLAVOR</h1>
      </header>
      <main>
        <RecipeList />
      </main>
    </div>
  );
};

export default App;
