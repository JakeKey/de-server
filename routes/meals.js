const express = require("express");

const debug = require("debug")("de:meals");
const auth = require("../middleware/auth");
const { Meal, validate } = require("../models/meal");
const { Product } = require("../models/product");

const router = express.Router();

router.use(auth);

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const reqProductsIds = req.body.products.map((prod) => prod.productId);
  debug("reqProductsIds", reqProductsIds);
  const products = await Product.find({ _id: { $in: reqProductsIds } });
  debug("products in  meal", products);
  if (products.length !== req.body.products.length)
    return res.status(400).send("Invalid product");

  const productsWithQuantities = req.body.products.map((prod, i) => ({
    product: { _id: products[i]._id, name: products[i].name },
    quantity: prod.quantity,
  }));
  debug("productsWithQuantities", productsWithQuantities);
  //let product = new Product({ ...req.body });
  // product = await product.save();

  const meal = new Meal({ ...req.body, products: productsWithQuantities });

  await meal.save();

  res.send(meal);
});

module.exports = router;
