var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");

router.get("/", (req, res) => res.send("im here"));


/**
 * This path returns a full details of a recipe by its id
 */
router.get('/random', async (req, res, next) => {
  try {
    const results = await recipes_utils.getRandomRecipes();
    res.send({ recipes: results });
  } catch (error) {
    next(error);
  }
});



router.get('/search', async (req, res, next) => {
  let results = {
    query : "",
      cuisine : "",
      diet : "",
      intolerances : "",
      number : 5,
      sort : "popularity"
  }
  try {
    results.query = req.query.query || "";
    results.cuisine = req.query.cuisine || "";
    results.diet = req.query.diet || "";
    results.intolerances = req.query.intolerances || "";
    results.number = req.query.number;
    results.sort = req.query.sort || "popularity";

    const searchResults = await recipes_utils.searchRecipes(
      results.query,
      results.cuisine,
      results.diet,
      results.intolerances,
      results.number,
      results.sort
    );

    if (searchResults.length === 0) {
      return res.status(404).send({ message: "No results found", success: false });
    }

    res.status(200).send(searchResults);
  } catch (err) {
    next(err);
  }
});



router.get("/details/:recipeId", async (req, res, next) => {
  try {
    if (!req.params.recipeId) {
      throw { status: 400, message: "Missing recipe ID" };
    }
    const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

router.get("/information/:recipeId", async (req, res, next) => {
  try {
    if (!req.params.recipeId) {
      throw { status: 400, message: "Missing recipe ID" };
    }
    const recipe = await recipes_utils.getRecipeInformation(req.params.recipeId);
    res.send(recipe.data);
  } catch (error) {
    next(error);
  }
});


module.exports = router;
