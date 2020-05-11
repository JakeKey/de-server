const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

const { PRODUCT_CATEGORIES } = require("../misc");

const MIN_NUTR_PER_PRODUCT = 0;
const MAX_NUTR_PER_PRODUCT = 100;

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 80,
    trim: true,
  },
  category: {
    type: String,
    enum: PRODUCT_CATEGORIES,
  },
  nutrients: {
    proteins: {
      type: Number,
      max: MAX_NUTR_PER_PRODUCT,
      default: MIN_NUTR_PER_PRODUCT,
    },
    carbohydrates: {
      type: Number,
      max: MAX_NUTR_PER_PRODUCT,
      default: MIN_NUTR_PER_PRODUCT,
    },
    fat: {
      type: Number,
      max: MAX_NUTR_PER_PRODUCT,
      default: MIN_NUTR_PER_PRODUCT,
    },
    saturatedFat: {
      type: Number,
      max: MAX_NUTR_PER_PRODUCT,
      default: MIN_NUTR_PER_PRODUCT,
    },
    omega3: {
      type: Number,
      max: MAX_NUTR_PER_PRODUCT,
      default: MIN_NUTR_PER_PRODUCT,
    },
    omega6: {
      type: Number,
      max: MAX_NUTR_PER_PRODUCT,
      default: MIN_NUTR_PER_PRODUCT,
    },
    salt: {
      type: Number,
      max: MAX_NUTR_PER_PRODUCT,
      default: MIN_NUTR_PER_PRODUCT,
    },
    sugar: {
      type: Number,
      max: MAX_NUTR_PER_PRODUCT,
      default: MIN_NUTR_PER_PRODUCT,
    },
    energy: {
      type: Number,
      default: MIN_NUTR_PER_PRODUCT,
    },
  },
});

const Product = mongoose.model("Products", productSchema);

function validateProduct(product) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(80).required(),
    category: Joi.string().allow(...PRODUCT_CATEGORIES),
    nutrients: Joi.object({
      proteins: Joi.number()
        .min(MIN_NUTR_PER_PRODUCT)
        .max(MAX_NUTR_PER_PRODUCT),
      carbohydrates: Joi.number()
        .min(MIN_NUTR_PER_PRODUCT)
        .max(MAX_NUTR_PER_PRODUCT),
      fat: Joi.number().min(MIN_NUTR_PER_PRODUCT).max(MAX_NUTR_PER_PRODUCT),
      saturatedFat: Joi.number()
        .min(MIN_NUTR_PER_PRODUCT)
        .max(MAX_NUTR_PER_PRODUCT),
      omega3: Joi.number().min(MIN_NUTR_PER_PRODUCT).max(MAX_NUTR_PER_PRODUCT),
      omega6: Joi.number().min(MIN_NUTR_PER_PRODUCT).max(MAX_NUTR_PER_PRODUCT),
      salt: Joi.number().min(MIN_NUTR_PER_PRODUCT).max(MAX_NUTR_PER_PRODUCT),
      sugar: Joi.number().min(MIN_NUTR_PER_PRODUCT).max(MAX_NUTR_PER_PRODUCT),
      energy: Joi.number().min(MIN_NUTR_PER_PRODUCT),
    }).required(),
  });

  return schema.validate(product);
}

exports.productSchema = productSchema;
exports.Product = Product;
exports.validate = validateProduct;
