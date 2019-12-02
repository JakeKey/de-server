const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const Meal = mongoose.model('Meals', new mongoose.Schema({
  name: {
    type: String,
    default: 'My Meal',
    minlength: 2,
    maxlength: 40,
    trim: true
  },
  category: {
    type: String,
    enum: ['I breakfast', 'II breakfast', 'lunch', 'snack', 'I dinner', 'II dinner']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  products: [
    {
      product: {
        type: new mongoose.Schema({
          name: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 80,
            trim: true
          }
        }),
        required: true
      },
      quantity: {
        type: Number,
        min: 1,
        max: 2000,
        required: true
      }
    }
  ]
}));

function validateMeal(meal) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(40),
    category: Joi.string(),
    createdAt: Joi.date(),
    products: Joi.array().items(
      Joi.object({
        productId: Joi.objectId().required(),
        quantity: Joi.number().min(1).max(2000).required()
      })
    ).required()
  });

  return schema.validate(meal)
}

exports.Meal = Meal;
exports.validate = validateMeal;