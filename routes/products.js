const express = require("express");
const debug = require("debug")("de:products");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const objectId = require("../middleware/objectId");

const { Product, validate } = require("../models/product");

const router = express.Router();
router.use(auth);

router.get("/", async (req, res) => {
  if (req.query.category) {
    const products = await Product.find({ category: req.query.category });
    if (!products) return res.status(204).send({ code: "PRODUCTS_NOT_FOUND" });
    res.status(200).send(products);
  } else {
    const products = await Product.find();
    if (!products) return res.status(204).send({ code: "PRODUCTS_NOT_FOUND" });
    res.status(200).send(products);
  }
});

router.get("/categories", async (req, res) => {
  const productCategories = await Product.find().distinct("category");
  if (!productCategories)
    return res.status(204).send({ code: "CATEGORIES_NOT_FOUND" });
  res.status(200).send(productCategories);
});

router.get("/:id", objectId, async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).send("Product not found.");

  res.status(200).send(product);
});

router.post("/", admin, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const product = new Product({
    ...req.body,
  });
  await product.save();

  res.status(201).send(product);
});

router.put("/:id", [admin, objectId], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { ...req.body },
    { new: true }
  );

  if (!product) return res.status(404).send("Product not found.");

  res.status(204).send(product);
});

router.delete("/:id", [admin, objectId], async (req, res) => {
  const product = await Product.findByIdAndRemove(req.params.id);

  if (!product) return res.status(404).send("Product not found.");

  res.status(204).send(product);
});

module.exports = router;
