var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");

router.get("/", (req, res) => res.send("im here"));


/**
 * This path returns a full details of a recipe by its id
 */
router.get("/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

router.get('/random', async (req, res, next) => {
  try {
    const results = await recipes_utils.getRandomRecipes(3);
    res.send(results);
  } catch (error) {
    next(error);
  }
});

router.get('/search', async (req, res, next) => {
  try {
    const {
      query = "",
      cuisine = "",
      diet = "",
      intolerances = "",
      limit = 5,
      sort = "popularity"
    } = req.query;

    const results = await recipes_utils.searchRecipes(
      query,
      cuisine,
      diet,
      intolerances,
      limit,
      sort
    );

    if (results.length === 0) {
      return res.status(404).send({ message: "No results found", success: false });
    }

    res.status(200).send(results);
  } catch (err) {
    next(err);
  }
});




module.exports = router;
