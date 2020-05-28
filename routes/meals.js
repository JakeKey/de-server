const express = require("express");
const debug = require("debug")("de:meals");

const auth = require("../middleware/auth");
const { Meal, validate } = require("../models/meal");
const { Product } = require("../models/product");

const { sumNutrients } = require("../misc");

const router = express.Router();

router.use(auth);

router.get("/", async (req, res) => {
  if (req.query.category) {
    const meals = await Meal.find({
      ownerId: req.user._id,
      category: req.query.category,
    });
    if (!meals) return res.status(204).send({ code: "MEALS_NOT_FOUND" });
    res.status(200).send(meals);
  } else {
    const meals = await Meal.find({ ownerId: req.user._id });
    if (!meals) return res.status(204).send({ code: "MEALS_NOT_FOUND" });
    res.status(200).send(meals);
  }
});

router.get("/categories", async (req, res) => {
  const mealCategories = await Meal.find({ ownerId: req.user._id }).distinct(
    "category"
  );
  res.status(200).send(mealCategories);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const reqProductsIds = req.body.products.map((prod) => prod.productId);
  debug("reqProductsIds", reqProductsIds);

  const products = await Product.find({ _id: { $in: reqProductsIds } }).sort(
    "_id"
  );
  debug("products in meal", products);

  if (products.length !== req.body.products.length)
    return res.status(400).send({ code: "INVALID_PRODUCT" });

  const productsWithQuantities = req.body.products
    .sort()
    .map((prod, i) => ({ product: products[i], quantity: prod.quantity }));

  debug("productsWithQuantities", productsWithQuantities);

  const nutrients = sumNutrients(productsWithQuantities);
  debug("nutrients", nutrients);

  const meal = new Meal({
    ...req.body,
    ownerId: req.user._id,
    products: productsWithQuantities.map((prod, i) => ({
      product: { _id: prod._id, name: products[i].name },
      quantity: prod.quantity,
    })),
    nutrients,
  });

  await meal.save();

  res.status(201).send(meal);
});

module.exports = router;
