const auth = require('../middleware/auth');
const debug = require('debug')('de:products');
const {Product, validate} = require('../models/product');
const express = require('express');
const router = express.Router();

router.use(auth);

router.get('/', async (req, res) => {
  const products = await Product.find();
	res.send(products);
});

router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).send('Product not found.');

	res.send(product);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  
  const product = new Product({ ...req.body });
  await product.save();

	res.send(product);
});

router.put('/:id', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const product = await Product.findByIdAndUpdate(req.params.id, {...req.body}, {new: true})

  if (!product) return res.status(404).send('Product not found.')

	res.send(product);
});

router.delete('/:id', async (req, res) => {
  const product = await Product.findByIdAndRemove(req.params.id)
 
  if (!product) return res.status(404).send('Product not found.');

	res.send(product);
});


module.exports = router;