var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipe_utils = require("./utils/recipes_utils");

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT user_id FROM users").then((users) => {
      if (users.find((x) => x.user_id === req.session.user_id)) {
        req.user_id = req.session.user_id;
        next();
      }
    }).catch(err => next(err));
  } else {
    res.sendStatus(401);
  }
});


/**
 * This path gets body with recipeId and save this recipe in the favorites list of the logged-in user
 */
router.post('/favorites', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;

    if (!recipe_id) {
      throw { status: 400, message: "Missing recipeId in request body" };
    }

    await user_utils.markAsFavorite(user_id, recipe_id);
    res.status(200).send({ message: `Recipe ${recipe_id} saved as favorite`, success: true });
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns the favorites recipes that were saved by the logged-in user
 */
router.get('/favorites', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipes_id = await user_utils.getFavoriteRecipes(user_id);

    if (!recipes_id || recipes_id.length === 0) {
      throw { status: 404, message: "No favorite recipes found" };
    }

    const recipes_id_array = recipes_id.map(element => element.recipe_id);
    const results = await recipe_utils.getMultipleRecipeDetails(recipes_id_array);
    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
});

router.post('/lastWatched', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;

    if (!recipe_id) {
      throw { status: 400, message: "Missing recipeId in request body" };
    }

    await user_utils.addToLastWatched(user_id, recipe_id);
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

router.get('/lastWatched', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const results = await user_utils.getLastWatched(user_id);

    if (results === "none") {
      throw { status: 404, message: "No recently watched recipes found" };
    }

    res.status(200).send(results);
  } catch (err) {
    next(err);
  }
});

router.post('/add-recipes', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipeData = req.body;

    if (!recipeData.title || !recipeData.instructions || !recipeData.ingredients) {
      throw { status: 400, message: "Missing required recipe fields" };
    }

    await user_utils.insertRecipe({ user_id, ...recipeData });
    res.status(201).send({ message: "Recipe created successfully", success: true });
  } catch (error) {
    next(error);
  }
});

router.get('/my-recipes', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const results = await user_utils.getUserRecipes(user_id);

    res.status(200).send({ results, success: true });
  } catch (error) {
    next(error);
  }
});

router.post('/viewed', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipeId = req.body.recipeId;

    if (!recipeId) {
      throw { status: 400, message: "Missing recipeId" };
    }

    await user_utils.addViewedRecipe(user_id, recipeId);
    res.status(201).send({ message: "Recipe view added", success: true });
  } catch (error) {
    next(error);
  }
});

router.get('/viewed', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const viewed = await user_utils.getViewedRecipes(user_id);

    res.status(200).send({ viewed });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
