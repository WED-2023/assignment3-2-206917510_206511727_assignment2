const e = require("express");
const DButils = require("./DButils");

async function markAsFavorite(user_id, recipe_id){
    await DButils.execQuery(`insert into FavoriteRecipes values ('${user_id}',${recipe_id})`);
}

async function getFavoriteRecipes(user_id) {
  // בדיקה אם בכלל יש טבלת favoriteRecipes
  const tableCheck = await DButils.execQuery(`SHOW TABLES LIKE 'FavoriteRecipes'`);
  if (tableCheck.length === 0) {
    return null; // טבלה לא קיימת
  }

  // שליפת המועדפים למשתמש
  const recipes_id = await DButils.execQuery(`
    SELECT recipe_id FROM FavoriteRecipes WHERE user_id='${user_id}'
  `);

  if (!recipes_id || recipes_id.length === 0) {
    return null; // אין מועדפים למשתמש
  }

  return recipes_id; // מחזיר את כל המועדפים של המשתמש
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



exports.addToLastWatched = addToLastWatched;
exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.getLastWatched = getLastWatched;
