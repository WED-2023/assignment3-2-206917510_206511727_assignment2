const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";



/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */


async function getRecipeInformation(recipe_id) {
    return await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
}

async function getRecipeDetails(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe_info.data;

    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        
    }
}

async function getRandomRecipes(number = 3) {
  const response = await axios.get(`${api_domain}/random`, {
    params: {
      number: number,
      apiKey: process.env.spooncular_apiKey
    }
  });

  return response.data.recipes;
}

async function searchRecipes(query, cuisine, diet, intolerances, number = 5, sort = "popularity") {
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



