import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RecipeList.css';

const RecipeList = () => {
  const [recipesByCategory, setRecipesByCategory] = useState({});
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentRecipeId, setCurrentRecipeId] = useState(null);
  const [newRecipe, setNewRecipe] = useState({
    name: '',
    image: '',
    servings: '',
    category: '',
    prepTime: '',
    ingredients: [{ item: '', quantity: '' }],
    instructions: [''],
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [noResults, setNoResults] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRecipeId, setExpandedRecipeId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: '',
    surname: '',
    cellNumber: '',
    email: '',
    phoneNumber: '',
  });

  const recipesPerPage = 3;
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/d.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        const categorizedRecipes = data.reduce((acc, recipe) => {
          const { category } = recipe;
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(recipe);
          return acc;
        }, {});
        setRecipesByCategory(categorizedRecipes);
        setFilteredRecipes(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let results = [];
    if (searchQuery) {
      results = Object.values(recipesByCategory).flat().filter(recipe =>
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else {
      results = Object.values(recipesByCategory).flat();
    }
    if (selectedCategory !== 'All') {
      results = results.filter(recipe =>
        recipe.category === selectedCategory
      );
    }
    setFilteredRecipes(results);
    setNoResults(results.length === 0);
  }, [searchQuery, recipesByCategory, selectedCategory]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredRecipes]);

  const handleAddRecipe = () => {
    if (editMode) {
      setRecipesByCategory(prevCategories => {
        const updatedCategories = { ...prevCategories };
        const updatedCategory = updatedCategories[newRecipe.category].map(recipe =>
          recipe.id === currentRecipeId ? { ...newRecipe, id: currentRecipeId } : recipe
        );
        updatedCategories[newRecipe.category] = updatedCategory;
        return updatedCategories;
      });
      setEditMode(false);
      setCurrentRecipeId(null);
    } else {
      setRecipesByCategory(prevCategories => {
        const updatedCategories = { ...prevCategories };
        if (!updatedCategories[newRecipe.category]) {
          updatedCategories[newRecipe.category] = [];
        }
        updatedCategories[newRecipe.category].push({ ...newRecipe, id: Date.now() });
        return updatedCategories;
      });
    }
    setShowForm(false);
    setNewRecipe({
      name: '',
      image: '',
      servings: '',
      category: '',
      prepTime: '',
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
    setRecipesByCategory(prevCategories => {
      const updatedCategories = { ...prevCategories };
      const updatedCategory = updatedCategories[newRecipe.category].filter(recipe => recipe.id !== id);
      updatedCategories[newRecipe.category] = updatedCategory;
      return updatedCategories;
    });
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

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setUserProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    console.log('User Profile:', userProfile);
    setShowProfileForm(false);
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

  const handleLogout = () => {
    localStorage.removeItem('loggedIn');
    navigate('/');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading recipes: {error.message}</p>;

  // Create a list of categories including "All"
  const categories = ['All', ...Object.keys(recipesByCategory)];

  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);

  return (
    <div>
      <div className="header">
        <h1>Recipe List</h1>
        <div className="header-buttons">
          <button className="profile-button" onClick={() => setShowProfileForm(!showProfileForm)}>
            Profile
          </button>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
      </div>
      <input
        type="text"
        placeholder="Search recipes..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="search-input"
      />
      <div className="filters">
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Recipe'}
        </button>
      </div>
      <div className="category-buttons">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-button ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => handleCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>
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
              <label>
                Servings:
                <input
                  type="text"
                  name="servings"
                  value={newRecipe.servings}
                  onChange={handleInputChange}
                />
              </label>
            </div>
            <div>
              <label>
                Category:
                <input
                  type="text"
                  name="category"
                  value={newRecipe.category}
                  onChange={handleInputChange}
                />
              </label>
            </div>
            <div>
              <label>
                Preparation Time:
                <input
                  type="text"
                  name="prepTime"
                  value={newRecipe.prepTime}
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
            <p><strong>Servings:</strong> {recipe.servings}</p>
            <p><strong>Category:</strong> {recipe.category}</p>
            <p><strong>Preparation Time:</strong> {recipe.prepTime}</p>
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
      <div className="pagination-buttons">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            className={`page-button ${currentPage === index + 1 ? 'active' : ''}`}
          >
            {index + 1}
          </button>
        ))}
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
      </div>
      {showProfileForm && (
        <div className="profile-form">
          <h2>User Profile</h2>
          <form onSubmit={handleProfileSubmit}>
            <div>
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={userProfile.name}
                  onChange={handleProfileChange}
                  required
                />
              </label>
            </div>
            <div>
              <label>
                Surname:
                <input
                  type="text"
                  name="surname"
                  value={userProfile.surname}
                  onChange={handleProfileChange}
                  required
                />
              </label>
            </div>
            <div>
              <label>
                Cell Number:
                <input
                  type="text"
                  name="cellNumber"
                  value={userProfile.cellNumber}
                  onChange={handleProfileChange}
                  required
                />
              </label>
            </div>
            <div>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={userProfile.email}
                  onChange={handleProfileChange}
                  required
                />
              </label>
            </div>
            <div>
              <label>
                Phone Number:
                <input
                  type="text"
                  name="phoneNumber"
                  value={userProfile.phoneNumber}
                  onChange={handleProfileChange}
                  required
                />
              </label>
            </div>
            <button type="submit">Save Profile</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default RecipeList;
