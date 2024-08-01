import React, { useEffect, useState } from 'react';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the recipes from the d.json file in the public directory
    fetch('/d.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setRecipes(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading recipes: {error.message}</p>;

  return (
    <div>
      <h1>Recipe List</h1>
      {recipes.map((recipe) => (
        <div key={recipe.id} className="recipe">
          <h2>{recipe.name}</h2>
          <h3>Ingredients</h3>
          <ul>
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{`${ingredient.item}: ${ingredient.quantity}`}</li>
            ))}
          </ul>
          <h3>Instructions</h3>
          <ol>
            {recipe.instructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
};

export default RecipeList;
