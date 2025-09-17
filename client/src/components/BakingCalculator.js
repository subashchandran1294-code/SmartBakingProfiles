import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const BakingCalculator = () => {
  const { user } = useAuth();
  const [pricingEnabled, setPricingEnabled] = useState(false);
  const [currentCurrency, setCurrentCurrency] = useState('INR');
  const [customCurrencySymbol, setCustomCurrencySymbol] = useState('');
  const [scalingMethod, setScalingMethod] = useState('panSize');
  const [ingredients, setIngredients] = useState([
    { name: '', qty: '', unit: 'grams', price: '', amount: '' }
  ]);
  const [results, setResults] = useState(null);
  
  // Constants
  const CURRENCY_SYMBOLS = {
    'INR': '₹', 'USD': '$', 'EUR': '€', 'GBP': '£', 'JPY': '¥',
    'CAD': 'C$', 'AUD': 'A$', 'CHF': 'CHF', 'CNY': '¥'
  };
  
  const EGG_WEIGHTS = {
    'small': 38, 'medium': 49, 'large': 56, 'xlarge': 63, 'jumbo': 70
  };
  
  const DEFAULT_UNITS = {
    'egg': 'pcs', 'eggs': 'pcs', 'milk': 'ml', 'cream': 'ml',
    'butter': 'grams', 'yogurt': 'grams', 'flour': 'grams',
    'sugar': 'grams', 'salt': 'grams', 'yeast': 'grams',
    'baking powder': 'tsp', 'baking soda': 'tsp', 'water': 'ml',
    'oil': 'ml', 'honey': 'ml', 'syrup': 'ml', 'vanilla': 'tsp',
    'cinnamon': 'tsp', 'nutmeg': 'tsp'
  };

  // Add a new ingredient row
  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', qty: '', unit: 'grams', price: '', amount: '' }]);
  };

  // Remove an ingredient row
  const removeIngredient = (index) => {
    if (ingredients.length > 1) {
      const newIngredients = [...ingredients];
      newIngredients.splice(index, 1);
      setIngredients(newIngredients);
    }
  };

  // Update an ingredient field
  const updateIngredient = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    
    // Auto-set unit based on ingredient name
    if (field === 'name' && !newIngredients[index].unitManuallySet) {
      const defaultUnit = getDefaultUnit(value);
      newIngredients[index].unit = defaultUnit;
    }
    
    // Mark unit as manually set if user changes it
    if (field === 'unit') {
      newIngredients[index].unitManuallySet = true;
    }
    
    setIngredients(newIngredients);
  };

  // Get default unit for ingredient
  const getDefaultUnit = (name) => {
    if (!name) return 'grams';
    
    const lowerName = name.toLowerCase();
    for (const [key, unit] of Object.entries(DEFAULT_UNITS)) {
      if (lowerName.includes(key)) return unit;
    }
    return 'grams';
  };

  // Calculate the scaled recipe
  const calculateRecipe = () => {
    // Implementation of the calculation logic from your HTML
    // This would be similar to the jQuery calculateBtn click handler
    console.log("Calculating recipe...");
  };

  // Format currency
  const formatCurrency = (amount) => {
    const symbol = currentCurrency === 'custom' 
      ? customCurrencySymbol || '₹' 
      : CURRENCY_SYMBOLS[currentCurrency] || '₹';
    return `${symbol}${amount.toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-center mb-6 text-brown-800">
            Baking Calculator
          </h2>
          
          {/* Scaling Method Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Scaling Method:
            </label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-brown-600"
                  name="scalingMethod"
                  value="panSize"
                  checked={scalingMethod === 'panSize'}
                  onChange={(e) => setScalingMethod(e.target.value)}
                />
                <span className="ml-2">Pan Size (Area)</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-brown-600"
                  name="scalingMethod"
                  value="weight"
                  checked={scalingMethod === 'weight'}
                  onChange={(e) => setScalingMethod(e.target.value)}
                />
                <span className="ml-2">Total Weight (kg)</span>
              </label>
            </div>
          </div>

          {/* Pan Size Inputs */}
          {scalingMethod === 'panSize' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Original Pan Size */}
              <div className="bg-brown-50 p-4 rounded-lg">
                <h3 className="font-medium text-brown-700 mb-2">Original Pan Size</h3>
                {/* Width, Height, and Weight inputs */}
              </div>
              
              {/* New Pan Size */}
              <div className="bg-brown-50 p-4 rounded-lg">
                <h3 className="font-medium text-brown-700 mb-2">New Pan Size</h3>
                {/* Width, Height inputs */}
              </div>
            </div>
          )}

          {/* Weight Inputs */}
          {scalingMethod === 'weight' && (
            <div className="bg-brown-50 p-4 rounded-lg mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brown-700 mb-1">
                    Original Recipe Weight (kg)
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="0.5"
                    step="0.01"
                    min="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brown-700 mb-1">
                    Desired Recipe Weight (kg)
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="1.5"
                    step="0.01"
                    min="0.01"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Ingredients List */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-700">Recipe Ingredients</h3>
              <button
                onClick={() => setPricingEnabled(!pricingEnabled)}
                className="px-3 py-2 bg-green-600 text-white rounded-md text-sm"
              >
                {pricingEnabled ? 'Hide Pricing' : 'Add Pricing'}
              </button>
            </div>

            {ingredients.map((ingredient, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 mb-2 items-center">
                <div className="col-span-4">
                  <input
                    type="text"
                    placeholder="Ingredient name"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={ingredient.name}
                    onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    placeholder="Qty"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={ingredient.qty}
                    onChange={(e) => updateIngredient(index, 'qty', e.target.value)}
                    step="0.01"
                    min="0"
                  />
                </div>
                <div className="col-span-2">
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={ingredient.unit}
                    onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                  >
                    <option value="grams">grams</option>
                    <option value="kg">kg</option>
                    <option value="ml">ml</option>
                    <option value="cups">cups</option>
                    <option value="tbsp">tbsp</option>
                    <option value="tsp">tsp</option>
                    <option value="pcs">pcs</option>
                  </select>
                </div>
                {pricingEnabled && (
                  <>
                    <div className="col-span-2">
                      <input
                        type="number"
                        placeholder="Price"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={ingredient.price}
                        onChange={(e) => updateIngredient(index, 'price', e.target.value)}
                        step="0.01"
                        min="0"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        placeholder="Amount"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={ingredient.amount}
                        onChange={(e) => updateIngredient(index, 'amount', e.target.value)}
                        step="0.01"
                        min="0"
                      />
                    </div>
                  </>
                )}
                <div className="col-span-1 flex justify-center">
                  <button
                    onClick={() => removeIngredient(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={addIngredient}
              className="mt-2 px-4 py-2 bg-brown-600 text-white rounded-md"
            >
              + Add Ingredient
            </button>
          </div>

          {/* Calculate Button */}
          <div className="flex justify-center">
            <button
              onClick={calculateRecipe}
              className="px-6 py-3 bg-brown-700 text-white rounded-md hover:bg-brown-800"
            >
              Calculate Scaled Recipe
            </button>
          </div>

          {/* Results Display */}
          {results && (
            <div className="mt-8 p-4 bg-brown-50 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Scaled Recipe Results</h3>
              {/* Display results here */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BakingCalculator;
