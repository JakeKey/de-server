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
    res.send(products);
  } else {
    const products = await Product.find();
    res.send(products);
  }
});

router.get("/categories", async (req, res) => {
  try {
    const productCategories = await Product.find().distinct("category");
    res.send(productCategories);
  } catch (ex) {
    res.status(500).send("Something went wrong");
  }
});

router.get("/:id", objectId, async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).send("Product not found.");

  res.send(product);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const product = new Product({ ...req.body });
  await product.save();

  res.send(product);
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

  res.send(product);
});

router.delete("/:id", [admin, objectId], async (req, res) => {
  const product = await Product.findByIdAndRemove(req.params.id);

  if (!product) return res.status(404).send("Product not found.");

  res.send(product);
});

module.exports = router;
