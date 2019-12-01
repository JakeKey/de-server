const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 80,
    trim: true
  },
  category: {
    type: String,
    enum: ['dairy', 'preserved food', 'fish & seafood', 'meat', 'fats & oils',
      'dried fruit', 'cereal products', 'fruits', 'vegetables']
  },
  proteins: {
    type: Number,
    max: 100,
    default: 0
  },
  carbohydrates: {
    type: Number,
    max: 100,
    default: 0
  },
  fat: {
    type: Number,
    max: 100,
    default: 0
  },
  saturatedFat: {
    type: Number,
    max: 100,
    default: 0
  },
  omega3: {
    type: Number,
    max: 100,
    default: 0
  },
  omega6: {
    type: Number,
    max: 100,
    default: 0
  },
  salt: {
    type: Number,
    max: 100,
    default: 0
  },
  sugar: {
    type: Number,
    max: 100,
    default: 0
  },
  energy: Number
  
});

const Product = mongoose.model('Products', productSchema);

function validateCustomer(product) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(80).required(),
    category: Joi.string(),
    proteins: Joi.number().min(0).max(100),
    carbohydrates: Joi.number().min(0).max(100),
    fat: Joi.number().min(0).max(100),
    saturatedFat: Joi.number().min(0).max(100),
    omega3: Joi.number().min(0).max(100),
    omega6: Joi.number().min(0).max(100),
    salt: Joi.number().min(0).max(100),
    sugar: Joi.number().min(0).max(100),
    energy: Joi.number()
  });

  return schema.validate(product);
};

exports.productSchema = productSchema;
exports.Product = Product;
exports.validate = validateCustomer;