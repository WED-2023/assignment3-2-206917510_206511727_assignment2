const e = require("express");
const DButils = require("./DButils");

async function markAsFavorite(user_id, recipe_id){
    await DButils.execQuery(`insert into FavoriteRecipes values ('${user_id}',${recipe_id})`);
}

async function getFavoriteRecipes(user_id) {
  const tableCheck = await DButils.execQuery(`SHOW TABLES LIKE 'FavoriteRecipes'`);
  if (tableCheck.length === 0) {
    return null; 
  }

  
  const recipes_id = await DButils.execQuery(`
    SELECT recipe_id FROM FavoriteRecipes WHERE user_id='${user_id}'
  `);

  if (!recipes_id || recipes_id.length === 0) {
    return null;  
  }

  return recipes_id; 
}


async function addToLastWatched(user_id, new_recipe_id) {
  const result = await DButils.execQuery(`
    SELECT recipe_id1, recipe_id2, recipe_id3
    FROM LastWatchedRecipes
    WHERE user_id = ${user_id}
  `);

  if (result.length === 0) {
    // No entry yet, insert a new row
    await DButils.execQuery(`
      INSERT INTO LastWatchedRecipes (user_id, recipe_id1)
      VALUES (${user_id}, ${new_recipe_id})
    `);
  } else {
    const { recipe_id1, recipe_id2, recipe_id3 } = result[0];

    // If recipe is already in the list, remove it before re-adding (optional enhancement)
    const list = [recipe_id1, recipe_id2, recipe_id3].filter(r => r !== null && r !== new_recipe_id);

    // Add new recipe at the end, keep only last 3
    list.unshift(new_recipe_id); // add new to front
    const [r1, r2, r3] = list.slice(0, 3); // max 3

    await DButils.execQuery(`
      UPDATE LastWatchedRecipes
      SET recipe_id1 = ${r1 ?? 'NULL'},
          recipe_id2 = ${r2 ?? 'NULL'},
          recipe_id3 = ${r3 ?? 'NULL'}
      WHERE user_id = ${user_id}
    `);
  }
}

async function getLastWatched(user_id) {
  const result = await DButils.execQuery(`
    SELECT recipe_id1, recipe_id2, recipe_id3
    FROM LastWatchedRecipes
    WHERE user_id = ${user_id}
  `);

  // User not found in table
  if (result.length === 0) {
    return "none";
  }

  // Extract recipe IDs and filter out nulls
  const { recipe_id1, recipe_id2, recipe_id3 } = result[0];
  const watched = [recipe_id1, recipe_id2, recipe_id3].filter(id => id !== null);

  if (watched.length === 0) {
    return "none";
  }

  return watched;
}

async function insertRecipe({
  user_id,
  title,
  image,
  readyInMinutes,
  popularity,
  vegan,
  vegetarian,
  glutenFree,
  instructions,
  ingredients
}) {
  await DButils.execQuery(`
    INSERT INTO userrecipes (
      user_id, title, image, readyInMinutes, popularity,
      vegan, vegetarian, glutenFree, instructions, ingredients
    ) VALUES (
      '${user_id}', '${title}', '${image}', ${readyInMinutes}, ${popularity || 0},
      ${vegan ? 1 : 0}, ${vegetarian ? 1 : 0}, ${glutenFree ? 1 : 0},
      '${instructions}', '${ingredients}'
    )
  `);
}

async function getUserRecipes(user_id) {
  const recipes = await DButils.execQuery(`
    SELECT title, image, readyInMinutes, popularity, vegan, vegetarian, glutenFree
    FROM userrecipes WHERE user_id = '${user_id}'
  `);

  return recipes.map(recipe => ({
    title: recipe.title,
    image: recipe.image,
    readyInMinutes: recipe.readyInMinutes,
    popularity: recipe.popularity,
    vegan: !!recipe.vegan,
    vegetarian: !!recipe.vegetarian,
    glutenFree: !!recipe.glutenFree
  }));
}

async function addViewedRecipe(user_id, recipeId) {
  await DButils.execQuery(`
    INSERT IGNORE INTO ViewedRecipes (user_id, recipeId)
    VALUES (${user_id}, ${recipeId})
  `);
}

async function getViewedRecipes(user_id) {
  const result = await DButils.execQuery(`
    SELECT recipeId FROM ViewedRecipes WHERE user_id = ${user_id}
  `);

  return result.map(row => row.recipeId);
}

exports.addToLastWatched = addToLastWatched;
exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.getLastWatched = getLastWatched;
exports.insertRecipe = insertRecipe;
exports.getUserRecipes = getUserRecipes;
exports.addViewedRecipe = addViewedRecipe;
exports.getViewedRecipes = getViewedRecipes;
