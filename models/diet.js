const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

const Diet = mongoose.model(
  "Diets",
  new mongoose.Schema({
    name: {
      type: String,
      default: "My Diet",
      minlength: 1,
      maxlength: 40,
      trim: true,
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
    days: [
      {
        meals: [
          {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
          },
        ],
        index: {
          type: Number,
          min: 1,
          required: true,
        },
      },
    ],
  })
);

function validateDiet(diet) {
  const schema = Joi.object({
    name: Joi.string().min(1).max(40).required(),
    days: Joi.array()
      .items(
        Joi.object({
          meals: Joi.array().items(Joi.objectId().required()).required(),
          index: Joi.number().min(1).required(),
        })
      )
      .required(),
  });
  return schema.validate(diet);
}

exports.Diet = Diet;
exports.validate = validateDiet;
