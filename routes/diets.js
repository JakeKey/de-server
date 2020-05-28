const express = require("express");
const debug = require("debug")("de:diets");

const auth = require("../middleware/auth");
const { Diet, validate } = require("../models/diet");
const { Meal } = require("../models/meal");

const router = express.Router();

router.use(auth);

router.get("/", async (req, res) => {
  const diets = await Diet.find({ ownerId: req.user._id });

  if (!diets) return res.status(204).send({ code: "DIETS_NOT_FOUND" });
  res.status(200).send(diets);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const uniqueMealsIds = [
    ...new Set(
      req.body.days
        .map((day) => day.meals)
        .reduce((pVal, cVal) => [...pVal, ...cVal])
    ),
  ];

  debug("uniqueMealsIds", uniqueMealsIds);
  const reqMeals = await Meal.find({ _id: { $in: uniqueMealsIds } });
  debug(
    "ownerIds",
    reqMeals.map((meal) => meal.ownerId),
    req.user._id
  );

  if (
    reqMeals.some((meal) => meal.ownerId.toString() !== req.user._id.toString())
  )
    return res.status(403).send({ code: "FORBIDDEN" });

  if (uniqueMealsIds.length !== reqMeals.length)
    return res.status(400).send({ code: "INVALID_MEALS" });

  const diet = new Diet({
    ...req.body,
    ownerId: req.user._id,
    days: req.body.days,
  });

  await diet.save();

  //debug("reqMeals", reqMeals);

  /*

  debug("products in meal", products);

  if (products.length !== req.body.products.length)
    return res.status(400).send("Invalid product id");

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
*/
  res.status(201).send(diet);
});

module.exports = router;
