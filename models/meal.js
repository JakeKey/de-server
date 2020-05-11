const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

const { MEAL_CATEGORIES } = require("../misc");

const DEFAULT_NUTR_PER_MEAL = 0;
const MAX_NUTR_PER_MEAL = 100000;

const MIN_PRODUCT_QUANTITY = 0.1;
const MAX_PRODUCT_QUANTITY = 1000;

const Meal = mongoose.model(
  "Meals",
  new mongoose.Schema({
    name: {
      type: String,
      default: "My Meal",
      minlength: 1,
      maxlength: 40,
      trim: true,
      required: true,
    },
    category: {
      type: String,
      enum: MEAL_CATEGORIES,
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    nutrients: {
      proteins: {
        type: Number,
        max: MAX_NUTR_PER_MEAL,
        default: DEFAULT_NUTR_PER_MEAL,
      },
      carbohydrates: {
        type: Number,
        max: MAX_NUTR_PER_MEAL,
        default: DEFAULT_NUTR_PER_MEAL,
      },
      fat: {
        type: Number,
        max: MAX_NUTR_PER_MEAL,
        default: DEFAULT_NUTR_PER_MEAL,
      },
      saturatedFat: {
        type: Number,
        max: MAX_NUTR_PER_MEAL,
        default: DEFAULT_NUTR_PER_MEAL,
      },
      omega3: {
        type: Number,
        max: MAX_NUTR_PER_MEAL,
        default: DEFAULT_NUTR_PER_MEAL,
      },
      omega6: {
        type: Number,
        max: MAX_NUTR_PER_MEAL,
        default: DEFAULT_NUTR_PER_MEAL,
      },
      salt: {
        type: Number,
        max: MAX_NUTR_PER_MEAL,
        default: DEFAULT_NUTR_PER_MEAL,
      },
      sugar: {
        type: Number,
        max: MAX_NUTR_PER_MEAL,
        default: DEFAULT_NUTR_PER_MEAL,
      },
      energy: {
        type: Number,
        default: DEFAULT_NUTR_PER_MEAL,
      },
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
              trim: true,
            },
          }),
          required: true,
        },
        quantity: {
          type: Number,
          min: MIN_PRODUCT_QUANTITY,
          max: MAX_PRODUCT_QUANTITY,
          required: true,
        },
      },
    ],
  })
);

function validateMeal(meal) {
  const schema = Joi.object({
    name: Joi.string().min(1).max(40).required(),
    category: Joi.string()
      .allow(...MEAL_CATEGORIES)
      .required(),
    products: Joi.array()
      .items(
        Joi.object({
          productId: Joi.objectId().required(),
          quantity: Joi.number()
            .min(MIN_PRODUCT_QUANTITY)
            .max(MAX_PRODUCT_QUANTITY)
            .required(),
        })
      )
      .required(),
  });

  return schema.validate(meal);
}

exports.Meal = Meal;
exports.validate = validateMeal;
