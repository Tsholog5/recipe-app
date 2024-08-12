import React, { useEffect, useState } from 'react';
import './RecipeList.css';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
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
  const [searchQuery, setSearchQuery] = useState('');
  const [noResults, setNoResults] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRecipeId, setExpandedRecipeId] = useState(null);
  const recipesPerPage = 2;

  useEffect(() => {
    fetch('/d.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error(' Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setRecipes(data);
        setFilteredRecipes(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const results = recipes.filter(recipe =>
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRecipes(results);
      setNoResults(results.length === 0);
    } else {
      setFilteredRecipes(recipes);
      setNoResults(false);
    }
  }, [searchQuery, recipes]);

  useEffect(() => {
    setCurrentPage(1); 
  }, [filteredRecipes]);

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
    setFilteredRecipes(filteredRecipes.filter(recipe => recipe.id !== id));
  };

  const handleEditRecipe = (recipe) => {
    setNewRecipe(recipe);
    setEditMode(true);
    setCurrentRecipeId(recipe.id);
    setShowForm(true);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = filteredRecipes.slice(indexOfFirstRecipe, indexOfLastRecipe);

  const handleNextPage = () => {
    if (currentPage * recipesPerPage < filteredRecipes.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const toggleExpanded = (id) => {
    setExpandedRecipeId(expandedRecipeId === id ? null : id);
  };

  const shareRecipe = (recipe) => {
    if (navigator.share) {
      navigator.share({
        title: recipe.name,
        text: 'Check out this recipe!',
        url: window.location.href,
      }).catch(error => console.error('Error sharing:', error));
    } else {
      alert('Web Share API not supported in this browser.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading recipes: {error.message}</p>;

  return (
    <div>
      <h1>Recipe List</h1>
      <input
        type="text"
        placeholder="Search recipes..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="search-input"
      />
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
      {noResults && (
        <p className="no-results">Recipe not found. Please try searching for a different recipe.</p>
      )}
      <div className="recipe-container">
        {currentRecipes.map((recipe) => (
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
              {recipe.instructions.slice(0, expandedRecipeId === recipe.id ? undefined : 2).map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>
            {recipe.instructions.length > 2 && (
              <button
                className="show-more-btn"
                onClick={() => toggleExpanded(recipe.id)}
              >
                {expandedRecipeId === recipe.id ? 'Show Less' : 'Show More'}
              </button>
            )}
            <div className="recipe-buttons">
              <button onClick={() => handleEditRecipe(recipe)}>Edit Recipe</button>
              <button onClick={() => handleDeleteRecipe(recipe.id)}>Delete Recipe</button>
              <button onClick={() => shareRecipe(recipe)}>Share</button>
            </div>
          </div>
        ))}
      </div>
      <div className="redirection-buttons">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
        <button onClick={handleNextPage} disabled={currentPage * recipesPerPage >= filteredRecipes.length}>Next</button>
      </div>
    </div>
  );
};

export default RecipeList;
