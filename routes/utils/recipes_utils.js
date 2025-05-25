const axios = require("axios");
const e = require("express");
require("dotenv").config();
const api_domain = "https://api.spoonacular.com/recipes";



/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */


async function getRecipeInformation(recipe_id) {
  //console.log("🔑 API KEY IS:", process.env.spooncular_apiKey); // 👈 Check if it’s defined!
  return await axios.get(`${api_domain}/${recipe_id}/information`, {
    params: {
      includeNutrition: false,
      apiKey: process.env.spooncular_apiKey
    }
  });
}

async function getRecipeDetails(recipe_id) {
  console.log("🔍 Fetching recipe details for ID:", recipe_id);
  try {
    let recipe_info = await getRecipeInformation(recipe_id);
    //console.log("📦 API response received");

    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe_info.data;

    return {
      id,
      title,
      readyInMinutes,
      image,
      popularity: aggregateLikes,
      vegan,
      vegetarian,
      glutenFree,
    };
  } catch (error) {
    //console.error("❌ Error in getRecipeDetails:", error.response?.data || error.message);
    throw error;
  }
}

async function getMultipleRecipeDetails(recipe_ids_array) {
  const results = [];

  for (const id of recipe_ids_array) {
    const detail = await getRecipeDetails(id); // call your original function
    results.push(detail);
  }

  return results;
}


async function getRandomRecipes() {
  const response = await axios.get(`${api_domain}/random`, {
    params: {
      number: 3,
      includeNutrition: false, 
      apiKey: process.env.spooncular_apiKey,
    }
  });

  return response.data.recipes; 
}


async function searchRecipes(query, cuisine, diet, intolerances, number, sort = "popularity") {
  const response = await axios.get(`${api_domain}/complexSearch`, {
    params: {
      query,
      cuisine,
      diet,
      intolerances,
      number,
      sort,
      addRecipeInformation: true,
      apiKey: process.env.spooncular_apiKey,
    }
  });
  return response.data.results;
}


exports.searchRecipes = searchRecipes;
exports.getRecipeDetails = getRecipeDetails;
exports.getRandomRecipes = getRandomRecipes;
exports.getMultipleRecipeDetails = getMultipleRecipeDetails;
exports.getRecipeInformation = getRecipeInformation;