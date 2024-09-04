const express = require("express");
const Recipe = require("../models/RecipeModel");
const User = require("../models/UserModel");
const authController = require("../controllers/authController");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.status(200).json({
      recipes,
    });
  } catch (error) {
    res.json(error);
  }
});

router.post("/", authController.verifyToken, async (req, res) => {
  try {
    const newRecipe = await Recipe.create(req.body);

    res.status(201).json({
      status: "Succes",
      data: newRecipe,
    });
  } catch (error) {
    res.json(error);
  }
});

router.put("/", authController.verifyToken, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.body.recipeId);
    const user = await User.findById(req.body.userId);

    if (!user) return;

    user.savedRecipes.push(recipe);
    await user.save();

    res.status(201).json({
      savedRecipes: user.savedRecipes,
    });
  } catch (error) {
    res.json(error);
  }
});

router.get("/savedRecipes/ids/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    res.status(201).json({
      savedRecipes: user?.savedRecipes,
    });
  } catch (error) {
    res.json(error);
  }
});

router.get("/savedRecipes/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    const savedRecipes = await Recipe.find({
      _id: { $in: user.savedRecipes },
    });

    res.status(201).json({
      savedRecipes,
    });
  } catch (error) {
    res.json(error);
  }
});

module.exports = router;
