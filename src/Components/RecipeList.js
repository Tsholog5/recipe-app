import React, { useEffect, useState } from 'react';
import './RecipeList.css';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentRecipeId, setCurrentRecipeId] = useState(null);
  const [newRecipe, setNewRecipe] = useState({
    name: '',
    image: '',
    ingredients: [{ item: '', quantity: '' }],
    instructions: [''],
  });

  useEffect(() => {
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

  const handleAddRecipe = () => {
    if (editMode) {
      setRecipes(recipes.map((recipe) => 
        recipe.id === currentRecipeId ? { ...newRecipe, id: currentRecipeId } : recipe
      ));
      setEditMode(false);
      setCurrentRecipeId(null);
    } else {
      setRecipes([...recipes, { ...newRecipe, id: recipes.length + 1 }]);
    }
    setShowForm(false);
    setNewRecipe({
      name: '',
      image: '',
      ingredients: [{ item: '', quantity: '' }],
      instructions: [''],
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecipe((prevRecipe) => ({
      ...prevRecipe,
      [name]: value,
    }));
  };

  const handleIngredientChange = (index, e) => {
    const { name, value } = e.target;
    const newIngredients = [...newRecipe.ingredients];
    newIngredients[index][name] = value;
    setNewRecipe((prevRecipe) => ({
      ...prevRecipe,
      ingredients: newIngredients,
    }));
  };

  const handleInstructionChange = (index, e) => {
    const newInstructions = [...newRecipe.instructions];
    newInstructions[index] = e.target.value;
    setNewRecipe((prevRecipe) => ({
      ...prevRecipe,
      instructions: newInstructions,
    }));
  };

  const addIngredient = () => {
    setNewRecipe((prevRecipe) => ({
      ...prevRecipe,
      ingredients: [...prevRecipe.ingredients, { item: '', quantity: '' }],
    }));
  };

  const addInstruction = () => {
    setNewRecipe((prevRecipe) => ({
      ...prevRecipe,
      instructions: [...prevRecipe.instructions, ''],
    }));
  };

  const handleDeleteRecipe = (id) => {
    setRecipes(recipes.filter(recipe => recipe.id !== id));
  };

  const handleEditRecipe = (recipe) => {
    setNewRecipe(recipe);
    setEditMode(true);
    setCurrentRecipeId(recipe.id);
    setShowForm(true);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading recipes: {error.message}</p>;

  return (
    <div>
      <h1>Recipe List</h1>
      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : 'Add Recipe'}
      </button>
      {showForm && (
        <div className="recipe-form">
          <h2>{editMode ? 'Edit Recipe' : 'Add a New Recipe'}</h2>
          <form onSubmit={(e) => { e.preventDefault(); handleAddRecipe(); }}>
            <div>
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={newRecipe.name}
                  onChange={handleInputChange}
                  required
                />
              </label>
            </div>
            <div>
              <label>
                Image URL:
                <input
                  type="text"
                  name="image"
                  value={newRecipe.image}
                  onChange={handleInputChange}
                />
              </label>
            </div>
            <div>
              <h3>Ingredients</h3>
              {newRecipe.ingredients.map((ingredient, index) => (
                <div key={index}>
                  <label>
                    Item:
                    <input
                      type="text"
                      name="item"
                      value={ingredient.item}
                      onChange={(e) => handleIngredientChange(index, e)}
                      required
                    />
                  </label>
                  <label>
                    Quantity:
                    <input
                      type="text"
                      name="quantity"
                      value={ingredient.quantity}
                      onChange={(e) => handleIngredientChange(index, e)}
                      required
                    />
                  </label>
                </div>
              ))}
              <button type="button" onClick={addIngredient}>Add Ingredient</button>
            </div>
            <div>
              <h3>Instructions</h3>
              {newRecipe.instructions.map((instruction, index) => (
                <div key={index}>
                  <label>
                    Step {index + 1}:
                    <textarea
                      value={instruction}
                      onChange={(e) => handleInstructionChange(index, e)}
                      required
                    />
                  </label>
                </div>
              ))}
              <button type="button" onClick={addInstruction}>Add Instruction</button>
            </div>
            <button type="submit">{editMode ? 'Update Recipe' : 'Add Recipe'}</button>
          </form>
        </div>
      )}
      {recipes.map((recipe) => (
        <div key={recipe.id} className="recipe">
          <div className="recipe-header">
            <h2>{recipe.name}</h2>
            {recipe.image && <img src={recipe.image} alt={recipe.name} className="recipe-image" />}
          </div>
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
          <div className="recipe-buttons">
            <button onClick={() => handleEditRecipe(recipe)}>Edit Recipe</button>
            <button onClick={() => handleDeleteRecipe(recipe.id)}>Delete Recipe</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecipeList;
