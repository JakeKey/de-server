const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi");
const config = require("config");
const mongoose = require("mongoose");

const { userRoles } = require("../misc");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 30,
    trim: true,
    unique: true,
    match: /^[a-z0-9]+$/i,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 1024,
  },
  role: {
    type: String,
    enum: [userRoles.admin, userRoles.user],
    required: true,
  },
});

userSchema.methods.generateAuthToken = function () {
  return (token = jwt.sign(
    { _id: this._id, role: this.role },
    config.get("jwt.privateKey")
  ));
};

const User = mongoose.model("Users", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().min(8).max(1024).required(),
  });

  return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;
