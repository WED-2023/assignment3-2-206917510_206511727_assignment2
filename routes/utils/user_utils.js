const e = require("express");
const DButils = require("./DButils");

async function markAsFavorite(user_id, recipe_id){
    await DButils.execQuery(`insert into FavoriteRecipes values ('${user_id}',${recipe_id})`);
}

async function getFavoriteRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from FavoriteRecipes where user_id='${user_id}'`);
    return recipes_id;
}

async function addToLastWatched(user_id, recipe_id) {
  await DButils.execQuery(`
    INSERT INTO LastWatchedRecipes (user_id, recipe_id)
    VALUES ('${user_id}', ${recipe_id})
    ON DUPLICATE KEY UPDATE watched_at = CURRENT_TIMESTAMP
  `);

  // מחיקה אם יש יותר מ־3 רשומות
  await DButils.execQuery(`
    DELETE FROM LastWatchedRecipes
    WHERE user_id = '${user_id}' AND recipe_id NOT IN (
      SELECT recipe_id FROM (
        SELECT recipe_id FROM LastWatchedRecipes
        WHERE user_id = '${user_id}'
        ORDER BY watched_at DESC
        LIMIT 3
      ) AS temp
    );
  `);
}

async function getLastWatched(user_id) {
  const ids = await DButils.execQuery(`
    SELECT recipe_id FROM LastWatchedRecipes
    WHERE user_id = '${user_id}'
    ORDER BY watched_at DESC
    LIMIT 3
  `);
  const ids_array = ids.map(r => r.recipe_id);
  return await recipe_utils.getRecipesPreview(ids_array);
}


exports.addToLastWatched = addToLastWatched;
exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.getLastWatched = getLastWatched;
